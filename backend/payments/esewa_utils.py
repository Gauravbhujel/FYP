import hmac
import hashlib
import base64
import requests
from django.conf import settings

def generate_esewa_signature(total_amount, transaction_uuid, product_code):
    """
    Generates eSewa v2 HMAC-SHA256 signature.
    Message format: total_amount=110,transaction_uuid=241028,product_code=EPAYTEST
    """
    secret_key = getattr(settings, 'ESEWA_SECRET_KEY', '8gBm/:&EnhH.1/q')
    # Ensure total_amount is a string and formatted consistently
    # eSewa v2 often expects the value exactly as it appears in the form.
    message = f"total_amount={total_amount},transaction_uuid={transaction_uuid},product_code={product_code}"
    
    hmac_sha256 = hmac.new(secret_key.encode(), message.encode(), hashlib.sha256)
    digest = hmac_sha256.digest()
    signature = base64.b64encode(digest).decode('utf-8')
    return signature

def verify_esewa_payment(transaction_uuid, total_amount, product_code):
    """
    Verifies transaction status using eSewa Status Check API.
    """
    is_sandbox = getattr(settings, 'ESEWA_IS_SANDBOX', True)
    if is_sandbox:
        url = f"https://rc.esewa.com.np/api/epay/transaction/status/?product_code={product_code}&total_amount={total_amount}&transaction_uuid={transaction_uuid}"
    else:
        url = f"https://esewa.com.np/api/epay/transaction/status/?product_code={product_code}&total_amount={total_amount}&transaction_uuid={transaction_uuid}"
    
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get('status') == 'COMPLETE':
                return True, data
            else:
                return False, data
        return False, {"error": f"eSewa API returned status {response.status_code}"}
    except Exception as e:
        return False, {"error": str(e)}
