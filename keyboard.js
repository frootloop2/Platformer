window.Keyboard = (function() {
	var _pressed = {};
	window.addEventListener("keydown", function(ev) {
		_pressed[ev.keyCode] = true;
	});
	window.addEventListener("keyup", function(ev) {
		delete _pressed[ev.keyCode];
	});
	return {
		Keys: {
			SPACE: 32,
			
			LEFT:  37,
			UP:	38,
			RIGHT: 39,
			DOWN:  40,
			
			A: 65,
			D: 68,
			S: 83,
			W: 87
		},
		isKeyPressed: function(keyCode) {
			return _pressed[keyCode] !== undefined;
		}
	};
}());