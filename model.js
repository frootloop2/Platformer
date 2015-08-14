window.Model = {
	create: function() {
		// TODO: make the structure private vars and have methods on the return object to deal with them.
		var entities = [],
			camera = null,
			view = {
				width: 1600,
				height: 900
			},
			roomNum = 0;
		return {
			getEntities: function() {
				return entities;
			},
			getCamera: function() {
				return camera;
			},
			getView: function() {
				return view;
			},
			getRoomNum: function() {
				return roomNum;
			},
			loadRoom: function(destinationRoomNum) {
				if(destinationRoomNum >= window.Rooms.length) {
					console.log("error: room " + destinationRoomNum + " not found");
					return;
				}
				roomNum = destinationRoomNum;
				entities = [];
				window.Rooms[roomNum].forEach(function(entity) {
					// copy the entities so we don't change the contents of window.Levels
					// this makes the level 'reset' next time the player comes back to it.
					entities.push(Entity.clone(entity));
				});
				camera = entities.filter(function(entity) {
					return entity.camera;
				})[0];
			},
			restartLevel: function() {
				this.loadRoom(this.getRoomNum());
			},
			getExtraEntities: function() {
				var allEntities;
				allEntities = [].concat(entities);
				entities.filter(function(entity) {
					return Entity.getLeft(entity) < camera.x + view.width / 2 && Entity.getRight(entity) > camera.x - view.width / 2; // on screen any amount
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
			}
		}
	}  
};