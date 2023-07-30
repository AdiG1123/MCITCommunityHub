from dotenv import dotenv_values
import psycopg2

def pg_db_connect(secrets):
    conn = psycopg2.connect(
        host=secrets["HOST"],
        database=secrets["DATABASE"],
        user=secrets["USER"],
        password=secrets["PASSWORD"],
        port=secrets["PORT"]
    )
    return conn

def write_to_course_table(cursor):
    pass

if __name__ == "__main__":
    try:
        secrets = dotenv_values("C:/Users/gargk/Workspace/MCITCommunityHub/scripts/.env.secret")
        conn = pg_db_connect(secrets=secrets)
        cur = conn.cursor()
        cur.execute('SELECT * FROM "Courses"')
        print(cur.fetchone())
        cur.close()
    except (Exception, psycopg2.DatabaseError) as err:
        print(err)
    finally:
        if conn is not None:
            conn.close()
            print("DB connection terminated.")
