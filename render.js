window.Render = (function() {
	function renderEntity(entity, view, camera, canvas, context) {
		var widthRatio = canvas.width / view.width,
			heightRatio = canvas.height / view.height;
		context.fillStyle = entity.color;
		context.fillRect((Entity.getLeft(entity) - (camera.x - view.width / 2)) * widthRatio, // x
						 canvas.height - Entity.getTop(entity) * heightRatio, // y
						 entity.width * widthRatio, // width
						 entity.height * heightRatio, // height
						 entity.color // color
		);
	};
	return {
		runSystem: function(model, canvas) {
			var context = canvas.getContext("2d");
			context.clearRect(0, 0, canvas.width, canvas.height);
			model.getEntities().filter(function(entity) {
				return entity.visible;
			}).forEach(function(entity) {
				var clonedEntity;
				renderEntity(entity, model.getView(), model.getCamera(), canvas, context);
				if(entity.wraps === true) {
					clonedEntity = Entity.clone(entity);
					clonedEntity.x += model.getView().width;
					renderEntity(clonedEntity, model.getView(), model.getCamera(), canvas, context);
					clonedEntity.x -= 2 * model.getView().width;
					renderEntity(clonedEntity, model.getView(), model.getCamera(), canvas, context);
				}
			});
		}
	};
}());