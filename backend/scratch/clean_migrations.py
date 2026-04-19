from django.db import connection

def run():
    with connection.cursor() as cursor:
        print("Cleaning up migration history for orders and payments...")
        cursor.execute("DELETE FROM django_migrations WHERE app = 'orders'")
        cursor.execute("DELETE FROM django_migrations WHERE app = 'payments'")
        print("Cleanup successful.")

if __name__ == "__main__":
    import os
    import django
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
    django.setup()
    run()
