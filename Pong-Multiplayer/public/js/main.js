var socket = io();

var gameId;

var canvas;
var ctx;

var ballX;
var ballY;

var paddle1Y;
var paddle2Y;

window.onload = function() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
}


function joinGame() {
    var data = {
        id: socket.id,
        width: screen.width*0.5,
        height: screen.height*0.5
    }

    socket.emit('join', data, function (data) {
        if(data.gameFound) {
            gameId = data.gameId;
            ctx.canvas.width = data.width;
            ctx.canvas.height = data.height;
            gameStart();
        } else {
            console.log("waiting...");
            socket.on('start', function (data) {
                gameId = data.gameId;
                ctx.canvas.width = data.width;
                ctx.canvas.height = data.height;
                gameStart();
            })
        }
    });

    socket.on('update', function (data) {
        ballX = data.ballPos.x;
        ballY = data.ballPos.y;
        paddle1Y = data.paddlePos.player1;
        paddle2Y = data.paddlePos.player2;
    })
}

function gameStart() {
    window.onkeyup = function(e) {
        var key = e.keyCode ? e.keyCode : e.which;
     
        if (key == 38) {
            console.log("naja");
            move("UP");
        }else if (key == 40) {
            console.log("ne");
            move("DOWN");
        }
     }

    setInterval(loop, 1000/30);
}

function loop() {
    update();
    draw();
}

function update() {

}

function draw() {
    rect(0, 0, canvas.width, canvas.height, "black");
    rect(ballX, ballY, 10, 10, "white");
    rect(0, paddle1Y, 10, 100, "white");
    rect(canvas.width-10, paddle2Y, 10, 100, "white");
    console.log("1: " + paddle1Y + "; 2: " + paddle2Y);
    console.log("X: " + ballX + "; Y: " + ballY);
}

function move(dir) {
    var data = {
        gameId: gameId,
        playerId: socket.id,
        direction: dir
    }
    socket.emit('move', data);
}



 function rect(x, y, w, h, color) {
     ctx.fillStyle = color;
     ctx.fillRect(x, y, w, h);
 }