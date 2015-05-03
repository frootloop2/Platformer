window.Render = {
	runSystem: function(model, canvas) {
		var _this = this,
			context = canvas.getContext("2d");
		context.clearRect(0, 0, canvas.width, canvas.height);
		model.entities.filter(function(entity) {
			return entity.visible;
		}).forEach(function(entity) {
			var clonedEntity;
			_this.renderEntity(entity, model.view, model.camera, canvas, context);
			if(entity.wraps === true) {
				clonedEntity = Entity.clone(entity);
				clonedEntity.x += model.view.width;
				_this.renderEntity(clonedEntity, model.view, model.camera, canvas, context);
				clonedEntity.x -= 2 * model.view.width;
				_this.renderEntity(clonedEntity, model.view, model.camera, canvas, context);
			}
		});
	},
	// TODO: make helper function private var
	renderEntity: function(entity, view, camera, canvas, context) {
		var widthRatio = canvas.width / view.width,
			heightRatio = canvas.height / view.height;
		context.fillStyle = entity.color;
		context.fillRect((Entity.getLeft(entity) - (camera.x - view.width / 2)) * widthRatio, // x
						 canvas.height - Entity.getTop(entity) * heightRatio, // y
						 entity.width * widthRatio, // width
						 entity.height * heightRatio, // height
						 entity.color // color
		);
	}
};