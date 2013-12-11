
// useful functions and polyfills for engine core
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

engine.core.transform_id = 1;

engine.core.transform = function(predef) {
	predef = predef || {};

	return (function(predef) {
		temp_asset = engine.plugins.asset_manager.assets[predef.asset];
		return {
			__transform : ++engine.core.transform_id,
			tag : predef.tag || {},
			name : predef.name || "untitled",
			position : {
				x : predef.position ? predef.position.x || 0 : 0, 
				y : predef.position ? predef.position.y || 0 : 0 
			},
			center : {
				x : temp_asset ? temp_asset.getResource().width / 2 : 0, 
				y : temp_asset ? temp_asset.getResource().height / 2 : 0
			},
			scale : { 
				x : predef.scale ? predef.scale.x || 1 : 1, 
				y : predef.scale ? predef.scale.y || 1 : 1 
			},
			rotation : predef.rotation || 0,

			active : true,
			frontChildren : [],
			backChildren : [],
			children : [],

			parent : null,

			asset : temp_asset,

			rotateBy : function(dr) {
				this.rotation += dr;
			},

			rotateTo : function(r) {
				this.rotation = r;
			},

			moveBy : function(dx, dy) {
				this.position.x += dx;
				this.position.y += dy;
				engine.plugins.scene.updateBuckets(this);
			},

			moveTo : function(x, y) {
				this.position.x = x;
				this.position.y = y;
				engine.plugins.scene.updateBuckets(this);
			},

			scaleBy : function(dx, dy) {
				this.scale.x *= dx;
				this.scale.y *= dy;
			},

			scaleFor : function(dx, dy) {
				this.scale.x += dx;
				this.scale.y += dy;
			},

			scaleTo : function(x, y) {
				this.scale.x = x;
				this.scale.y = y;
			},

			addChild : function(child, frontOrBack) {
				if(!frontOrBack) frontOrBack = true;
				if(child.__transform)
					(frontOrBack ? this.frontChildren : this.backChildren).push(child);
				else
					(frontOrBack ? this.frontChildren : this.backChildren).push(child = new engine.core.transform(child));

				this.children.push(child);
				engine.plugins.scene.updateBuckets(child);
				return child;
			},

			hookUpdate : function(hook) {
				this.updateHooks.push(hook);
				return this;
			},

			hookRender : function(hook) {
				this.renderHooks.push(hook);
				return this;
			},
			
			hookLateRender : function(hook) {
				this.lateRenderHooks.push(hook);
				return this;
			},

			render : predef.render ? predef.render : function(self, drawing) {
				if(self.asset) {
					self.asset.present(self, drawing);
				}
			},

			deepRender : function() {
				if(!engine.drawing.context) return;

				(function(self, drawing) {
					drawing.context.save();
					drawing.context.translate(self.position.x, self.position.y);
					drawing.context.save();
					drawing.context.scale(self.scale.x, self.scale.y);
					drawing.context.rotate(self.rotation * Math.PI / 180);

					for(index in self.backChildren) {
						if(self.backChildren[index] && self.backChildren[index].render) {				
							drawing.context.save();
							self.backChildren[index].deepRender();
							drawing.context.restore();
						}
					}

					self.render(self, drawing);
					for(index in self.renderHooks) {
						self.renderHooks[index](self, drawing);
					}
					for(index in self.frontChildren) {
						if(self.frontChildren[index] && self.frontChildren[index].render) {				
							drawing.context.save();
							self.frontChildren[index].deepRender();
							drawing.context.restore();
						}
					}

					drawing.context.restore();
					for(index in self.lateRenderHooks) {
						self.lateRenderHooks[index](self, drawing);
					}
					drawing.context.restore();
				})(this, engine.drawing);
			},

			update : predef.update ? predef.update : function(self) {
				if(self.asset) {
					self.asset.update();
				}
			},

			updateHooks : [],
			lateRenderHooks : [],
			renderHooks : [],

			deepUpdate : function() {
				(function(self) {
					if(self.active) {					
						self.update(self);
						for(index in self.updateHooks) {
							self.updateHooks[index](self);
						}

						for(index in self.children) {
							if(self.children[index] && self.children[index].render) {				
								self.children[index].deepUpdate();
							}
						}
					}
				})(this);
			},

			onMouse : predef.onMouse ? predef.onMouse : null,

			onKey : predef.onKey ? predef.onKey : null,

			mouse : function(event) {
				if(this.onMouse) this.onMouse(this, event);

				for(index in this.children) {
					if(this.children[index] && this.children[index].mouse) {				
						this.children[index].mouse(event);
					}
				}
			},

			key : function(event) {
				if(this.onKey) this.onKey(this, event);

				for(index in this.children) {
					if(this.children[index] && this.children[index].key) {
						this.children[index].key(event);
					}
				}
			}
		};
	})(predef);
};

engine.plugins.scene = {
	stage : null,
	buckets : {},
	inverse_buckets : {},

	bucketHash : function(x, y) {
		return [ Math.round(x / 100), Math.round(y / 100) ];
	},

	clearFromBuckets : function(obj) {
		if(this.inverse_buckets[obj.__transform]) {
			for(var index in this.inverse_buckets[obj.__transform]) {
				var buck = this.inverse_buckets[obj.__transform][index];
				this.buckets[buck.x][buck.y][obj.__transform] = undefined;
			}
			this.inverse_buckets[obj.__transform] = undefined;
		}

		this.inverse_buckets[obj.__transform] = [];
	},

	addToBuckets : function(obj, x, y) {
		hash = this.bucketHash(x, y);
		xbucket = hash[0];
		ybucket = hash[1];

		if(!this.buckets[xbucket]) this.buckets[xbucket] = {};
		if(!this.buckets[xbucket][ybucket]) this.buckets[xbucket][ybucket] = {};
		if(!this.buckets[xbucket][ybucket][obj.__transform]) {
			this.inverse_buckets[obj.__transform].push({ x : xbucket, y : ybucket });
			this.buckets[xbucket][ybucket][obj.__transform] = obj;
		}
	},

	addToBucketsHashed : function(obj, x, y) {
		xbucket = x;
		ybucket = y;

		if(!this.buckets[xbucket]) this.buckets[xbucket] = {};
		if(!this.buckets[xbucket][ybucket]) this.buckets[xbucket][ybucket] = {};
		if(!this.buckets[xbucket][ybucket][obj.__transform]) {
			this.inverse_buckets[obj.__transform].push({ x : xbucket, y : ybucket });
			this.buckets[xbucket][ybucket][obj.__transform] = obj;
		}
	},

	updateBuckets : function(obj) {
		w2 = obj.asset.getResource().width / 2;
		h2 = obj.asset.getResource().height / 2;
		this.clearFromBuckets(obj);
		
		xy1 = this.bucketHash(obj.position.x - w2, obj.position.y - h2);
		xy2 = this.bucketHash(obj.position.x + w2, obj.position.y + h2);

		for(var i = xy1[0]; i <= xy2[0]; i++) {
			for(var j = xy1[1]; j <= xy2[1]; j++) {
				this.addToBucketsHashed(obj, i, j);
			}
		}
	},

	hit : function(x, y) {
		hash = this.bucketHash(x, y);
		xbucket = hash[0];
		ybucket = hash[1];
		if(this.buckets[xbucket] && this.buckets[xbucket][ybucket]) {
			for(var _i in this.buckets[xbucket][ybucket]) {
				var obj = this.buckets[xbucket][ybucket][_i];
				if(obj) {
					w2 = (obj.asset.getResource().width / 2) * obj.scale.x;
					h2 = (obj.asset.getResource().height / 2) * obj.scale.y;
					// check collision (simple method -- bounding box)
					if(x.is_between(obj.position.x - w2, obj.position.x + w2) &&
					   y.is_between(obj.position.y - h2, obj.position.y + h2)) {
						return obj;
					}
				}
			}
		}

		return null;
	},

	hitUnderMouse : function() {
		return this.hit(engine.plugins.input.mouse_position.x, engine.plugins.input.mouse_position.y);
	},

	render : function() {
		if(this.stage && this.stage.deepRender) {
			this.stage.deepRender();
		}
	},

	update : function() {
		if(this.stage && this.stage.deepUpdate) {
			this.stage.deepUpdate();
		}
	},

	mouse : function(event) {
		this.stage.mouse(event);
	},

	key : function(event) {
		this.stage.key(event);
	}
};

// CLOSURE

(function(scene) {
	scene.stage = new engine.core.transform();

	(function animloop(){
		engine.core.time.measure();
  		engine.plugins.scene.update();
    	engine.plugins.scene.render();
  		requestAnimationFrame(animloop);
	})();
})(engine.plugins.scene);