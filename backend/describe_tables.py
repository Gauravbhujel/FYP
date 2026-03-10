import pymysql

db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'fyp',
    'port': 3306
}

def describe_table(table_name):
    try:
        connection = pymysql.connect(**db_config)
        cursor = connection.cursor()
        
        print(f"Columns in '{table_name}':")
        cursor.execute(f"DESCRIBE {table_name}")
        columns = cursor.fetchall()
        
        # Only print field name and type to save space
        for col in columns:
            print(f"- {col[0]} ({col[1]})")
                
        cursor.close()
        connection.close()
    except Exception as e:
        print(f"Error describing table {table_name}: {e}")

if __name__ == "__main__":
    describe_table('loginsignup_customuser')
