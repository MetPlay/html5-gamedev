
var engine = {
	config : {},
	drawing : {},
	plugins : {},

	// CONTENT PIPELINE

	self : function(callback) {
		var fitWindow = function(element) {
			element.width = window.innerWidth;
			element.height = window.innerHeight;
		};

		engine.drawing.canvas = document.getElementById('crtez');
		engine.drawing.context = engine.drawing.canvas.getContext("2d");

		var fixWindow = function() {
			fitWindow(engine.drawing.canvas);
			if(engine.plugins.scene && 
				engine.plugins.scene.render)
				engine.plugins.scene.render();
		};

		window.onresize = fixWindow;

		fixWindow();
		callback();
		fixWindow();
	}
}