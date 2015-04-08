window.Platformer = (function() {
	var global,
		local,
		renderer,
		setup,
		gameLoop,
		update,
		globalToLocal;

	setup = function() {
		renderer = Renderer.create();

		local = {
			position: {
				x: 0,
				y: 0
			},
			size: {
				width: 1600,
				height: 900
			},
			player: Block.create(800, 500, 50, 50, "#FF0000"),
			blocks: []
		};

		local.player.isGrounded = false;

		global = {
			blocks: []
		};

		global.blocks.push(Block.create(0, 75, 50, 50, "#808080"));
		//global.blocks.push(Block.create(1200, 75, 50, 50, "#808080"));
		global.blocks.push(Block.create(800, 25, 1600, 50, "#808080"));
	};

	gameLoop = function() {
		update();
		renderer.render(local);
		requestAnimationFrame(gameLoop);
	};

	update = function() {
		var distanceToNearestBlock,
			maxSpeed,
			jumpAcceleration,
			direction;

		maxSpeed = 10;
		jumpAcceleration = 15;

		globalToLocal();

		if(Keyboard.isKeyPressed(Keyboard.Keys.LEFT)) {
			local.player.dx = Math.max(-maxSpeed, local.player.dx - 1);
		}
		if(Keyboard.isKeyPressed(Keyboard.Keys.RIGHT)) {
			local.player.dx = Math.min(maxSpeed, local.player.dx + 1);
		}
		if(Keyboard.isKeyPressed(Keyboard.Keys.RIGHT) === Keyboard.isKeyPressed(Keyboard.Keys.LEFT)) {
			if(local.player.dx > 0) {
				local.player.dx = Math.max(0, local.player.dx - 1);
			} else {
				local.player.dx = Math.min(0, local.player.dx + 1);
			}
		}
		if(Keyboard.isKeyPressed(Keyboard.Keys.SPACE)) {
			if(local.player.isGrounded && local.player.dy === 0) {
				local.player.dy += jumpAcceleration;
				local.player.isGrounded = false;
			}
		}

		// gravity
		local.player.dy--;

		// step x
		{
			direction = (local.player.dx > 0) * 2 - 1;		// this makes me so happy [: - richardo
			distanceToNearestBlock = Infinity;
			local.blocks.filter(function(block) {
				var blockOverlapsPlayerZone,
					blockInDirectionOfPlayerMovement;

				blockOverlapsPlayerZone = local.player.y + local.player.height / 2 > block.y - block.height / 2 && local.player.y - local.player.height / 2 < block.y + block.height / 2;
				blockInDirectionOfPlayerMovement = ((block.x - direction * block.width / 2) - (local.player.x + direction * local.player.width / 2)) * direction >= 0;
				return(blockOverlapsPlayerZone && blockInDirectionOfPlayerMovement);
			}).forEach(function(block) {
				var distanceToBlock;
				
				distanceToBlock = Math.abs((local.player.x + direction * local.player.width / 2) - (block.x - direction * block.width / 2));
				distanceToNearestBlock = Math.min(distanceToBlock, distanceToNearestBlock);
			});
			
			local.player.x += Math.min(distanceToNearestBlock, local.player.dx * direction) * direction;
			if(distanceToNearestBlock < local.player.dx * direction) {
				local.player.dx = 0;
			}
		}

		// step y
		{
			direction = (local.player.dy > 0) * 2 - 1;
			distanceToNearestBlock = Infinity;
			local.blocks.filter(function(block) {
				var blockOverlapsPlayerZone,
					blockInDirectionOfPlayerMovement;

				blockOverlapsPlayerZone = local.player.x + local.player.width / 2 > block.x - block.width / 2 && local.player.x - local.player.width / 2 < block.x + block.width / 2;
				blockInDirectionOfPlayerMovement = ((block.y - direction * block.height / 2) - (local.player.y + direction * local.player.height / 2)) * direction >= 0;

				return(blockOverlapsPlayerZone && blockInDirectionOfPlayerMovement);
			}).forEach(function(block) {
				var distanceToBlock;
				
				distanceToBlock = Math.abs((local.player.y + direction * local.player.height / 2) - (block.y - direction * block.height / 2));
				distanceToNearestBlock = Math.min(distanceToBlock, distanceToNearestBlock);
			});
			
			local.player.y += Math.min(distanceToNearestBlock, local.player.dy * direction) * direction;
			if(distanceToNearestBlock < local.player.dy * direction) {
				local.player.dy = 0;
				local.player.isGrounded = direction < 0;
			}
		}

		// screen wrap
		local.player.x = (local.player.x + local.size.width) % local.size.width;

		if(local.player.dx > 0) {
			local.position.x += local.player.dx;
			local.player.x -= local.player.dx;
		}
	};

	globalToLocal = function() {
		local.blocks = [];
		global.blocks.forEach(function(block) {
			var newBlock,
				distance,
				direction;
			if(block.x - block.width / 2 < local.position.x + local.size.width && block.x + block.width / 2 > local.position.x) {
				newBlock = Block.create(block.x - local.position.x, block.y - local.position.y, block.width, block.height, block.color);

				// trim offscreen parts of block
				direction = (-(newBlock.x - newBlock.width / 2) > 0) * 2 - 1;
				distance = Math.max(0, Math.max(-(newBlock.x - newBlock.width / 2), newBlock.x + newBlock.width / 2 - local.size.width));
				
				newBlock.width -= distance;
				newBlock.x += direction * distance / 2;

				local.blocks.push(newBlock);

				// ofscreen blocks that make screen wrap collision detection work
				local.blocks.push(Block.create(newBlock.x - local.size.width, newBlock.y, newBlock.width, newBlock.height, newBlock.color));
				local.blocks.push(Block.create(newBlock.x + local.size.width, newBlock.y, newBlock.width, newBlock.height, newBlock.color));
			}
		});
	};

	return {
		init: function() {
			setup();
			gameLoop();
		}
	};
}());

Platformer.init();