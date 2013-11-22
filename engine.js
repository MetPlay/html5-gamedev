
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

var engine = {
	constants : {},
	core : {
		time : {
			scale : {
				__const : 1,
				view : 1,
			},

			moment : {
				now : 0,
				then : 0,
				delta : 0
			},

			measure : function() {
				this.moment.now = Date.now();
				this.moment.delta = (this.moment.now - this.moment.then) / 1000;
				this.moment.then = this.moment.now;
			},

			delta : function(scale) {
				scale = scale || "__const";
				return this.moment.delta * this.scale[scale];
			}
		},
	},
	config : {},
	drawing : {},
	plugins : {},

	self : function(callback) {
		var fitWindow = function(element) {
			element.width = window.innerWidth;
			element.height = window.innerHeight;
		};

		engine.drawing.canvas = document.getElementById('surface');
		engine.drawing.context = engine.drawing.canvas.getContext("2d");

		var fixWindow = function() {
			fitWindow(engine.drawing.canvas);
			if(engine.plugins.scene && 
				engine.plugins.scene.render)
				engine.plugins.scene.render();
		};

		window.onresize = fixWindow;

		fitWindow(engine.drawing.canvas);
		callback();
		fixWindow();
	}
}