engine.plugins.input = {
	createInputEvent : function(event, pressOrRelease) {
		var t = event.type;
		if(t == "mousedown" || t == "mouseup") {
			return { button : event.button, x : event.offsetX, y : event.offsetY, state : pressOrRelease };
		} else if(t == "keydown" || t == "keyup") {
			return { key : event.keyCode, char : event.charCode, state : pressOrRelease };
		} else if(t == "mousemove") {
			return { x : event.offsetX, y : event.offsetY, state : pressOrRelease };
		}
	},

	keys : {},
	buttons : {},

	mouse_position : {
		x : 0,
		y : 0
	},
	
	onMouseMove : function(event) {
		var e = engine.plugins.input.createInputEvent(event);
		engine.plugins.input.mouse_position.x = e.x;
		engine.plugins.input.mouse_position.y = e.y;
	},

	onMouseDown : function(event) {
		var e = engine.plugins.input.createInputEvent(event);
		engine.plugins.input.buttons[e.button] = 0;
		engine.plugins.scene.mouse(e, true);
	},

	onMouseUp : function(event) {
		var e = engine.plugins.input.createInputEvent(event);
		engine.plugins.scene.mouse(e, false);
	},

	onKeyPress : function(event) {
		var e = engine.plugins.input.createInputEvent(event);
		engine.plugins.input.keys[e.key] = 1;
		engine.plugins.scene.key(e, true);
		if(event.keyCode != 116)
			event.preventDefault();
	},

	onKeyRelease : function(event) {
		var e = engine.plugins.input.createInputEvent(event);
		engine.plugins.input.keys[e.key] = 0;
		engine.plugins.scene.key(e, false);
		if(event.keyCode != 116)
			event.preventDefault();
	},

	isKeyDown : function(key) {
		return engine.plugins.input.keys[key];
	},

	isMouseButtonDown : function(button) {
		return engine.plugins.input.buttons[button];
	}
}

window.onmousemove = engine.plugins.input.onMouseMove;
window.onmousedown = engine.plugins.input.onMouseDown;
window.onmouseup = engine.plugins.input.onMouseUp;
window.onkeydown = engine.plugins.input.onKeyPress;
window.onkeyup = engine.plugins.input.onKeyRelease;