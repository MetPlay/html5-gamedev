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

engine.core.animation = function(animation, __assets) {
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
			return false;
		} else if(this.repeat == engine.constants.repeat_types.LOOP) {
			this.frame_at = 0;
			return false;
		}

		return true;
	}

	// true only on animation end
	this.update = function() {
		this.change_in += engine.core.time.delta();
		if(this.change_in >= this.speed) {
			this.change_in = 0;			
			return this.next();
		} else return false;
	}

	this.present = function(self, drawing) {
		if(drawing) {
			var asset = engine.plugins.asset_manager.assets[this.frames[this.frame_at]];
			asset.present(self, drawing);
		}
	}

	this.getResource = function() {
		return engine.plugins.asset_manager.assets[this.frames[this.frame_at]].getResource();
	}

	this.reset = function() {
		this.frame_at = 0;
	}

	return this;
};

engine.core.sprite = function(sprite, __assets) {
	this.paths = sprite.paths || {};
	this.idle = sprite.idle || "idle";

	this.path_at = this.idle;

	this.update = function() {
		if(this.paths[this.path_at]) {
			// if animation ended
			if(engine.plugins.asset_manager.assets[this.paths[this.path_at]].update()) {				
				var old_path = this.path_at;
				this.path_at = this.idle;
				engine.plugins.asset_manager.assets[this.paths[old_path]].reset();
			}
		}
	}

	this.present = function(self, drawing) {
		if(drawing) {
			if(this.paths[this.path_at]) {
				engine.plugins.asset_manager.assets[this.paths[this.path_at]].present(self, drawing);
			}
		}
	}

	this.getResource = function() {
		return engine.plugins.asset_manager.assets[this.paths[this.path_at]].getResource();
	}

	return this;
};

engine.core.procedural = function(proc, __assets) {
	this.generator = proc.generator || function(self) {};
	this.width = proc.width || 0;
	this.height = proc.height || 0;

	this.update = proc.update || function() {}

	this.present = proc.present || function(self, drawing) {}

	this.getResource = function() {
		return this;
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
				} else if(asset[1].type == types.SPRITE) {
					_.assets[asset[0]] = new engine.core.sprite(asset[1], _.assets);
					_.asset_count--;
					if(_.asset_count <= 0) {
						callback();
					}
				}
			})(tuples[index], engine.plugins.asset_manager.asset_types);
		}
	}
}
