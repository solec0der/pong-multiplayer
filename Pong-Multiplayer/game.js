class Game {

	constructor(gameId, width, height, idPlayer1, idPlayer2) {
		this.width = width;
		this.height = height;
		this.gameId = gameId;

        this.BALL_RADIUS = 10;

		this.ballX = width / 2 - this.BALL_RADIUS / 2;
		this.ballY = height / 2 - this.BALL_RADIUS / 2;

		this.ballXSpeed = 5;
		this.ballYSpeed = 5;

        this.PADDLE_WIDTH = 10;
        this.PADDLE_HEIGHT = 100;

		this.paddle1Y = height / 2 - this.PADDLE_HEIGHT / 2;
		this.paddle2Y = height / 2 - this.PADDLE_HEIGHT / 2;

		this.player1Score = 0;
		this.player2Score = 0;

		this.idPlayer1 = idPlayer1;
		this.idPlayer2 = idPlayer2;
	}

	/**
	 * Updates the location of the ball every interval, which is 30 times a second.
	 * Furthermore, it handles the collision detection.
	 */
	update() {
		this.ballX += this.ballXSpeed;
		this.ballY += this.ballYSpeed;

		if (this.ballX > this.width || this.ballX < 0) {
			this.resetGame();
		} else if (this.ballY > this.height || this.ballY < 0) {
			this.ballYSpeed = -this.ballYSpeed;
		}

		if(this.ballX > this.width - this.PADDLE_WIDTH && (this.ballY > this.paddle2Y && this.ballY < this.paddle2Y + this.PADDLE_HEIGHT)) {
			this.ballXSpeed = -this.ballXSpeed;
		} else if(this.ballX < this.PADDLE_WIDTH && (this.ballY > this.paddle1Y && this.ballY < this.paddle1Y + this.PADDLE_HEIGHT)) {
			this.ballXSpeed = -this.ballXSpeed;
		}
	}

	/**
	 * Returns an object litteral with the ball x and y.
	 */
	getBallPosition() {
		return {
			x: this.ballX,
			y: this.ballY
		}
	}

	/**
	 * Returns an object litteral with the players paddle y positions.
	 */
	getPlayerPositions() {
		return {
			player1: this.paddle1Y,
			player2: this.paddle2Y
		}
    }
	
	/**
	 * Returns the first players id.
	 */
    getPlayer1ID() {
        return this.idPlayer1;
    }

	/**
	 * Returns the second players id.
	 */
    getPlayer2ID() {
        return this.idPlayer2;
    }
	
	/**
	 * Resets the ball and paddle positions.
	 */
	resetGame() {
		this.ballX = this.width / 2 - this.BALL_RADIUS / 2;
		this.ballY = this.height / 2 - this.BALL_RADIUS / 2;

		this.paddle1Y = this.height / 2 - this.PADDLE_HEIGHT / 2;
		this.paddle2Y = this.height / 2 - this.PADDLE_HEIGHT / 2;
	}

	move(player, dir) {
		if (player == 1) {
			switch (dir) {
				case "UP":
					this.paddle1Y -= 20;
					break;
				case "DOWN":
					this.paddle1Y += 20;
                    break;
                default:
			}
		} else if (player == 2) {
			switch (dir) {
				case "UP":
					this.paddle2Y -= 20;
					break;
				case "DOWN":
					this.paddle2Y += 20;
                    break;
                default:
                    
			}
		}
	}

	getGameId() {
		return this.gameId;
	}

}


exports.createGame = function (id, width, height, idPlayer1, idPlayer2) {
	return new Game(id, width, height, idPlayer1, idPlayer2);
}