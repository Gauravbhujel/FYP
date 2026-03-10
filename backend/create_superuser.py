import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def create_admin():
    email = 'admin@gearupnepal.com'
    password = 'admin'
    
    if not User.objects.filter(email=email).exists():
        print(f"Creating superuser {email}...")
        User.objects.create_superuser(
            username='admin',
            email=email,
            password=password,
            role='admin'
        )
        print("Superuser created successfully.")
    else:
        print("Superuser already exists.")

if __name__ == "__main__":
    create_admin()
