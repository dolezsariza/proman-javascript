import persistence
import connection
from psycopg2 import sql

@connection.connection_handler
def get_card_status(cursor, status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    # statuses = persistence.get_statuses()
    # return next((status['title'] for status in statuses if status['id'] == str(status_id)), 'Unknown')

    cursor.execute(sql.SQL("""SELECT title FROM statuses WHERE id = {}""")
                   .format(sql.SQL(status_id)))

    print(cursor.fetchone())

    return cursor.fetchone()

@connection.connection_handler
def get_boards(cursor):

    cursor.execute("""
                    SELECT * FROM boards
                    ORDER BY id ASC;
                    """)
    data = cursor.fetchall()
    return data


"""
def get_cards_for_board(board_id):
    persistence.clear_cache()
    all_cards = persistence.get_cards()
    matching_cards = []
    for card in all_cards:
        if card['board_id'] == str(board_id):
            card['status_id'] = get_card_status(card['status_id'])  # Set textual status for the card
            matching_cards.append(card)
    return matching_cards"""

@connection.connection_handler
def get_cards_for_board(cursor, board_id):
    cursor.execute("""SELECT * FROM cards WHERE board_id=%(board_id)s;""",
                   {"board_id": board_id})

    cards_data = cursor.fetchall()
    return cards_data


@connection.connection_handler
def rename_board(cursor, board_id, new_name):
    cursor.execute("""
                    UPDATE boards
                    SET title = %(new_name)s
                    WHERE id = %(board_id)s;
                    """,

                    {'board_id':board_id, 'new_name': new_name})

@connection.connection_handler
def add_new_board(cursor, name):
    cursor.execute("""
                    INSERT INTO boards (title) VALUES (%(name)s);
                    """,
                    {'name':name})