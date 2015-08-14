(function() {
	var model,
		systems;

	model = Model.create();
	model.loadRoom(0);
	systems = [
		window.Input,
		window.Physics,
		window.Render
	];		

	function gameLoop() {
		Keyboard.tickFrame();
		systems.forEach(function(system) {
			system.runSystem(model);
		});
		requestAnimationFrame(gameLoop);
	};

	gameLoop();
}());