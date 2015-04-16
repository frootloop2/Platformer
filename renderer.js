window.Renderer = {
	create: function() {
		var canvas,
			context,
			renderEntity,
			entityToCanvas,
			goal;

		var goal = new Image();
		goal.addEventListener("load", function() {
			console.log("goal image loaded");
		}, false);
		goal.src = "goal.png";

		canvas = document.createElement("canvas");
		canvas.width = Math.min(window.innerWidth / 16, window.innerHeight / 9) * 16;
		canvas.height = Math.min(window.innerWidth / 16, window.innerHeight / 9) * 9;
		canvas.style.backgroundColor = "#000000";
		document.body.style.margin = 0;
		document.body.style.textAlign = "center";
		document.body.appendChild(canvas);

		window.onresize = function() {
			canvas.width = Math.min(window.innerWidth / 16, window.innerHeight / 9) * 16;
			canvas.height = Math.min(window.innerWidth / 16, window.innerHeight / 9) * 9;
		};
		
		context = canvas.getContext("2d");
		
		entityToCanvas = function(entity, local) {
			var widthRatio = canvas.width / local.size.width,
				heightRatio = canvas.height / local.size.height; 
			return Block.create(entity.x * widthRatio, (local.size.height - entity.y) * heightRatio, entity.width * widthRatio, entity.height * heightRatio, entity.color);
		};
		
		renderEntity = function(entity) {
			context.fillStyle = entity.color;
			if(entity.img) {
				context.drawImage(goal, entity.x - entity.width / 2, entity.y - entity.height / 2, entity.width, entity.height);
			} else {
				context.fillRect(entity.x - entity.width / 2, entity.y - entity.height / 2, entity.width, entity.height, entity.color);
			}
		};

		renderText = function(text, x, y, size) {
			context.fillStyle = "#FFFFFF";
			context.font = size + "px monospace";
			context.fillText(text, x, y);
		}
		return {
			render: function(local) {
				context.clearRect(0, 0, canvas.width, canvas.height);
				renderEntity(entityToCanvas(local.player, local));
				renderEntity(entityToCanvas(Block.create(local.player.x - local.size.width, local.player.y, local.player.width, local.player.height, local.player.color), local));
				renderEntity(entityToCanvas(Block.create(local.player.x + local.size.width, local.player.y, local.player.width, local.player.height, local.player.color), local));
				local.blocks.forEach(function(block) {
					renderEntity(entityToCanvas(block, local));
				});
				local.goals.forEach(function(goal) {
					var canvasEntity = entityToCanvas(goal, local);
					canvasEntity.img = "asdfsfsd";
					renderEntity(canvasEntity);
				});
				renderText("local.locked: " + local.locked, 0, 24, 24);
			}
		};
	}
};