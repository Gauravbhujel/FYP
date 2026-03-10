import pymysql

db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'fyp',
    'port': 3306
}

def list_tables():
    try:
        connection = pymysql.connect(**db_config)
        cursor = connection.cursor()
        
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        
        if not tables:
            print("No tables found in database 'fyp'.")
        else:
            print("Tables in 'fyp':")
            for table in tables:
                print(table[0])
                
        cursor.close()
        connection.close()
    except Exception as e:
        print(f"Error listing tables: {e}")

if __name__ == "__main__":
    list_tables()
