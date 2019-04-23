const canvas = document.querySelector('#myCanvas')
const context = canvas.getContext('2d');
let score = 0
let running = true
let controls = []
let lifes = 3

function Player(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = 4
}

Player.prototype.draw = function() {
    context.fillStyle = "cyan";
    context.fillRect(this.x, this.y, this.width, this.height)
}


Player.prototype.update = function() {
    if (controls[0] === true) {
        this.x += this.speed 
    }

    if (controls[1] === true ) {
        this.x -= this.speed
    }
}

function Block(x, y, width, height, color, active, speed=3) {
    this.color = color;
    this.width = width;
    this.height = height;
    this.active = active
    this.x = x;
    this.y = y;
    this.speed = speed;
}

Block.prototype.draw = function() {
    context.fillStyle = this.color
    context.fillRect(this.x, this.y, this.width, this.height)
}

const blocks = []

for(let i=0; i < 4; i++) {
    blocks.push(new Block(50 + i  * 100, 10, 50, 50, 'orange', true, (Math.random() * (6 - 3) + 3)));
}

const player = new Player(canvas.width / 2, canvas.height - 50, 50, 50);

function draw() {
    context.fillStyle = "#222";
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = "white";
    context.font = "1em Arial";

    context.fillText(`Score: ${score}.`, 10, 20);
    context.fillText(`Vidas: ${lifes}.`, canvas.width - 80, 20);

    context.fillStyle = "green";
    context.fillRect(10, 30, 100 , 10);

    for(let block of blocks) {
        if (block.active) {
            block.draw();
        }
    }

    player.draw();
}

function update() {
    for(let block of blocks) {
        if (block.y > canvas.height) {
            block.y = -block.height;
            block.speed = Math.random() * (7 - 3) + 3;
        } else {
            block.y += block.speed;
        }

        const plA = block.x + block.width;
        const plB = player.x + player.width; 

        const phA = block.y + block.height;
        const phB = player.y + player.height;

        if (plA > player.x &&  block.x < plB && phA > player.y  && block.y < phB) {
            block.y = -block.height;
            lifes--;
        }

        if (lifes < 0) {
            running = false
        }
        
    }
    score++
    player.update()
}

function loop() {
    draw();
    update();
    if(running){
        requestAnimationFrame(loop);
    }
}

function keyUpHandler(event) {
    event.preventDefault();
    switch(event.keyCode) {
        case 37:
            controls[0] = true;
            break;
        case 39:
            controls[1] = true;
            break;
        default:
            return;
    }
}

function keyDownHandler(event) {
    event.preventDefault();
    switch(event.keyCode) {
        case 37:
            controls[0] = false;
            break;
        case 39:
            controls[1] = false;
            break;
        default:
            return;
    }
}

window.onload = function() {
    canvas.setAttribute('tabindex', '0')
    canvas.focus()
    canvas.addEventListener('keydown', keyDownHandler, false)
    canvas.addEventListener('keyup', keyUpHandler, false)
    window.requestAnimationFrame(loop)
}