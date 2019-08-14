import psycopg2
import psycopg2.extras
import os


def connectToDB():
    try:
        user_name = os.environ.get("PSQL_USERNAME")
        password = os.environ.get("PSQL_PASSWORD")
        host = os.environ.get("PSQL_HOST")
        database_name = os.environ.get("PSQL_DBNAME")

        connect_str = "postgresql://{user_name}:{password}@{host}/{database_name}".format(
            user_name=user_name,
            password=password,
            host=host,
            database_name=database_name
        )

        connection = psycopg2.connect(connect_str)
        connection.autocommit = True

        return connection

    except psycopg2.DatabaseError as exception:
        print(exception)


def connection_handler(function):
    def wrapper(*args, **kwargs):
        connection = connectToDB()
        dict_cur = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        ret_value = function(dict_cur, *args, **kwargs)
        dict_cur.close()
        connection.close()

        return ret_value

    return wrapper
