import os
import json
import firebase_admin
from firebase_admin import credentials, auth
from fastapi import HTTPException, Header
from typing import Optional

_initialized = False


def init_firebase():
    global _initialized
    if _initialized:
        return

    service_account_path = os.getenv(
        "FIREBASE_SERVICE_ACCOUNT_PATH",
        os.path.join(os.path.dirname(__file__), "..", "firebase-service-account.json"),
    )
    service_account_json = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")

    try:
        if service_account_json:
            cred = credentials.Certificate(json.loads(service_account_json))
        elif os.path.exists(service_account_path):
            cred = credentials.Certificate(service_account_path)
        else:
            print("No Firebase service account found. Auth verification disabled.")
            return

        firebase_admin.initialize_app(cred)
        _initialized = True
        print("Firebase Admin initialized.")
    except Exception as e:
        print(f"Firebase init failed: {e}. Auth verification disabled.")


async def verify_token(authorization: Optional[str] = Header(None)):
    if not _initialized:
        return {"uid": "anonymous", "email": "anonymous@mathpredict.ai"}

    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")

    token = authorization.split("Bearer ")[1]
    try:
        decoded = auth.verify_id_token(token)
        return {"uid": decoded["uid"], "email": decoded.get("email", "")}
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
