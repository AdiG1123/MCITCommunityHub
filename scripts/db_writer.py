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

def write_to_course_table(cursor, values):
    
    args = ','.join(cursor.mogrify("(%s, %s, %s, %s, %s, %s)", x).decode('utf-8') 
                    for x in values)
    print(args)
    query = f'''
        INSERT INTO "Courses" (coursenumber, coursename, syllabus, description, textbooks, summaryreview)
        VALUES {args};
        '''.strip()
    cursor.execute(query)

def write_to_professor(cursor, values):

    args = ','.join(cursor.mogrify("(%s, %s)", x).decode('utf-8')
                    for x in values)
    print(args)
    query = f'''
        INSERT INTO "Professors" VALUES {args};
    '''.strip()
    cursor.execute(query)

def write_to_resources(cursor, values):

    args = ','.join(cursor.mogrify("(%s, %s, %s)", x).decode('utf-8')
                    for x in values)
    print(args)
    query = f'''
        INSERT INTO "SupplementalResources" VALUES {args};
    '''.strip()

    cursor.execute(query)

def write_to_semesteroffered(cursor, values):

    args = ','.join(cursor.mogrify("(%s, %s)", x).decode('utf-8')
                    for x in values)
    print(args)
    query = f'''
        INSERT INTO "SemesterOffered" VALUES {args};
    '''.strip()

    cursor.execute(query)

def write_to_prereqs(cursor, values):

    args = ','.join(cursor.mogrify("(%s, %s, %s)", x).decode('utf-8')
                    for x in values)
    print(args)
    query = f'''
        INSERT INTO "Prereqs" VALUES {args};
    '''.strip()

    cursor.execute(query)


if __name__ == "__main__":
    try:
        secrets = dotenv_values("C:/Users/gargk/Workspace/MCITCommunityHub/scripts/.env.secret")
        conn = pg_db_connect(secrets=secrets)
        conn.autocommit =  True
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
