
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User

def create_admin():
    username = "admin"
    email = "admin@gearupnepal.com"
    password = "admin"

    if User.objects.filter(username=username).exists():
        print(f"User '{username}' already exists.")
    elif User.objects.filter(email=email).exists():
        print(f"User with email '{email}' already exists.")
    else:
        User.objects.create_superuser(username=username, email=email, password=password)
        print(f"Superuser '{username}' created successfully with email '{email}'.")

if __name__ == "__main__":
    create_admin()
