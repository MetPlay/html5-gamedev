
Number.prototype.times = function(fn) {
        for(var i = 0; i < this; i++) {
                fn(i);
        }
}

Number.prototype.is_between = function(x, y) {
	return this >= x && this <= y;
}

String.prototype.instantiate = function(options) {
        if(engine.plugins.scene && engine.plugins.scene.stage) {
                na = this.split(":");
                name = na[0];
                asset = na[1];
                options.name = name;
                options.asset = asset;
                return engine.plugins.scene.stage.addChild(options);
        } else return null;
}

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
	
	WIDTH : 0,
	HEIGHT : 0,
	
	self : function(callback) {
		var fitWindow = function(element) {
			element.width = window.innerWidth;
			element.height = window.innerHeight;
                        engine.WIDTH = engine.drawing.canvas.width;
                        engine.HEIGHT = engine.drawing.canvas.height;
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

var reengine = {
	loading : null,
	
	load : function(lfn) {
		reengine.loading = lfn(engine.plugins.asset_manager);
	},
	
	start : function(fn) {
		window.onload = function() {
			if(reengine.loading) reengine.loading(); 	
			engine.plugins.asset_manager.init(function() {
		                engine.self(function() {
		                	fn(); 
				});
			});
		};
	}
}