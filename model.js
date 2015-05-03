window.Model = {
	create: function() {
		// TODO: make the structure private vars and have methods on the return object to deal with them.
		return {
			entities: [],
			camera: null,
			view: {
				width: 1600,
				height: 900
			},
			levelNum: 0,
			loadLevel: function() {
				var _this = this;
				if(_this.levelNum >= window.Levels.length) {
					_this.levelNum = 0;
				}
				_this.entities = window.Levels[_this.levelNum];
				_this.camera = _this.entities.filter(function(entity) {
					return entity.camera;
				})[0];
			},
			getExtraEntities: function() {
				var _this = this;
				var allEntities;
				allEntities = [].concat(this.entities);
				this.entities.filter(function(entity) {
					return entity.x - entity.width / 2 < _this.camera.x + _this.view.width / 2 && entity.x + entity.width / 2 > _this.camera.x - _this.view.width / 2; // on screen any amount
				}).forEach(function(entity) {
					var newEntity,
						direction,
						distance;
					newEntity = Entity.clone(entity);

					direction = Entity.getLeft(newEntity) < _this.camera.x - _this.view.width / 2 ? -1 : 1;
					distance = Math.max(0, Math.max(-(Entity.getLeft(newEntity) - _this.camera.x + _this.view.width / 2), Entity.getRight(newEntity) - _this.camera.x - _this.view.width / 2));
					newEntity.width -= distance;
					newEntity.x -= direction * distance / 2;
					
					// left copy
					newEntity.x -= _this.view.width;
					allEntities.push(newEntity);
					
					// right copy
					newEntity = Entity.clone(newEntity);
					newEntity.x += 2 * _this.view.width;
					allEntities.push(newEntity);
				});
				return allEntities;
			}
		}
	}  
};