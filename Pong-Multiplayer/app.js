var fs = require('fs');

var key = fs.readFileSync('ssl/private.key');
var cert = fs.readFileSync('ssl/certificate.crt');
var ca = fs.readFileSync('ssl/ca_bundle.crt');

var options = {
    key: key,
    cert: cert,
    ca: ca
}

var express = require('express');
var app = express();
var https = require('https').createServer(options, app);
var io = require('socket.io')(https);

var game = require('./game');

var games = {};

var playersWaiting = [];

app.use(express.static('public'));

function makeId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

io.on('connection', function (socket) {

    socket.on('join', function (data, fn) {
        socket.winSize = {
            height: data.height,
            width: data.width
        }
        if (!playersWaiting.includes(data.id)) {
            playersWaiting.push(data.id);
            if (playersWaiting.length > 1) {
                var newId = makeId();

                playersWaiting.splice(playersWaiting.indexOf(data.id), 1);
                var id2 = playersWaiting.splice(0, 1)[0];

                var player2Socket = io.sockets.connected[id2];

                var height, width;
                if (data.height * data.width > player2Socket.winSize.height * player2Socket.winSize.width) {
                    height = player2Socket.winSize.height;
                    width = player2Socket.winSize.width;
                } else {
                    height = data.height;
                    width = data.width;

                }

                games[newId] = game.createGame(newId, width, height, data.id, id2);

                var gameData = {
                    gameFound: true,
                    gameId: newId,
                    width: games[newId].width,
                    height: games[newId].height
                }

                player2Socket.join(newId);
                player2Socket.emit('start', gameData);
                socket.join(newId);
                fn(gameData);
            }
        }
        fn({
            gameFound: false
        });
    });

    socket.on('move', function (data) {
        var game = games[data.gameId];

        if (data.playerId == game.getPlayer1ID()) {
            game.move(1, data.direction);
        } else if (data.playerId == game.getPlayer2ID()) {
            game.move(2, data.direction);
        }
    });

    socket.on('disconnect', function () {
        playersWaiting.splice(playersWaiting.indexOf(socket.id));
    });

    socket.on('reconnect', function () {
        playersWaiting.splice(playersWaiting.indexOf(socket.id));
    });
});

function update() {
    Object.keys(games).forEach(function (key, index) {
        var game = games[key];
        game.update();

        var data = {
            ballPos: game.getBallPosition(),
            paddlePos: game.getPlayerPositions()
        }

        io.to(key).emit('update', data);
    });
}

https.listen(8080, function () {
    setInterval(update, 1000 / 30);
});