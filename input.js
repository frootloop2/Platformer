window.Input = (function() {
	var maxSpeed = 12,
		acceleration = 1,
		friction = 1,
		leftKey = Keyboard.Keys.LEFT,
		rightKey = Keyboard.Keys.RIGHT,
		jumpKey = Keyboard.Keys.Z,
		grabKey = Keyboard.Keys.X,
		grabKeyPressed = false;
		doorKey = Keyboard.Keys.C;
		doorKeyPressed = false;

	return {
		runSystem: function(model, canvas) {
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
				if(Keyboard.isKeyPressed(jumpKey)) {
					if(playerEntity.dy === 0 && playerEntity.landed) {
						playerEntity.dy = 20;
						playerEntity.landed = false;
					}
				}

				// pick up item
				model.getEntities().filter(function(entity) {
					return entity.grabbable;
				}).forEach(function(grabbableEntity) {
					if(Keyboard.isKeyPressed(grabKey) && grabKeyPressed === false) {
						if(playerEntity.heldEntity !== undefined) {
							// drop
							playerEntity.heldEntity.collisionType = "actor";
							playerEntity.heldEntity.dy = 0;
							playerEntity.heldEntity = undefined;
						} else if(Entity.overlapsEntity(playerEntity, grabbableEntity)) {
							// grab
							playerEntity.heldEntity = grabbableEntity;
							playerEntity.heldEntity.collisionType = "held";
							playerEntity.heldEntity.x = playerEntity.x;
							playerEntity.heldEntity.y = playerEntity.y;
						}
					}
				});
				grabKeyPressed = Keyboard.isKeyPressed(grabKey);

				if(Keyboard.isKeyPressed(doorKey) && doorKeyPressed === false) {
					model.getEntities().filter(function(entity) {
						return entity.door;
					}).forEach(function(doorEntity) {
						if(Entity.overlapsEntity(playerEntity, doorEntity)) {
							model.loadLevel(doorEntity.doorDestination);
						}
					})
				}
				doorKeyPressed = Keyboard.isKeyPressed(doorKey);
			});
		}
	};
}());