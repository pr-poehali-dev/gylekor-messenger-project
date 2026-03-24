"""
Регистрация и вход пользователя в Гылекор.
POST /register — создать/найти пользователя по номеру телефона, нику и имени.
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

    body = json.loads(event.get("body") or "{}")
    phone = body.get("phone", "").strip()
    username = body.get("username", "").strip().lower()
    name = body.get("name", "").strip()

    if not phone or not username or not name:
        return {
            "statusCode": 400,
            "headers": CORS,
            "body": json.dumps({"error": "phone, username и name обязательны"}),
        }

    conn = get_conn()
    cur = conn.cursor()

    # Проверяем, существует ли пользователь с таким телефоном
    cur.execute(
        f"SELECT id, phone, username, name, bio FROM {SCHEMA}.users WHERE phone = %s",
        (phone,),
    )
    row = cur.fetchone()

    if row:
        user = {"id": str(row[0]), "phone": row[1], "username": row[2], "name": row[3], "bio": row[4]}
    else:
        # Проверяем уникальность ника
        cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE username = %s", (username,))
        if cur.fetchone():
            conn.close()
            return {
                "statusCode": 409,
                "headers": CORS,
                "body": json.dumps({"error": "Этот ник уже занят"}),
            }

        cur.execute(
            f"INSERT INTO {SCHEMA}.users (phone, username, name) VALUES (%s, %s, %s) RETURNING id, phone, username, name, bio",
            (phone, username, name),
        )
        row = cur.fetchone()
        conn.commit()
        user = {"id": str(row[0]), "phone": row[1], "username": row[2], "name": row[3], "bio": row[4]}

    conn.close()
    return {
        "statusCode": 200,
        "headers": CORS,
        "body": json.dumps({"user": user}),
    }
