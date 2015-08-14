window.Input = (function() {
	var maxSpeed = 12,
		acceleration = 1,
		friction = 1,
		leftKey = Keyboard.Keys.LEFT,
		rightKey = Keyboard.Keys.RIGHT,
		jumpKey = Keyboard.Keys.Z,
		grabKey = Keyboard.Keys.X,
		doorKey = Keyboard.Keys.C;

	return {
		runSystem: function(model) {
			model.getEntities().filter(function(entity) {
				return entity.player;
			}).forEach(function(playerEntity) {
				if(Keyboard.isKeyPressed(leftKey)) {
					playerEntity.dx = Math.max(playerEntity.dx - acceleration, -maxSpeed);
				}
				if(Keyboard.isKeyPressed(rightKey)) {
					playerEntity.dx = Math.min(playerEntity.dx + acceleration, maxSpeed);
				}
				if(Keyboard.isKeyPressed(rightKey) === Keyboard.isKeyPressed(leftKey)) {
					if(playerEntity.dx > 0) {
						playerEntity.dx = Math.max(0, playerEntity.dx - friction);
					} else {
						playerEntity.dx = Math.min(0, playerEntity.dx + friction);
					}
				}
				if(Keyboard.isKeyPressedSinceStartOfLastFrame(jumpKey)) {
					if(playerEntity.dy === 0 && playerEntity.landed) {
						playerEntity.dy = 20;
						playerEntity.landed = false;
					}
				}

				// pick up item
				if(Keyboard.isKeyPressedSinceStartOfLastFrame(grabKey)) {
					if(playerEntity.heldEntity === undefined) {
						// grab
						model.getEntities().filter(function(entity) {
							return entity.grabbable;
						}).some(function(grabbableEntity) {
							if(Entity.overlapsEntity(playerEntity, grabbableEntity)) {
								playerEntity.heldEntity = grabbableEntity;
								playerEntity.heldEntity.collisionType = "held";
								playerEntity.heldEntity.x = playerEntity.x;
								playerEntity.heldEntity.y = playerEntity.y;
							}
							// stops trying to grab others once it grabs something
							return playerEntity.heldEntity !== undefined;
						});	
					} else {
						// drop
						playerEntity.heldEntity.collisionType = "actor";
						playerEntity.heldEntity.dy = 0;
						playerEntity.heldEntity = undefined;
					}
				}

				if(Keyboard.isKeyPressedSinceStartOfLastFrame(doorKey)) {
					model.getEntities().filter(function(entity) {
						return entity.door;
					}).forEach(function(doorEntity) {
						if(Entity.overlapsEntity(playerEntity, doorEntity)) {
							model.loadRoom(doorEntity.doorDestination);
						}
					})
				}
			});
		}
	};
}());