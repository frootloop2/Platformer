window.Movement = {
	runSystem: function(model, canvas) {
		var _this = this;
		// gravity
		model.entities.filter(function(entity) {
			return entity.gravity && entity.dy !== undefined;
		}).forEach(function(entity) {
			entity.dy--;
		});

		
		// step x
		model.entities.filter(function(entity) {
			return entity.x !== undefined && entity.y !== undefined && entity.dx !== undefined && entity.dy !== undefined;
		}).forEach(function(entity) {
			var distanceToNearestEntity,
				nearEdge,
				farEdge;

			direction = (entity.dx > 0) * 2 - 1;
			distanceToNearestEntity = Infinity;

			nearEdge = (entity.dx > 0) ? Entity.getLeft : Entity.getRight;
			farEdge = (entity.dx > 0) ? Entity.getRight: Entity.getLeft;
			model.getExtraEntities().filter(function(otherEntity) {
				var otherEntityOverlapsEntityZone,
					otherEntityInDirectionOfEntityMovement;

				otherEntityOverlapsEntityZone = Entity.getTop(entity) > Entity.getBottom(otherEntity) && Entity.getBottom(entity) < Entity.getTop(otherEntity);
				otherEntityInDirectionOfEntityMovement = (nearEdge(otherEntity) - entity.x) * (farEdge(entity) - entity.x) >= 0;
				return otherEntity !== entity && otherEntityOverlapsEntityZone && otherEntityInDirectionOfEntityMovement;
			}).forEach(function(otherEntity) {
				var distanceToOtherEntity;
				distanceToOtherEntity = nearEdge(otherEntity) - farEdge(entity);
				distanceToNearestEntity = _this.closestToValue(0, distanceToOtherEntity, distanceToNearestEntity);
			});
			entity.x += _this.closestToValue(0, distanceToNearestEntity, entity.dx);
			if(entity.wraps === true) {
				entity.x = (entity.x - model.camera.x + model.view.width * 3 / 2) % model.view.width + model.camera.x - model.view.width / 2;
			}
			if(Math.abs(distanceToNearestEntity) < Math.abs(entity.dx)) {
				entity.dx = 0;
			}
		});

		// step y
		model.entities.filter(function(entity) {
			return entity.x !== undefined && entity.y !== undefined && entity.dx !== undefined && entity.dy !== undefined;
		}).forEach(function(entity) {
			var distanceToNearestEntity,
				nearEdge,
				farEdge;

			distanceToNearestEntity = Infinity;

			nearEdge = (entity.dy > 0) ? Entity.getBottom : Entity.getTop;
			farEdge = (entity.dy > 0) ? Entity.getTop : Entity.getBottom;

			model.getExtraEntities().filter(function(otherEntity){
				var otherEntityOverlapsEntityZone,
					otherEntityInDirectionOfEntityMovement;

				otherEntityOverlapsEntityZone = Entity.getRight(entity) > Entity.getLeft(otherEntity) && Entity.getLeft(entity) < Entity.getRight(otherEntity);
				otherEntityInDirectionOfEntityMovement = (nearEdge(otherEntity) - entity.y) * (farEdge(entity) - entity.y) >= 0;
				return entity !== otherEntity && otherEntityOverlapsEntityZone && otherEntityInDirectionOfEntityMovement;
			}).forEach(function(otherEntity) {
				var distanceToOtherEntity;
				
				distanceToOtherEntity = nearEdge(otherEntity) - farEdge(entity);
				distanceToNearestEntity = _this.closestToValue(0, distanceToOtherEntity, distanceToNearestEntity);
			});
			entity.y += _this.closestToValue(0, distanceToNearestEntity, entity.dy);
			if(Math.abs(distanceToNearestEntity) < Math.abs(entity.dy)) {
				entity.dy = 0;
				entity.landed = true;
			}
		});
	},
	// TODO: make helper function private var
	closestToValue: function(v, a, b) {
		return Math.abs(a - v) < Math.abs(b - v) ? a : b;
	}
};