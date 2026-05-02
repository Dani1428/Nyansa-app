import psycopg2
import sys

try:
    conn = psycopg2.connect("postgresql://nyansa_ai:12345678@localhost:5432/nyansa_ai")
    print("Connection successful!")
    conn.close()
except Exception as e:
    print(f"Connection failed: {e}")
    sys.exit(1)
