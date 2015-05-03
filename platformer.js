window.Platformer = (function() {
	var model,
		canvas,
		systems;

	function setup() {
		model = Model.create();
		model.loadLevel();
		
		systems = [];
		systems.push(window.Input);
		systems.push(window.Movement);
		systems.push(window.Render);

		canvas = document.createElement("canvas");
		canvas.width = Math.min(window.innerWidth / 16, window.innerHeight / 9) * 16;
		canvas.height = Math.min(window.innerWidth / 16, window.innerHeight / 9) * 9;
		canvas.style.backgroundColor = "#000000";
		document.body.style.margin = 0;
		document.body.appendChild(canvas);
		window.onresize = function() {
			canvas.width = Math.min(window.innerWidth / 16, window.innerHeight / 9) * 16;
			canvas.height = Math.min(window.innerWidth / 16, window.innerHeight / 9) * 9;
		};
	};

	function gameLoop() {
		update();
		requestAnimationFrame(gameLoop);
	};

	function update() {
		systems.forEach(function(system) {
			system.runSystem(model, canvas);
		});
	};

	setup();
	gameLoop();
}());