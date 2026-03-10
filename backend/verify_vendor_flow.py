import urllib.request
import urllib.parse
import json
import random
import string

BASE_URL = "http://127.0.0.1:8000"

def get_random_string(length):
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(length))

def make_request(url, method="GET", data=None):
    headers = {'Content-Type': 'application/json'}
    if data:
        data = json.dumps(data).encode('utf-8')
    
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            return response.status, json.loads(response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode('utf-8'))
    except Exception as e:
        return 500, {"error": str(e)}

def verify_flow():
    email = f"vendor_{get_random_string(5)}@example.com"
    password = "password123"
    
    print(f"Testing with email: {email}")

    # 1. Vendor Signup
    signup_url = f"{BASE_URL}/api/vendor/signup/"
    payload = {
        "email": email,
        "password": password,
        "confirmPassword": password,
        "firstName": "Vendor",
        "lastName": "Test",
        "storeName": "Test Store",
        "phone": "1234567890",
        "address": "123 Test St",
        "city": "Test City",
        "state": "Test State",
        "zipCode": "12345"
    }
    
    status, response = make_request(signup_url, "POST", payload)
    print(f"Signup Status: {status}")
    print(f"Signup Response: {response}")
    
    if status != 201:
        print("Signup failed!")
        return

    # 2. Login
    login_url = f"{BASE_URL}/api/login/"
    login_payload = {
        "email": email,
        "password": password
    }
    
    status, response = make_request(login_url, "POST", login_payload)
    print(f"Login Status: {status}")
    print(f"Login Response: {response}")
    
    if status == 200:
        if response.get("role") == "vendor":
            print("SUCCESS: Logged in and role is vendor!")
        else:
            print(f"FAILURE: Role is {response.get('role')}, expected 'vendor'")
    else:
        print("Login failed!")

    # 3. Duplicate Email Check
    print("Testing duplicate email...")
    status, response = make_request(signup_url, "POST", payload)
    print(f"Duplicate Signup Status: {status}")
    if status == 400:
         print("SUCCESS: Duplicate email prevented.")
    else:
         print("FAILURE: Duplicate email allowed or other error.")

if __name__ == "__main__":
    verify_flow()
