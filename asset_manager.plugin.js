engine.constants.repeat_types = {
	STOP_AT_END : 0,
	LOOP : 1
};

engine.core.asset = function(resource) {
	this.resource = resource;

	this.present = function(self, drawing) {
		if(this.resource.width && this.resource.height)
			if(drawing) {
				drawing.context.drawImage(this.resource, -self.center.x, -self.center.y);
			}
	};

	this.getResource = function() { return this.resource; }

	return this;
}

engine.core.animation = function(animation) {
	this.repeat = animation.repeat || engine.constants.repeat_types.STOP_AT_END;
	this.frames = [];
	if(animation.frames) {
		for(var index in animation.frames) {
			this.frames.push(animation.frames[index]);
		}
	}

	this.speed = animation.speed || 0.5;
	this.time_scale = undefined;	
	// undefined == __const time in engine
	
	this.change_in = 0;

	this.frame_at = 0;

	this.next = function() {
		if(this.frame_at < this.frames.length - 1) {
			this.frame_at++;
		} else if(this.repeat == engine.constants.repeat_types.LOOP) {
			this.frame_at = 0;
		}
	}

	this.update = function() {
		this.change_in += engine.core.time.delta();
		if(this.change_in >= this.speed) {
			this.change_in = 0;
			this.next();
		}
	}

	this.present = function(self, drawing) {
		if(drawing) {
			if(!drawn) {
				console.log(self);
				drawn = true;
			}
			var asset = engine.plugins.asset_manager.assets[this.frames[this.frame_at]];
			asset.present(self, drawing);
		}
	}

	this.getResource = function() {
		return engine.plugins.asset_manager.assets[this.frames[this.frame_at]].getResource();
	}

	return this;
};

drawn = false;
engine.plugins.asset_manager = {
	asset_types : {
		IMAGE : 0,
		ANIMATION : 1,
		SPRITE : 2,
	},

	asset_count : 0,
	assets : {},			

	init : function(callback) {
		var _ = engine.plugins.asset_manager;
		var to_load = engine.config.assets;

		tuples = [];

		for(var key in to_load) {
			tuples.push([key, to_load[key]]);
		}

		tuples.sort(function(a, b) {
			a = a[1].type;
			b = b[1].type;
			return a < b ? - 1 : (a > b ? 1 : 0);
		});

		_.asset_count = tuples.length;

		for(var index in tuples) {
			(function(asset, types) {
				if(asset[1].type == types.IMAGE) {
					var img = new Image();
					var obj = asset[1];
					img.onload = function() {
						_.assets[asset[0]] = new engine.core.asset(img);
						_.asset_count--;
						if(_.asset_count <= 0) {
							callback();
						}
					}
					img.src = obj.path;
				} else if(asset[1].type == types.ANIMATION) {
					_.assets[asset[0]] = new engine.core.animation(asset[1], _.assets);
					_.asset_count--;
					if(_.asset_count <= 0) {
						callback();
					}
				}
			})(tuples[index], engine.plugins.asset_manager.asset_types);
		}
	}
}
