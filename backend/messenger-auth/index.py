"""
Авторизация Гылекор.
POST /send-code   — генерировать OTP и вернуть код (в production заменить на SMS)
POST /verify-code — проверить код, вернуть пользователя или флаг need_profile
POST /register    — создать профиль после верификации
GET  /me?user_id= — получить данные пользователя по id
"""
import json
import os
import random
import psycopg2

SCHEMA = "t_p31859391_gylekor_messenger_pr"

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def resp(status, data):
    return {"statusCode": status, "headers": CORS, "body": json.dumps(data, ensure_ascii=False)}


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    path = event.get("path", "/")
    method = event.get("httpMethod", "POST")

    # GET /me?user_id=...
    if method == "GET" and "/me" in path:
        params = event.get("queryStringParameters") or {}
        user_id = params.get("user_id")
        if not user_id:
            return resp(400, {"error": "user_id required"})
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, phone, username, name, bio FROM {SCHEMA}.users WHERE id = %s",
            (user_id,)
        )
        row = cur.fetchone()
        conn.close()
        if not row:
            return resp(404, {"error": "Пользователь не найден"})
        return resp(200, {"user": {"id": str(row[0]), "phone": row[1], "username": row[2], "name": row[3], "bio": row[4]}})

    body = json.loads(event.get("body") or "{}")

    # POST /send-code
    if "/send-code" in path:
        phone = body.get("phone", "").strip()
        if not phone or len(phone) < 10:
            return resp(400, {"error": "Введите корректный номер телефона"})

        code = str(random.randint(100000, 999999))

        conn = get_conn()
        cur = conn.cursor()
        # Сохраняем код в БД
        cur.execute(
            f"INSERT INTO {SCHEMA}.otp_codes (phone, code) VALUES (%s, %s)",
            (phone, code)
        )
        conn.commit()
        conn.close()

        # В production здесь интеграция с SMS-провайдером (СМС.ру, SMSAERO и др.)
        # Пока возвращаем код в ответе для тестирования
        return resp(200, {"success": True, "dev_code": code, "message": f"Код отправлен на {phone}"})

    # POST /verify-code
    if "/verify-code" in path:
        phone = body.get("phone", "").strip()
        code = body.get("code", "").strip()

        if not phone or not code:
            return resp(400, {"error": "phone и code обязательны"})

        conn = get_conn()
        cur = conn.cursor()

        # Проверяем актуальный неиспользованный код
        cur.execute(
            f"""SELECT id FROM {SCHEMA}.otp_codes
                WHERE phone = %s AND code = %s AND used = FALSE AND expires_at > NOW()
                ORDER BY created_at DESC LIMIT 1""",
            (phone, code)
        )
        otp_row = cur.fetchone()

        if not otp_row:
            conn.close()
            return resp(400, {"error": "Неверный или истёкший код"})

        # Помечаем код как использованный
        cur.execute(
            f"UPDATE {SCHEMA}.otp_codes SET used = TRUE WHERE id = %s",
            (otp_row[0],)
        )

        # Проверяем, есть ли уже пользователь с таким номером
        cur.execute(
            f"SELECT id, phone, username, name, bio FROM {SCHEMA}.users WHERE phone = %s",
            (phone,)
        )
        user_row = cur.fetchone()
        conn.commit()
        conn.close()

        if user_row:
            user = {"id": str(user_row[0]), "phone": user_row[1], "username": user_row[2], "name": user_row[3], "bio": user_row[4]}
            return resp(200, {"verified": True, "need_profile": False, "user": user})
        else:
            return resp(200, {"verified": True, "need_profile": True})

    # POST /register
    if "/register" in path:
        phone = body.get("phone", "").strip()
        username = body.get("username", "").strip().lower()
        name = body.get("name", "").strip()

        if not phone or not username or not name:
            return resp(400, {"error": "phone, username и name обязательны"})

        conn = get_conn()
        cur = conn.cursor()

        # Проверяем уникальность ника
        cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE username = %s", (username,))
        if cur.fetchone():
            conn.close()
            return resp(409, {"error": "Этот ник уже занят, выберите другой"})

        cur.execute(
            f"INSERT INTO {SCHEMA}.users (phone, username, name) VALUES (%s, %s, %s) RETURNING id, phone, username, name, bio",
            (phone, username, name)
        )
        row = cur.fetchone()
        conn.commit()
        conn.close()

        user = {"id": str(row[0]), "phone": row[1], "username": row[2], "name": row[3], "bio": row[4]}
        return resp(200, {"user": user})

    return resp(404, {"error": "Not found"})
