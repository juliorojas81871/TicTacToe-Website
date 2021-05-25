"""This module runs the Server for Tic-tac-toe Game"""
import os
import time
import logging
from flask import Flask, send_from_directory
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

# global variables
global users, room_id, playerX, playerO, count
users = []
playerX = None
playerO = None
count = 0


def give_status():
    """ 
    helper functions 
    if len(users) == 1 means 1st player
    if len(users) == 2 means 2nd player
    else spectator
    """
    return len(users)


app = Flask(__name__, static_folder='./build/static')
cors = CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*", manage_session=False)

# -------------------- Database Configuration ----------------------- starts -----------------------
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DB_URI")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)


class Player(db.Model):
    """ Schema for Player table in database """
    username = db.Column(db.String,
                         unique=True,
                         nullable=False,
                         primary_key=True)
    score = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return '<Player %r>' % self.username


starting_score = 100


def send_leaderboard():
    """ fetch the database entries and send in json format """
    players = Player.query.all()
    res = []
    for player in players:  # converting to json format
        res.append({"username": player.username, "score": player.score})
    emit("leader-board", res, broadcast=True)


def add_player(data):
    """ adds new players to the database """
    me = Player(username=data, score=starting_score)
    db.session.add(me)
    db.session.commit()


def update_db_score(winner):
    """ updates the scores in the database according to the result """
    global playerX, playerO
    # print("-----------> UPDATING DB ", winner,playerX, playerO)
    player_won, player_lost = None, None
    if winner == "X":  # player X wins
        player_won = playerX
        player_lost = playerO
    elif winner == "O":  # player O wins
        player_won = playerO
        player_lost = playerX
    else:  # No one wins
        return
    # print("Updating score ", player_won, " vs ", player_lost)
    usr = Player.query.filter_by(username=player_won).first()
    usr.score += 1
    db.session.commit()
    usr = Player.query.filter_by(username=player_lost).first()
    usr.score -= 1
    db.session.commit()
    send_leaderboard()


# Extra Database feature to show previous matches
class Match(db.Model):
    """" Match Schema for Match table in database """
    id = db.Column(db.Integer, nullable=False, primary_key=True)
    playerx = db.Column(db.String, nullable=False)
    playero = db.Column(db.String, nullable=False)

    def __repr__(self):
        return '<Match %r vs %r>' % (self.playerx, self.playero)


def append_match():
    """ adds the matches to database """
    global playerX, playerO
    matc = Match(id=time.time(), playerx=playerX, playero=playerO)
    db.session.add(matc)
    db.session.commit()
    send_match_db()


def send_match_db():
    """ Sends list of matches held till now """
    matches = Match.query.all()
    res = []
    for match in matches:  # converting to json format
        res.append({
            "time": match.id,
            "playerx": match.playerx,
            "playero": match.playero
        })
    emit("match-board", res, broadcast=True)


# -------------------- Database Configuration ----------------------- ends -----------------------


@app.route('/', defaults={"filename": "index.html"})
@app.route('/app')
def index(filename):
    return send_from_directory(
        './build', filename)  # send the index.html from build folder


@socketio.on("connect")
def first_connect():
    """ # to make the first connection """
    global count
    count += 1
    # print("Client Req : ", request.sid, " -- Connection number : ", count) #.sessid


@socketio.on("join")
def addUser(data):
    """ # add user to the users global variable """
    global users, playerX, playerO
    for usr in users:
        if usr == data:
            emit("user-status", -1, broadcast=False)
            # print("same name user", data)
            return
    users.append(data)
    # return give_status() # only for testing the function
    # return the user number i.e. 1st, 2nd, so on
    emit("user-status", give_status(), broadcast=False)
    if give_status() == 1: playerX = data
    elif give_status() == 2:
        playerO = data
        append_match()
    usr = Player.query.filter_by(username=data).first()
    if usr is None: add_player(data)
    send_leaderboard()


@socketio.on("users-list")
def getUsers(data):
    """ returns the list of user currently online """
    # return users # only for testing the function
    emit(
        "users", users,
        broadcast=True)  # returns the users that have been connected to server


@socketio.on("my-move")
def catchMove(data):
    """ # takes the game state (matrix) and sends it to all the clients """
    emit("game-play", data, broadcast=True, include_self=False)


@socketio.on("winner")
def updateScore(data):
    """ # whenever a player wins it helps to broadcast the message to all clients """
    emit("score", data, broadcast=True)
    update_db_score(data)


@socketio.on("game-state")
def gameState(state):
    """
    It help to pause and wait for restart when the game in over
    Also gives a restart signal if someone restarts the game 
    """
    if (state == "GO"):  # GO : Game Over
        emit("gamemode", "H",
             broadcast=True)  # H : Hault and wait to press restart
    else:  # RG : Restart Game
        emit("gamemode", "C",
             broadcast=True)  # C : Continue (On pressing Restart)


@socketio.on("update-leader-board")
def update_lb(data):
    """ # send the updated Leaderboard # function defined in Line 48 """
    send_leaderboard()


@socketio.on("update-match-board")
def update_mb(data):
    """ # Extra Feature Previous match display """
    send_match_db()


# disable network logs
log = logging.getLogger('werkzeug')
log.disabled = True
"""
comment this before running the test file
under development
"""
# app.run(
#     host=os.getenv('IP', '127.0.0.1'),
#     port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
# )

# Delpoyement
app.run()
