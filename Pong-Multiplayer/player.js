class Player {
    constructor(id, width, height) {
        this.id = id;
        this.width = width;
        this.height = height;
    }

    getID() {
        return this.id;
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }
}

exports.newPlayer = function (id, width, height) {
	return new Player(id, width, height);
}