let interval;
let interval2;
var sekunde = -1;
var sekundeI;
var minuteI = -1;
var intTimer;
var izpisTimer;
function butHandler() {
	document.getElementById('alert1').style.display = 'none';
	timer();
	drawIt();
}

function timer() {
	sekunde++;

	sekundeI = (sekundeI = sekunde % 60) > 9 ? sekundeI : '0' + sekundeI;
	minuteI = (minuteI = Math.floor(sekunde / 60)) > 9 ? minuteI : '0' + minuteI;
	izpisTimer = minuteI + ':' + sekundeI;

	$('#time').html(izpisTimer);
}

function drawIt() {
	let canvas = document.getElementById('canvas');
	let x = 150;
	let y = 150;
	let dx = 2;
	let dy = 3;
	let WIDTH;
	let HEIGHT;
	let r = 10;
	let ctx;
	let padX;
	let padH;
	let padW;
	let padY;
	let brickW;
	let brickH;
	let bricks = [];
	let points = 0;

	function init() {
		ctx = $('#canvas')[0].getContext('2d');
		WIDTH = $('#canvas').width();
		HEIGHT = $('#canvas').height();
		sekunde = 0;
		izpisTimer = '00:00';
		intTimer = setInterval(timer, 1000);
		return setInterval(draw, 10);
	}

	function init_paddle() {
		padW = 75;
		padY = 300;
		padX = WIDTH / 2 - padW / 2;
		padH = 20;
	}

	function initBricks() {
		brickH = 13;
		brickW = 50;
		for (i = 0; i < 11; i++) {
			bricks.push({ x: i * brickW + 12 * (i + 1), y: brickH + 10, hardness: 3 });
		}
		for (i = 0; i < 11; i++) {
			bricks.push({
				x: i * brickW + 12 * (i + 1),
				y: brickH + 30,
				hardness: 2,
			});
		}
		for (i = 0; i < 11; i++) {
			bricks.push({ x: i * brickW + 12 * (i + 1), y: brickH + 50, hardness: 1 });
		}
	}

	function circle(x, y, r) {
		ctx.beginPath();
		ctx.arc(x, y, r, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fill();
	}

	function rect(x, y, w, h, hard) {
		/*ctx.beginPath();
			ctx.rect(x, y, w, h);
			ctx.closePath();*/
		let radius = 3;
		ctx.beginPath();
		ctx.moveTo(x + radius, y);
		ctx.lineTo(x + w - radius, y);
		ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
		ctx.lineTo(x + w, y + h - radius);
		ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
		ctx.lineTo(x + radius, y + h);
		ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
		ctx.lineTo(x, y + radius);
		ctx.quadraticCurveTo(x, y, x + radius, y);
		ctx.closePath();
		switch (hard) {
			case 3:
				ctx.fillStyle = '#0d71f3';
				break;
			case 2:
				ctx.fillStyle = '#67c017';
				break;
			case 1:
				ctx.fillStyle = '#fc59c2';
				break;
		}
		ctx.fill();
		ctx.fillStyle = '#000000';
	}

	function clear() {
		ctx.clearRect(0, 0, WIDTH, HEIGHT, 0);
	}
	//END LIBRARY CODE
	function draw() {
		clear();
		ctx.closePath();

		circle(x, y, 10);
		ctx.closePath();

		rect(padX, padY, padW, padH, 0);
		ctx.closePath();

		//Pregleda kateri brick je bil zadet
		bricks.forEach((brick, index) => {
			rect(brick.x, brick.y, brickW, brickH, brick.hardness);
			ctx.closePath();

			document.getElementById('alert2text').innerText =
				'Porabili ste vsa 3 življenja in zbili ste za ' +
				points +
				' točk opek v času ' +
				izpisTimer +
				'.';

			if (x > brick.x && x < brick.x + brickW) {
				if (y + dy > brick.y && y + dy < brick.y + brickH) {
					dy = -dy;
					brick.hardness = brick.hardness - 1;
					points = points + 10;

					if (brick.hardness == 0) bricks.splice(index, 1);
				}
			}
		});

		if (bricks.length == 0) {
			document.getElementById('alert2text').innerText =
				'Čestitke! Dosegli ste vseh ' +
				points +
				' točk. Vse opeke ste zbili v času ' +
				izpisTimer +
				'.';

			window.clearInterval(interval);
			window.clearInterval(interval2);
			clear();
			document.getElementById('alert2').style.display = 'flex';
			clearInterval(intTimer);
		}

		//Ko žogica pade na tla se excecuta vse kar je v if-u
		if (y + dy > HEIGHT - r) {
			padX = WIDTH / 2 - padW / 2;
			x = WIDTH / 2 - r / 2;
			y = padY - r * 5;

			let randX = Math.floor(Math.random() * WIDTH);
			dx = (x - (randX + padW / 2)) / padW;
			dy = -dy;

			let lives = document.getElementById('lives');
			lives.firstChild.remove();
			lives.firstChild.remove();

			console.log(lives.childNodes.length);
			if (lives.childNodes.length == 1) {
				window.clearInterval(interval);
				window.clearInterval(interval2);
				clear();
				document.getElementById('alert2').style.display = 'flex';
				clearInterval(intTimer);
			}
		}

		//Preverjanje ali je žogica zadela katero od navpičnih sten
		if (x + dx > WIDTH - r || x + dx < 0 + r) dx = -dx;

		//Preverjanje ali je žogica zadela katero od vodoravnih sten
		if (y + dy > HEIGHT - r || y + dy < 0 + r) dy = -dy;

		//Preverjanje ali je žogica zadela plošček
		if (x > padX && x < padX + padW) {
			if (y + dy > padY - r && y + dy < padY + padH + r) {
				//dy = -dy;
				dx = 8 * ((x - (padX + padW / 2)) / padW);
				dy = -dy;
			}
		}

		/*if (x == padX + padW) {
				if (y >= padY && y <= padY + padH) {
dx = -dx;
				}
			}*/

		x += dx;
		y += dy;

		document.getElementById('points').innerText = 'Točke: ' + points;
	}
	interval = init();
	interval2 = setInterval(() => {
		dx = dx * 1.01;
		dy = dy * 1.02;
		console.log(dx + " , " + dy)
	}, 5000)
	init_paddle();
	initBricks();

	function getMousePos(canvas, evt) {
		let rect = canvas.getBoundingClientRect();
		return {
			x: evt.clientX - rect.left,
		};
	}

	canvas.addEventListener(
		'mousemove',
		function (evt) {
			let mousePos = getMousePos(canvas, evt);
			if (mousePos.x + padW / 2 >= WIDTH) {
				padX = WIDTH - padW;
			} else if (mousePos.x - padW / 2 < 0) {
				padX = 0;
			} else {
				padX = mousePos.x - padW / 2;
			}
		},
		false
	);
}
