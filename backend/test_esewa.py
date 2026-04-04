import hmac
import hashlib
import base64

def generate_esewa_signature(total_amount, transaction_uuid, product_code, secret_key):
    message = f"total_amount={total_amount},transaction_uuid={transaction_uuid},product_code={product_code}"
    print(f"Signing message: {message}")
    hmac_sha256 = hmac.new(secret_key.encode(), message.encode(), hashlib.sha256)
    digest = hmac_sha256.digest()
    signature = base64.b64encode(digest).decode('utf-8')
    return signature

# Constants from eSewa docs
PRODUCT_CODE = 'EPAYTEST'
SECRET_KEY = '8gBm/:&EnhH.1/q'

# Test Case from User Screenshot: total_amount=99.0
test_amount = "99.0"
test_uuid = "test-uuid-123"
sig = generate_esewa_signature(test_amount, test_uuid, PRODUCT_CODE, SECRET_KEY)
print(f"Signature for {test_amount}: {sig}")

# Test Case for Integer: total_amount=99
test_amount_int = "99"
sig_int = generate_esewa_signature(test_amount_int, test_uuid, PRODUCT_CODE, SECRET_KEY)
print(f"Signature for {test_amount_int}: {sig_int}")
