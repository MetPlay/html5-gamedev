
engine.core.getMousePosition = function(e) {
	var posx = 0;
	var posy = 0;
	
	if (!e) var e = window.event;
	if (e.pageX || e.pageY) {
		posx = e.pageX;
		posy = e.pageY;
	} else if (e.clientX || e.clientY) 	{
		posx = e.clientX + document.body.scrollLeft
			+ document.documentElement.scrollLeft;
		posy = e.clientY + document.body.scrollTop
			+ document.documentElement.scrollTop;
	}

	return { x : posx, y : posy }
}

engine.core.createInputEvent = function(event, pressOrRelease) {
		var t = event.type;
		if(t == "mousedown" || t == "mouseup") {
			return { button : event.button, x : event.offsetX, y : event.offsetY, state : pressOrRelease };
		} else if(t == "keydown" || t == "keyup") {
			return { key : event.keyCode, char : event.charCode, state : pressOrRelease };
		} else if(t == "mousemove") {
			var xy = engine.core.getMousePosition(event);
			xy.state = pressOrRelease;
			return xy;
		}
	},

engine.plugins.input = {
	keys : {},
	buttons : {},

	mouse_position : {
		x : 0,
		y : 0
	},

	onMouseMove : function(event) {
		var e = engine.core.createInputEvent(event, undefined);
		engine.plugins.input.mouse_position.x = e.x;
		engine.plugins.input.mouse_position.y = e.y;
	},

	onMouseDown : function(event) {
		var e = engine.core.createInputEvent(event, true);
		engine.plugins.input.buttons[e.button] = 1;
		engine.plugins.scene.mouse(e, true);
	},

	onMouseUp : function(event) {
		var e = engine.core.createInputEvent(event, false);
		engine.plugins.input.buttons[e.button] = 0;		
		engine.plugins.scene.mouse(e, false);
	},

	onKeyPress : function(event) {
		var e = engine.core.createInputEvent(event, true);
		engine.plugins.input.keys[e.key] = 1;
		engine.plugins.scene.key(e, true);
		if(event.keyCode != 116)
			event.preventDefault();
	},

	onKeyRelease : function(event) {
		var e = engine.core.createInputEvent(event, false);
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