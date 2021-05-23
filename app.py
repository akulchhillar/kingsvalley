from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit, join_room, rooms
from coolname import generate_slug

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@app.route('/')
def hello_world():
    return render_template("index.html")

@app.route('/white/<room_id>')
def white(room_id):
    return render_template("white.html")

@app.route('/black/<room_id>')
def black(room_id):
    return render_template("black.html")


@socketio.on('message',namespace="/white")
def white(data):
    join_room(data)
    #White player Joins the game

@socketio.on('message',namespace="/black")
def black(data):
    join_room(data)

    #Black player Joins the game

@socketio.on('wm',namespace="/white")
def wm(data):
    emit("wm",data[:2],namespace="/black",room=data[-1])


@socketio.on('bm',namespace="/black")
def bm(data):
    emit("bm",data[:2],namespace="/white",room=data[-1])

@socketio.on('cbm',namespace="/white")
def cbm(data):
    emit("cbm",data[0],namespace="/black",room=data[-1])

@socketio.on('result',namespace="/black")
def bresult(data):
    emit("result",data[0],namespace="/white",room=data[-1])

@socketio.on('result',namespace="/white")
def wresult(data):
    emit("result",data[0],namespace="/black",room=data[-1])

@socketio.on('roomid')
def roomid():
    emit("roomid",generate_slug(2))


if __name__ == '__main__':
    socketio.run(app, debug=True)