from flask import Flask, render_template, url_for, request, redirect
from util import json_response

import data_handler

app = Flask(__name__)


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route("/get-boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return data_handler.get_boards()

@app.route("/change-title", methods=["GET","POST"])
def change_title():
    if request.method == "POST":
        board_id = request.form["board_id"]
        new_title = request.form["newTitle"]
        data_handler.rename_board(board_id, new_title)
    return redirect("/")

@app.route("/add-new-board", methods=["GET","POST"])
def add_new_board():
    if request.method == "POST":
        title = request.form["title"]
        data_handler.add_new_board(title)
    return redirect("/")



@app.route("/get-cards/<int:board_id>")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """

    return data_handler.get_cards_for_board(board_id)

@app.route("/add-new-card/<int:board_id>")
@json_response
def add_new_card(board_id: int):
    """
    All the boards
    """
    return data_handler.add_new_card(board_id)


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
