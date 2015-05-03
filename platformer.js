window.Platformer = (function() {
	var model,
		canvas,
		systems,

		debugToggled,
		debugFrameAdvanceKey,
		debugFrameAdvanceKeyPressed;

	function setup() {
		debugToggled = false;
		debugFrameAdvanceKey = Keyboard.Keys.A;
		debugFrameAdvanceKeyPressed = false;

		// this is the game state
		model = Model.create();
		model.loadLevel(0);
		
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
		canvas.style.position = "absolute";
		canvas.style.top = 0;
		canvas.style.bottom = 0;
		canvas.style.left = 0;
		canvas.style.right = 0;
		canvas.style.margin = "auto";
		canvas.style.backgroundColor = "#FFFFFF";
		document.body.appendChild(canvas);
		window.onresize = function() {
			canvas.width = Math.min(window.innerWidth / 16, window.innerHeight / 9) * 16;
			canvas.height = Math.min(window.innerWidth / 16, window.innerHeight / 9) * 9;
		};
		document.body.style.margin = 0;
		document.body.style.backgroundColor = "#000000";
	};

	function gameLoop() {
		// don't want to advance for every frame that the key is pressed, only once per key press.
		// debugFrameAdvanceKeyPressed keeps track of whether the key is pressed and so we advance whenever the
		// value goes from false to true aka keydown.
		// this is weird to have to keep a variable whenever you just want to capture a keydown event but I'm not
		// sure how best to incorporate it into the Keyboard object to avoid having the variable.
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