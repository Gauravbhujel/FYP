import pymysql

# Database connection settings
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',  # Assuming empty password as per settings.py
    'port': 3306
}

def reset_database():
    try:
        # Connect to MySQL server (not specific database yet)
        connection = pymysql.connect(**db_config)
        cursor = connection.cursor()

        # Drop database if exists
        print("Dropping database 'fyp'...")
        cursor.execute("DROP DATABASE IF EXISTS fyp")

        # Create database
        print("Creating database 'fyp'...")
        cursor.execute("CREATE DATABASE fyp")

        print("Database 'fyp' reset successfully.")
        
        cursor.close()
        connection.close()
    except Exception as e:
        print(f"Error resetting database: {e}")

if __name__ == "__main__":
    reset_database()
