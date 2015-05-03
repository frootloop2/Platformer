window.Entity = {
	clone: function(entity) {
		var newEntity;
		newEntity = {};
		// doesn't do deep clone.
		Object.keys(entity).forEach(function(key) {
			newEntity[key] = entity[key];
		});
		return newEntity;
	},
	getTop: function(entity) {
		return entity.y + entity.height / 2;
	},
	getBottom: function(entity) {
		return entity.y - entity.height / 2;
	},
	getRight: function(entity) {
		return entity.x + entity.width / 2;
	},
	getLeft: function(entity) {
		return entity.x - entity.width / 2;
	}
};