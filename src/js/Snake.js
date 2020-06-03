export default class {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.initialSnake = { x: 40, y: 40, w: 10, h: 10 };
        this.currentPositionX = this.initialSnake.x;
        this.currentPositionY = this.initialSnake.y;
        this.throughTheWallFlag = true;
        this.time = 0;
        this.appleXY = 0;
        this.arrayAss = [];
        this.path = [[this.currentPositionX, this.currentPositionX]];

    }

    initPlate() {

        this.canvas.width = 400;
        this.canvas.height = 400;
        this.ctx.fillStyle = '#8f8989';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.showPoints();
    }

    drawSnake() {

        this.drawOrDelete(this.currentPositionX, this.currentPositionY)
        this.appleXY = this.drawRandomApple();

    }
    gameOver() {

        this.initPlate();
        this.drawSnake();
        this.path = [[this.currentPositionX, this.currentPositionX]];
        this.arrayAss = [];
        this.time = 0;
        console.log("Przegrales");
    }

    showPoints() {

        const points = document.querySelector('.points')
        const timer = document.querySelector('.timer')
        points.textContent = `Points: ${this.arrayAss.length}`
        document.body.appendChild(points);
        timer.textContent = `Time: ${this.time}`
        document.body.appendChild(timer);
    }

    drawRandomApple() {

        let positionX, positionY;

        const generateRandom = () => {
            positionX = Math.floor(Math.random() * 39) * 10;
            positionY = Math.floor(Math.random() * 39) * 10;
            for (let i = 0; i < this.path.length; i++) {
                if (positionX === this.path[i][0] && positionY === this.path[i][1]) {
                    return generateRandom();
                }
            }

        }
        generateRandom();
        this.drawOrDelete(positionX, positionY, '#47d647')
        return [positionX, positionY];

    }

    arrayAssPushApple() {

        if (this.currentPositionX == this.appleXY[0] && this.currentPositionY == this.appleXY[1]) {
            this.appleXY = this.drawRandomApple();
            this.arrayAss.push(this.appleXY)
        }
    }

    checkLose() {

        const temporaryArrayOfX = [];
        const temporaryArrayOfY = [];
        for (let i = 0; i < this.path.length; i++) {
            temporaryArrayOfX[i] = this.path[i][0];
            temporaryArrayOfY[i] = this.path[i][1];

            if (temporaryArrayOfX[i] === this.currentPositionX && temporaryArrayOfY[i] === this.currentPositionY) {
                if (temporaryArrayOfX[i] === this.path[0][0] || temporaryArrayOfX[i] === this.path[1][0] &&
                    temporaryArrayOfY[i] === this.path[0][1] || temporaryArrayOfX[i] === this.path[1][1]) return;
                else {
                    this.gameOver();
                    return 0;
                }
            }
        }
    }



    throughTheWall(position, flag, yesNo) {

        if (position < 0 && flag) {
            this.currentPositionX = 390;
            if (yesNo) return this.gameOver();
            this.drawOrDelete(0, this.currentPositionY, '#8f8989')
        } else if (position > 390 && flag) {
            this.currentPositionX = 0;
            if (yesNo) return this.gameOver();
            this.drawOrDelete(390, this.currentPositionY, '#8f8989')
        } else if (position < 0 && !flag) {
            this.currentPositionY = 390;
            if (yesNo) return this.gameOver();
            this.drawOrDelete(this.currentPositionX, 0, '#8f8989')
        } else if (position > 390 && !flag) {
            this.currentPositionY = 0;
            if (yesNo) return this.gameOver();
            this.drawOrDelete(this.currentPositionX, 390, '#8f8989')
        }
    }

    // move Direction Methods

    drawOrDelete(positionX, positionY, color = "#e41aa0") {

        this.ctx.save();
        this.ctx.fillStyle = color;
        this.ctx.fillRect(positionX, positionY, this.initialSnake.w, this.initialSnake.h);
        this.ctx.restore();
    }

    pushPath() {

        this.path = this.path.slice((-2 - this.arrayAss.length))
        this.path.push([this.currentPositionX, this.currentPositionY])
        //Optimalization of array, If I didn't do that, the array would increase until the end of the game
    }

    moveForAll() {

        this.showPoints();
        this.drawOrDelete(this.currentPositionX, this.currentPositionY)
        this.checkLose()
        this.arrayAssPushApple();
        this.pushPath();

        if (this.arrayAss.length) {

            for (let i = 0; i < this.arrayAss.length; i++) {

                this.drawOrDelete(this.path[this.path.length - (i + 2)][0], this.path[this.path.length - (i + 2)][1])
            }

            this.drawOrDelete(this.path[this.path.length - this.arrayAss.length - 2][0], this.path[this.path.length - this.arrayAss.length - 2][1], '#8f8989') //delete

        } else {

            this.drawOrDelete(this.path[this.path.length - 2][0], this.path[this.path.length - 2][1], '#8f8989') //delete
        }

    }

    moveLeft() {
        this.currentPositionX -= 10;
        this.throughTheWall(this.currentPositionX, true, this.throughTheWallFlag)
        this.moveForAll();

    }
    moveRight() {
        this.currentPositionX += 10;
        this.throughTheWall(this.currentPositionX, true, this.throughTheWallFlag)
        this.moveForAll();
    }
    moveUp() {

        this.currentPositionY -= 10;
        this.throughTheWall(this.currentPositionY, false, this.throughTheWallFlag)
        this.moveForAll();
    }
    moveDown() {
        this.currentPositionY += 10;
        this.throughTheWall(this.currentPositionY, false, this.throughTheWallFlag)
        this.moveForAll();
    }

    run() {
        this.initPlate();
        this.drawSnake();
        this.draw();


        setInterval(() => ++this.time, 1000);

        let move = 0;
        let leftRightUpDown = 0;

        window.addEventListener('keydown', (e) => {

            const direction = e.keyCode;

            if (direction) {
                switch (direction) {
                    case 37:
                        if (leftRightUpDown === 2) break;
                        leftRightUpDown = 1;
                        this.moveLeft()
                        clearInterval(move)
                        move = setInterval(() => this.moveLeft(), 50);
                        break;
                    case 39:
                        if (leftRightUpDown === 1) break;
                        leftRightUpDown = 2;
                        this.moveRight()
                        clearInterval(move)
                        move = setInterval(() => this.moveRight(), 50);
                        break;
                    case 38:
                        if (leftRightUpDown === 4) break;
                        leftRightUpDown = 3;
                        this.moveUp()
                        clearInterval(move)
                        move = setInterval(() => this.moveUp(), 50);
                        break;
                    case 40:
                        if (leftRightUpDown === 3) break;
                        leftRightUpDown = 4;
                        this.moveDown()
                        clearInterval(move)
                        move = setInterval(() => this.moveDown(), 50);
                        break;
                    default:
                        break;

                }
            }
        })
    }

    draw() {
        window.requestAnimationFrame(() => this.draw())
    }
}
