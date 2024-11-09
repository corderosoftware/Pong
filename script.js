// script.js

// Obtener el lienzo y el contexto del juego
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Variables de la paleta (raquetas)
const paddleWidth = 10, paddleHeight = 100;

// Jugadores
const player1 = {
    x: 0, 
    y: canvas.height / 2 - paddleHeight / 2, 
    width: paddleWidth, 
    height: paddleHeight, 
    color: '#ff0000',
    dy: 0
};
const player2 = {
    x: canvas.width - paddleWidth, 
    y: canvas.height / 2 - paddleHeight / 2, 
    width: paddleWidth, 
    height: paddleHeight, 
    color: '#00ff00',
    dy: 0
};

// Pelota
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speedX: 4,
    speedY: 4,
    color: '#fff'
};

// Puntuación
let scorePlayer1 = 0;
let scorePlayer2 = 0;

// Función para dibujar el fondo
function drawBackground() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Función para dibujar la paleta
function drawPaddle(paddle) {
    ctx.fillStyle = paddle.color;
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// Función para dibujar la pelota
function drawBall() {
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
}

// Función para mover la pelota
function moveBall() {
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Colisión con las paredes superior e inferior
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.speedY = -ball.speedY;
    }

    // Colisión con las paletas (jugadores)
    if (ball.x - ball.radius < player1.x + player1.width && ball.y > player1.y && ball.y < player1.y + player1.height) {
        ball.speedX = -ball.speedX;
    }
    if (ball.x + ball.radius > player2.x && ball.y > player2.y && ball.y < player2.y + player2.height) {
        ball.speedX = -ball.speedX;
    }

    // Comprobar si algún jugador anota
    if (ball.x - ball.radius < 0) {
        scorePlayer2++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        scorePlayer1++;
        resetBall();
    }
}

// Función para reiniciar la pelota al centro
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = -ball.speedX;  // Cambiar dirección de la pelota
    ball.speedY = 4 * (Math.random() > 0.5 ? 1 : -1);  // Dirección aleatoria en el eje Y
}

// Función para mover las paletas
function movePaddles() {
    player1.y += player1.dy;
    player2.y += player2.dy;

    // Restringir el movimiento de las paletas dentro del lienzo
    if (player1.y < 0) player1.y = 0;
    if (player1.y + player1.height > canvas.height) player1.y = canvas.height - player1.height;

    if (player2.y < 0) player2.y = 0;
    if (player2.y + player2.height > canvas.height) player2.y = canvas.height - player2.height;
}

// Función para dibujar el puntaje
function drawScore() {
    ctx.fillStyle = '#fff';
    ctx.font = '24px Arial';
    ctx.clearRect(0, 0, canvas.width, 50);  // Limpiar la parte superior antes de dibujar el puntaje
    ctx.fillText(`Jugador 1: ${scorePlayer1}`, 50, 30);
    ctx.fillText(`Jugador 2: ${scorePlayer2}`, canvas.width - 150, 30);
}

// Función para actualizar el juego
function update() {
    drawBackground();
    movePaddles();
    moveBall();
    drawPaddle(player1);
    drawPaddle(player2);
    drawBall();
    drawScore();
}

// Función que se llama repetidamente para actualizar la pantalla
function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

// Función para manejar las teclas presionadas
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowUp') {
        player1.dy = -5;  // Mover jugador 1 hacia arriba
    } else if (event.key === 'ArrowDown') {
        player1.dy = 5;  // Mover jugador 1 hacia abajo
    } else if (event.key === 'a') {
        player2.dy = -5;  // Mover jugador 2 hacia arriba
    } else if (event.key === 'z') {
        player2.dy = 5;  // Mover jugador 2 hacia abajo
    }
});

// Función para manejar cuando se sueltan las teclas
document.addEventListener('keyup', function(event) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        player1.dy = 0;  // Detener el movimiento de jugador 1
    }
    if (event.key === 'a' || event.key === 'z') {
        player2.dy = 0;  // Detener el movimiento de jugador 2
    }
});

// Función para reiniciar el juego
function restartGame() {
    scorePlayer1 = 0;
    scorePlayer2 = 0;
    resetBall();
}

// Iniciar el bucle del juego
gameLoop();
