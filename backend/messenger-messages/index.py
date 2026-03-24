"""
API сообщений Гылекор.
GET  /?chat_id=... — загрузить сообщения чата
POST /           — отправить сообщение
GET  /chats?user_id=... — список чатов пользователя
POST /chats      — создать чат между двумя пользователями
"""
import json
import os
import psycopg2

SCHEMA = "t_p31859391_gylekor_messenger_pr"

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    path = event.get("path", "/")
    params = event.get("queryStringParameters") or {}

    conn = get_conn()
    cur = conn.cursor()

    # GET /chats — список чатов пользователя
    if method == "GET" and "/chats" in path:
        user_id = params.get("user_id")
        if not user_id:
            conn.close()
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "user_id required"})}

        cur.execute(f"""
            SELECT c.id,
                   u.id as partner_id, u.name, u.username,
                   (SELECT text FROM {SCHEMA}.messages m WHERE m.chat_id = c.id ORDER BY m.created_at DESC LIMIT 1) as last_msg,
                   (SELECT TO_CHAR(created_at, 'HH24:MI') FROM {SCHEMA}.messages m WHERE m.chat_id = c.id ORDER BY m.created_at DESC LIMIT 1) as last_time,
                   (SELECT COUNT(*) FROM {SCHEMA}.messages m WHERE m.chat_id = c.id AND m.sender_id != %s) as unread
            FROM {SCHEMA}.chats c
            JOIN {SCHEMA}.users u ON (
                CASE WHEN c.user1_id = %s THEN c.user2_id ELSE c.user1_id END = u.id
            )
            WHERE c.user1_id = %s OR c.user2_id = %s
            ORDER BY last_time DESC NULLS LAST
        """, (user_id, user_id, user_id, user_id))

        chats = []
        for row in cur.fetchall():
            chats.append({
                "id": str(row[0]),
                "partner_id": str(row[1]),
                "name": row[2],
                "username": row[3],
                "last_message": row[4] or "",
                "last_time": row[5] or "",
                "unread": int(row[6]),
            })
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"chats": chats})}

    # POST /chats — создать или получить чат
    if method == "POST" and "/chats" in path:
        body = json.loads(event.get("body") or "{}")
        user1_id = body.get("user1_id")
        user2_id = body.get("user2_id")
        if not user1_id or not user2_id:
            conn.close()
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "user1_id и user2_id обязательны"})}

        # Нормализуем порядок
        uid1, uid2 = sorted([user1_id, user2_id])

        cur.execute(
            f"SELECT id FROM {SCHEMA}.chats WHERE user1_id = %s AND user2_id = %s",
            (uid1, uid2)
        )
        row = cur.fetchone()
        if row:
            chat_id = str(row[0])
        else:
            cur.execute(
                f"INSERT INTO {SCHEMA}.chats (user1_id, user2_id) VALUES (%s, %s) RETURNING id",
                (uid1, uid2)
            )
            chat_id = str(cur.fetchone()[0])
            conn.commit()

        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"chat_id": chat_id})}

    # GET / — сообщения чата
    if method == "GET":
        chat_id = params.get("chat_id")
        if not chat_id:
            conn.close()
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "chat_id required"})}

        cur.execute(f"""
            SELECT m.id, m.sender_id, m.text, TO_CHAR(m.created_at, 'HH24:MI'), m.created_at
            FROM {SCHEMA}.messages m
            WHERE m.chat_id = %s
            ORDER BY m.created_at ASC
            LIMIT 200
        """, (chat_id,))

        messages = []
        for row in cur.fetchall():
            messages.append({
                "id": str(row[0]),
                "sender_id": str(row[1]),
                "text": row[2],
                "time": row[3],
            })
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"messages": messages})}

    # POST / — отправить сообщение
    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        chat_id = body.get("chat_id")
        sender_id = body.get("sender_id")
        text = body.get("text", "").strip()

        if not chat_id or not sender_id or not text:
            conn.close()
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "chat_id, sender_id и text обязательны"})}

        cur.execute(
            f"INSERT INTO {SCHEMA}.messages (chat_id, sender_id, text) VALUES (%s, %s, %s) RETURNING id, TO_CHAR(created_at, 'HH24:MI')",
            (chat_id, sender_id, text)
        )
        row = cur.fetchone()
        conn.commit()
        conn.close()

        return {
            "statusCode": 200,
            "headers": CORS,
            "body": json.dumps({"message": {"id": str(row[0]), "time": row[1], "text": text, "sender_id": sender_id, "chat_id": chat_id}}),
        }

    conn.close()
    return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "Not found"})}
