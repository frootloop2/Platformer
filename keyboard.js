window.Keyboard = (function() {
	var _pressed = {},
		_truePressed = {},
		_pressedThisFrame = {},
		_pressedSinceLastFrame = {};

	window.addEventListener("keydown", function(ev) {
		if(_pressed[ev.keyCode] !== true) {
			_pressed[ev.keyCode] = true;
			_pressedSinceLastFrame[ev.keyCode] = true;
		}
	});
	window.addEventListener("keyup", function(ev) {
		delete _pressed[ev.keyCode];
		delete _pressedSinceLastFrame[ev.keyCode];
	});
	window.addEventListener("blur", function(ev) {
		_pressed = {};
		_pressedSinceLastFrame = {};
	});
	return {
		Keys: {
			SPACE: 32,
			
			LEFT:  37,
			UP:	38,
			RIGHT: 39,
			DOWN:  40,
			
			A: 65,
			C: 67,
			X: 88,
			Z: 90
		},
		isKeyPressed: function(keyCode) {
			return _truePressed[keyCode] !== undefined;
		},
		isKeyPressedSinceStartOfLastFrame: function(keyCode) {
			return _pressedThisFrame[keyCode] !== undefined;
		},
		tickFrame: function() {
			_pressedThisFrame = _pressedSinceLastFrame;
			_pressedSinceLastFrame = {};
			_truePressed = _pressed;
		}
	};
}());