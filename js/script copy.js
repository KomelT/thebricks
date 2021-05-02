let interval;
let sekunde = -1;
let sekundeI;
let minuteI = -1;
let intTimer;
let izpisTimer;
let mousePos;
let name;
let start = true;

let exit = false;

let hej = localStorage.getItem("score")
//console.log(hej[0].name)

Swal.fire({
	icon: 'warning',
	title: 'Pozdravljeni v igri The Bricks!',
	text: 'Da se boste lahko na koncu primerjali z drugimi igralci sedaj prosimo vnesite vaše ime ali vzdevek.',
	input: "text",
	confirmButtonText: "Shrani"
}).then((response) => {
	let ime = response.value

	if (ime == undefined || ime.trim() == "") {
		let date = new Date();
		name = date.toLocaleTimeString();
	} else {
		name = ime
	}

	console.log(name)
	Swal.fire({
		icon: 'info',
		title: 'Navodila',
		text: 'Po kliku na gumb "Naprej" boste morali pritisniti tipko "space" oz. presledek. da se bo igra začela in prav tako seštevati čas, ki ste ga potrebovali za uničevanje opek. Ko vam žogica pade na tla in ste pripravljeni nadaljevati pritisnite prav tako tipko presledek. Na voljo imate 3 življenja.',
		confirmButtonText: "Naprej"
	}).then(() => {
		startHandler()
	})
})

function scoreBoard() {

	exit = true;

	let lives = document.getElementById('lives');
	var node = document.createTextNode("❤");
	var node1 = document.createTextNode("");
	var node2 = document.createTextNode("❤");
	var node3 = document.createTextNode("");
	var node4 = document.createTextNode("❤");
	var node5 = document.createTextNode("");

	lives.appendChild(node)
	lives.appendChild(node1)
	lives.appendChild(node2)
	lives.appendChild(node3)
	lives.appendChild(node4)
	lives.appendChild(node5)


	let scores = JSON.parse(localStorage.getItem("score"))

	if (!Array.isArray(scores)) {
		Swal.fire({
			icon: 'error',
			title: 'Napaka!',
			text: 'Prišlo je do napake pri branju iz Local Storage! Opravičujemo se za napako.',
			confirmButtonText: "Naprej"
		})
	} else {
		console.log("Scores is array")
		function compare(a, b) {
			if (a.points < b.points) return 1;

			if (a.points > b.points) return -1;

			if (a.points == b.points) {
				if (a.time < b.time) return -1;
				else return 1;
			}
			return 0;
		}

		scores.sort(compare);

		let data = "<table><tr><th>Mesto</th><th>Ime</th><th>Št. točk</th><th>Čas (sekund)</th></tr>"

		scores.forEach((obj, i) => {
			data = data + "<tr><td>" + (i + 1) + ".</td><td>" + obj.name + "</td><td>" + obj.points + "</td><td>" + obj.time + "</td></tr>"
		})

		data = data + "</table>"

		Swal.fire({
			icon: 'info',
			title: 'Rezultati',
			text: '',
			confirmButtonText: "Naprej",
			footer: data
		}).then(() => {
			window.location.reload();
		})

	}
}

function startHandler() {
	clearInterval(interval)
	clearInterval(sekundeI)
	clearInterval(intTimer)
	clearInterval(izpisTimer)
	sekunde = -1;
	minuteI = -1;
	start = true;

	try {
		drawIt();
	} catch (e) {
		console.log(e)
	}
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
	let x = 345;
	let y = 285;
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
	}

	function init_paddle() {
		padW = 75;
		padY = 300;
		padX = WIDTH / 2 - padW / 2;
		padH = 20;
	}

	function initBricks() {
		console.log("Init bricks")
		bricks = []
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
	// END LIBRARY CODE
	function draw() {
		clear();
		ctx.closePath();

		circle(x, y, 10);
		ctx.closePath();

		rect(padX, padY, padW, padH, 0);
		ctx.closePath();

		// Pregleda kateri brick je bil zadet
		bricks.forEach((brick, index) => {
			rect(brick.x, brick.y, brickW, brickH, brick.hardness);
			ctx.closePath();

			if (x + dx > brick.x && x + dx * 2 < brick.x + brickW) {
				if (y + dy * 2 > brick.y && y + dy * 2 < brick.y + brickH) {
					dy = -dy;
					brick.hardness = brick.hardness - 1;
					points = points + 10;

					if (brick.hardness == 0) bricks.splice(index, 1);
				}
			}
		});

		if (bricks.length == 0) {
			Swal.fire({
				icon: 'warning',
				title: 'KONEC IGRE',
				text: 'Čestitke zbili ste vse opeke v času ' +
					izpisTimer +
					'min .'
			})

			clearInterval(interval);
			// window.clearInterval(interval2);
			clear();
			clearInterval(intTimer);

			if (localStorage.getItem("score") == null) {
				console.log("local storage is empty")
				localStorage.setItem("score", JSON.stringify([{
					name: name,
					points: points,
					time: sekunde
				}]));
			} else {
				let tmp = JSON.parse(localStorage.getItem("score"));
				if (Array.isArray(tmp)) {
					console.log("tmp is array")
					tmp.push({
						name: name,
						points: points,
						time: sekunde
					})

					localStorage.setItem("score", JSON.stringify(tmp));
				} else {
					console.log("tmp is not array")
					localStorage.setItem("score", JSON.stringify([{
						name: name,
						points: points,
						time: sekunde
					}]));
				}

				console.log(JSON.parse(localStorage.getItem("score")))
			}
		}

		// Ko žogica pade na tla se excecuta vse kar je v if-u
		if (y + dy > HEIGHT - r) {

			/*let randX = Math.floor(Math.random() * WIDTH);
			dx = (x - (randX + padW / 2)) / padW;
			dy = -dy;*/

			clearInterval(intTimer)
			clearInterval(interval)

			let lockBall = setInterval(() => {

				x = 345
				y = 290;

				padY = 300;
				padX = WIDTH / 2 - padW / 2;

				clear();
				ctx.closePath();

				circle(x, y, 10);
				ctx.closePath();

				rect(padX, padY, padW, padH, 0);
				ctx.closePath();

				// Pregleda kateri brick je bil zadet
				bricks.forEach((brick, index) => {
					rect(brick.x, brick.y, brickW, brickH, brick.hardness);
					ctx.closePath();
				});

				if (exit)
					return

				document.body.onkeypress = (e) => {
					if (e.keyCode == 32) {
						console.log("clearInterval(lockBall)")
						intTimer = setInterval(timer, 1000);
						interval = setInterval(draw, 10);
						clearInterval(lockBall)
					}
				}
			}, 10)

			let lives = document.getElementById('lives');
			lives.firstChild.remove();
			lives.firstChild.remove();

			console.log(lives.childNodes.length);
			if (lives.childNodes.length <= 1) {
				clearInterval(interval);
				// window.clearInterval(interval2);
				Swal.fire({
					icon: 'warning',
					title: 'KONEC IGRE',
					text: 'Porabili ste vsa 3 življenja in zbili ste za ' +
						points +
						' točk opek v času ' +
						izpisTimer +
						'.'
				})
				clear();
				clearInterval(intTimer);

				console.log(name)
				console.log(points)
				console.log(sekunde)

				if (localStorage.getItem("score") == null) {
					console.log("local storage is empty")
					localStorage.setItem("score", JSON.stringify([{
						name: name,
						points: points,
						time: sekunde
					}]));
				} else {
					let tmp = JSON.parse(localStorage.getItem("score"));
					if (Array.isArray(tmp)) {
						console.log("tmp is array")
						tmp.push({
							name: name,
							points: points,
							time: sekunde
						})

						localStorage.setItem("score", JSON.stringify(tmp));
					} else {
						console.log("tmp is not array")
						localStorage.setItem("score", JSON.stringify([{
							name: name,
							points: points,
							time: sekunde
						}]));
					}

					console.log(JSON.parse(localStorage.getItem("score")))
				}

				scoreBoard()
			}
		}

		// Preverjanje ali je žogica zadela katero od navpičnih sten
		if (x + dx > WIDTH - r || x + dx < 0 + r) dx = -dx;

		// Preverjanje ali je žogica zadela katero od vodoravnih sten
		if (y + dy > HEIGHT - r || y + dy < 0 + r) dy = -dy;

		// Preverjanje ali je žogica zadela plošček
		if (x > padX && x < padX + padW) {
			if (y + dy > padY - r && y + dy < padY + padH + r) {
				// dy = -dy;
				dx = 8 * ((x - (padX + padW / 2)) / padW);
				dy = -dy;
			}
		}

		x += dx;
		y += dy;

		document.getElementById('points').innerText = 'Točke: ' + points;
	}

	if (start) {
		init();
		init_paddle();
		initBricks();
		draw()

		console.log("start")

		document.body.onkeypress = (e) => {
			if (e.keyCode == 32) {
				timer();
				start = false
				intTimer = setInterval(timer, 1000);
				interval = setInterval(draw, 10);
			}
		}
	}

	function getMousePos(canvas, evt) {
		let rect = canvas.getBoundingClientRect();
		return {
			x: evt.clientX - rect.left,
		};
	}

	canvas.addEventListener(
		'mousemove',
		(evt) => {
			mousePos = getMousePos(canvas, evt);
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
