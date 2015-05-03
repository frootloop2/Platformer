window.Platformer = (function() {
	var entities,
		renderer,
		camera,
		view,
		levelNum;

	function setup() {
		entities = [];
		view = {
			width: 1600,
			height: 900
		};
		renderer = Renderer.create();
		levelNum = 0;
		loadLevel();
	};

	function loadLevel() {
		if(levelNum >= levels.length) {
			levelNum = 0;
		}
		entities = levels[levelNum];
		camera = entities.filter(function(entity) {
			return entity.camera;
		})[0];
	};

	function gameLoop() {
		update();
		renderer.render(entities, view, camera);
		requestAnimationFrame(gameLoop);
	};

	function update() {
		// player
		entities.filter(function(entity) {
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

		// gravity
		entities.filter(function(entity) {
			return entity.gravity && entity.dy !== undefined;
		}).forEach(function(entity) {
			entity.dy--;
		});

		
		// step x
		{
			entities.filter(function(entity) {
				return entity.x !== undefined && entity.y !== undefined && entity.dx !== undefined && entity.dy !== undefined;
			}).forEach(function(entity) {
				var distanceToNearestEntity,
					nearEdge,
					farEdge;

				direction = (entity.dx > 0) * 2 - 1;
				distanceToNearestEntity = Infinity;

				nearEdge = (entity.dx > 0) ? Entity.getLeft : Entity.getRight;
				farEdge = (entity.dx > 0) ? Entity.getRight: Entity.getLeft;
				getExtraEntities().filter(function(otherEntity) {
					var otherEntityOverlapsEntityZone,
						otherEntityInDirectionOfEntityMovement;

					otherEntityOverlapsEntityZone = Entity.getTop(entity) > Entity.getBottom(otherEntity) && Entity.getBottom(entity) < Entity.getTop(otherEntity);
					otherEntityInDirectionOfEntityMovement = (nearEdge(otherEntity) - entity.x) * (farEdge(entity) - entity.x) >= 0;
					return otherEntity !== entity && otherEntityOverlapsEntityZone && otherEntityInDirectionOfEntityMovement;
				}).forEach(function(otherEntity) {
					var distanceToOtherEntity;
					distanceToOtherEntity = nearEdge(otherEntity) - farEdge(entity);
					distanceToNearestEntity = closestToValue(0, distanceToOtherEntity, distanceToNearestEntity);
				});
				entity.x += closestToValue(0, distanceToNearestEntity, entity.dx);
				if(entity.wraps === true) {
					entity.x = (entity.x - camera.x + view.width * 3 / 2) % view.width + camera.x - view.width / 2;
				}
				if(Math.abs(distanceToNearestEntity) < Math.abs(entity.dx)) {
					entity.dx = 0;
				}
			});
		}

		// step y
		{
			entities.filter(function(entity) {
				return entity.x !== undefined && entity.y !== undefined && entity.dx !== undefined && entity.dy !== undefined;
			}).forEach(function(entity) {
				var distanceToNearestEntity,
					nearEdge,
					farEdge;

				distanceToNearestEntity = Infinity;

				nearEdge = (entity.dy > 0) ? Entity.getBottom : Entity.getTop;
				farEdge = (entity.dy > 0) ? Entity.getTop : Entity.getBottom;

				getExtraEntities().filter(function(otherEntity){
					var otherEntityOverlapsEntityZone,
						otherEntityInDirectionOfEntityMovement;

					otherEntityOverlapsEntityZone = Entity.getRight(entity) > Entity.getLeft(otherEntity) && Entity.getLeft(entity) < Entity.getRight(otherEntity);
					otherEntityInDirectionOfEntityMovement = (nearEdge(otherEntity) - entity.y) * (farEdge(entity) - entity.y) >= 0;
					return entity !== otherEntity && otherEntityOverlapsEntityZone && otherEntityInDirectionOfEntityMovement;
				}).forEach(function(otherEntity) {
					var distanceToOtherEntity;
					
					distanceToOtherEntity = nearEdge(otherEntity) - farEdge(entity);
					distanceToNearestEntity = closestToValue(0, distanceToOtherEntity, distanceToNearestEntity);
				});
				entity.y += closestToValue(0, distanceToNearestEntity, entity.dy);
				if(Math.abs(distanceToNearestEntity) < Math.abs(entity.dy)) {
					entity.dy = 0;
					entity.landed = true;
				}
			});
		}
	};

	function closestToValue(v, a, b) {
		return Math.abs(a - v) < Math.abs(b - v) ? a : b;
	};

	function getExtraEntities() {
		var allEntities;
		allEntities = [].concat(entities);
		entities.filter(function(entity) {
			return entity.x - entity.width / 2 < camera.x + view.width / 2 && entity.x + entity.width / 2 > camera.x - view.width / 2; // on screen any amount
		}).forEach(function(entity) {
			var newEntity,
				direction,
				distance;
			newEntity = Entity.clone(entity);

			direction = Entity.getLeft(newEntity) < camera.x - view.width / 2 ? -1 : 1;
			distance = Math.max(0, Math.max(-(Entity.getLeft(newEntity) - camera.x + view.width / 2), Entity.getRight(newEntity) - camera.x - view.width / 2));
			newEntity.width -= distance;
			newEntity.x -= direction * distance / 2;
			
			// left copy
			newEntity.x -= view.width;
			allEntities.push(newEntity);
			
			// right copy
			newEntity = Entity.clone(newEntity);
			newEntity.x += 2 * view.width;
			allEntities.push(newEntity);
		});
		return allEntities;
	};

	setup();
	gameLoop();
}());