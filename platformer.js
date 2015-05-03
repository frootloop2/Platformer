window.Platformer = (function() {
	var model,
		canvas,
		systems;

	var debugToggled,
		debugFrameAdvanceKey,
		debugFrameAdvanceKeyPressed;

	function setup() {
		debugToggled = false;
		debugFrameAdvanceKey = Keyboard.Keys.A;
		debugFrameAdvanceKeyPressed = false;

		model = Model.create();
		model.loadLevel();
		
		// the order of the systems in this array is the order that they are applied to the model
		systems = [];
		// maybe there's a better way to get the systems?
		// currently just have each system's file add it's system to window object where we know to look for it
		// "import" statement in ECMAScript 6 looks nice but not implemented in browsers yet
		systems.push(window.Input);
		systems.push(window.Physics);
		systems.push(window.Render);

		// wanted rendering to be a system for uniformity but it leaves the question of what to do with the data
		// of the render destination. This canvas object is the connection to the HTML. Does not seem to fit in
		// the Model and the systems don't have state of their own so it's left here for now.
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
		if(debugToggled) {
			if(!debugFrameAdvanceKeyPressed && Keyboard.isKeyPressed(debugFrameAdvanceKey)) {
				update();
			}
			debugFrameAdvanceKeyPressed = Keyboard.isKeyPressed(debugFrameAdvanceKey);
		} else {
			update();	
		}
		
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