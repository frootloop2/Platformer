window.Renderer = {
	create: function() {
		var canvas,
			context,
			renderEntity;

		canvas = document.createElement("canvas");
		context = canvas.getContext("2d");
		
		canvas.width = Math.min(window.innerWidth / 16, window.innerHeight / 9) * 16;
		canvas.height = Math.min(window.innerWidth / 16, window.innerHeight / 9) * 9;
		canvas.style.backgroundColor = "#000000";
		document.body.style.margin = 0;
		document.body.appendChild(canvas);

		window.onresize = function() {
			canvas.width = Math.min(window.innerWidth / 16, window.innerHeight / 9) * 16;
			canvas.height = Math.min(window.innerWidth / 16, window.innerHeight / 9) * 9;
		};
		
		renderEntity = function(entity, view, camera) {
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
			render: function(entities, view, camera) {
				context.clearRect(0, 0, canvas.width, canvas.height);
				entities.filter(function(entity) {
					return entity.visible;
				}).forEach(function(entity) {
					var clonedEntity;
					renderEntity(entity, view, camera);
					if(entity.wraps === true) {
						clonedEntity = Entity.clone(entity);
						clonedEntity.x += view.width;
						renderEntity(clonedEntity, view, camera);
						clonedEntity.x -= 2 * view.width;
						renderEntity(clonedEntity, view, camera);
					}
				});
			}
		};
	}
};