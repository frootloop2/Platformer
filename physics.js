window.Physics = (function() {
	function closestToValue(v, a, b) {
		return Math.abs(a - v) < Math.abs(b - v) ? a : b;
	};
	return {
		runSystem: function(model) {
			// gravity
			model.getEntities().filter(function(entity) {
				return entity.gravity && entity.dy !== undefined && entity.collisionType !== "held";
			}).forEach(function(entity) {
				entity.dy--;
			});

			// TODO: is there a good way to combine step x and step y? should we?

			// step x
			model.getEntities().filter(function(entity) {
				return entity.x !== undefined && entity.y !== undefined && entity.dx !== undefined && entity.dy !== undefined && entity.collisionType !== "held";
			}).forEach(function(entity) {
				var distanceToNearestEntity,
					nearEdge,
					farEdge,
					oldX;

				distanceToNearestEntity = Infinity;

				nearEdge = (entity.dx > 0) ? Entity.getLeft : Entity.getRight;
				farEdge = (entity.dx > 0) ? Entity.getRight: Entity.getLeft;

				model.getExtraEntities().filter(function(otherEntity) {
					var otherEntityOverlapsEntityZone,
						otherEntityInDirectionOfEntityMovement,
						correctCollisionType;

					otherEntityOverlapsEntityZone = Entity.getTop(entity) > Entity.getBottom(otherEntity) && Entity.getBottom(entity) < Entity.getTop(otherEntity);
					otherEntityInDirectionOfEntityMovement = (nearEdge(otherEntity) - entity.x) * (farEdge(entity) - entity.x) >= 0;
					// only collide between environment entities and actor entities. This way for example the player can overlap the camera to pick it up while both are
					// colliding with the ground.
					correctCollisionType = (entity.collisionType === "environment" && otherEntity.collisionType === "actor") ||
										   (entity.collisionType === "actor" && otherEntity.collisionType === "environment");
					return otherEntity !== entity && otherEntityOverlapsEntityZone && otherEntityInDirectionOfEntityMovement && correctCollisionType;
				}).forEach(function(otherEntity) {
					var distanceToOtherEntity;
					distanceToOtherEntity = nearEdge(otherEntity) - farEdge(entity);
					distanceToNearestEntity = closestToValue(0, distanceToOtherEntity, distanceToNearestEntity);
				});
				entity.x += closestToValue(0, distanceToNearestEntity, entity.dx);
				if(entity.heldEntity !== undefined) {
					entity.heldEntity.x += closestToValue(0, distanceToNearestEntity, entity.dx);
				}
				if(entity.wraps === true) {
					// model.getCamera().x is center of screen
					// model.getCamera().x - model.getView().width / 2 is left edge of screen
					// entity.x - (model.getCamera().x - model.getView().width / 2) is distance from player to left edge of screen
					// (distance + model.getView().width) % model.getView().width is wrapped distance
					// wrapped distance + (model.getCamera().x - model.getView().width / 2) is wrapped player position
					entity.x = (entity.x - model.getCamera().x + model.getView().width + model.getView().width / 2) % model.getView().width + model.getCamera().x - model.getView().width / 2;

					// model.getCamera().x is center of screen
					// model.getCamera().x + model.getView().width / 2 is right edge of screen
					// entity.x - (model.getCamera().x + model.getView().width / 2) is distance from player to right edge of screen
					// distance % width is wrapped distance // distance is always positive
					// wrapped distance + (model.getCamera().x + model.getView().width / 2) is wrapped player position
					//entity.x = (entity.x - model.getCamera().x - model.getView().width / 2) % model.getView().width + model.getCamera().x + model.getView().width / 2;
					if(entity.heldEntity !== undefined) {
						entity.heldEntity.x = (entity.heldEntity.x - model.getCamera().x + model.getView().width + model.getView().width / 2) % model.getView().width + model.getCamera().x - model.getView().width / 2;
						//entity.heldEntity.x = (entity.heldEntity.x - model.getCamera().x - model.getView().width / 2) % model.getView().width + model.getCamera().x + model.getView().width / 2;
					}
				}
				if(Math.abs(distanceToNearestEntity) < Math.abs(entity.dx)) {
					entity.dx = 0;
				}
			});

			// step y
			model.getEntities().filter(function(entity) {
				return entity.x !== undefined && entity.y !== undefined && entity.dx !== undefined && entity.dy !== undefined && entity.collisionType !== "held";
			}).forEach(function(entity) {
				var distanceToNearestEntity,
					nearEdge,
					farEdge;

				distanceToNearestEntity = Infinity;

				nearEdge = (entity.dy > 0) ? Entity.getBottom : Entity.getTop;
				farEdge = (entity.dy > 0) ? Entity.getTop : Entity.getBottom;

				model.getExtraEntities().filter(function(otherEntity) {
					var otherEntityOverlapsEntityZone,
						otherEntityInDirectionOfEntityMovement,
						correctCollisionType;

					otherEntityOverlapsEntityZone = Entity.getRight(entity) > Entity.getLeft(otherEntity) && Entity.getLeft(entity) < Entity.getRight(otherEntity);
					otherEntityInDirectionOfEntityMovement = (nearEdge(otherEntity) - entity.y) * (farEdge(entity) - entity.y) >= 0;
					// only collide between environment entities and actor entities. This way for example the player can overlap the camera to pick it up while both are
					// colliding with the ground.
					correctCollisionType = (entity.collisionType === "environment" && otherEntity.collisionType === "actor") ||
										   (entity.collisionType === "actor" && otherEntity.collisionType === "environment");
					return entity !== otherEntity && otherEntityOverlapsEntityZone && otherEntityInDirectionOfEntityMovement && correctCollisionType;
				}).forEach(function(otherEntity) {
					var distanceToOtherEntity;
					
					distanceToOtherEntity = nearEdge(otherEntity) - farEdge(entity);
					distanceToNearestEntity = closestToValue(0, distanceToOtherEntity, distanceToNearestEntity);
				});
				entity.y += closestToValue(0, distanceToNearestEntity, entity.dy);
				if(entity.heldEntity !== undefined) {
					entity.heldEntity.y += closestToValue(0, distanceToNearestEntity, entity.dy);
				}
				if(Math.abs(distanceToNearestEntity) < Math.abs(entity.dy)) {
					entity.dy = 0;
					entity.landed = true;
				}
			});

			model.getEntities().filter(function(entity) {
				return entity.player;
			}).forEach(function(entity) {
				if(entity.y < 0)
					model.restartLevel();
			});
		}
	};
}());