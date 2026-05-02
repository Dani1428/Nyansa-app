import psycopg2
from psycopg2 import sql

def setup_db():
    try:
        # Connect to default 'postgres' database to perform administrative tasks
        conn = psycopg2.connect(dbname='postgres', user='postgres', host='localhost')
        conn.autocommit = True
        cur = conn.cursor()
        
        # Cleanup if exists
        print("Cleaning up existing database/user...")
        try:
            cur.execute("DROP DATABASE IF EXISTS nyansa_ai")
            cur.execute("DROP USER IF EXISTS nyansa_ai")
        except Exception as e:
            print(f"Cleanup warning: {e}")

        # Create user and database
        print("Creating user nyansa_ai...")
        cur.execute("CREATE USER nyansa_ai WITH PASSWORD '12345678'")
        
        print("Creating database nyansa_ai...")
        cur.execute("CREATE DATABASE nyansa_ai OWNER nyansa_ai")
        
        cur.close()
        conn.close()
        print("Database 'nyansa_ai' and user 'nyansa_ai' created successfully!")
        return True
    except Exception as e:
        print(f"Error during database setup: {e}")
        return False

if __name__ == "__main__":
    setup_db()
