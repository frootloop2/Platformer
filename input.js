window.Input = {
	runSystem: function(model, canvas) {
		model.entities.filter(function(entity) {
			return entity.player;
		}).forEach(function(entity) {
			var maxSpeed = 12,
				acceleration = 1,
				friction = 1;
			if(Keyboard.isKeyPressed(Keyboard.Keys.LEFT)) {
				entity.dx = Math.max(entity.dx - acceleration, -maxSpeed);
			}
			if(Keyboard.isKeyPressed(Keyboard.Keys.RIGHT)) {
				entity.dx = Math.min(entity.dx + acceleration, maxSpeed);
			}
			if(Keyboard.isKeyPressed(Keyboard.Keys.RIGHT) === Keyboard.isKeyPressed(Keyboard.Keys.LEFT)) {
				if(entity.dx > 0) {
					entity.dx = Math.max(0, entity.dx - friction);
				} else {
					entity.dx = Math.min(0, entity.dx + friction);
				}
			}
			if(Keyboard.isKeyPressed(Keyboard.Keys.UP)) {
				if(entity.dy === 0 && entity.landed) {
					entity.dy = 20;
					entity.landed = false;
				}
			}
		});
	}
};