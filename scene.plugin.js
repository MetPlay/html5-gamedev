
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

engine.plugins.scene = {
	stage : null,

	createTransform : function(predef) {
		predef = predef || {};
		
		var temp_image = null;
		if(predef.image)
			temp_image = engine.plugins.asset_manager.assets[predef.image];

		return {
			__transform : 1,
			tag : predef.tag || {},
			name : predef.name || "untitled",
			position : { 
				x : predef.position ? predef.position.x || 0 : 0, 
				y : predef.position ? predef.position.y || 0 : 0 
			},
			center : {
				x : temp_image ? temp_image.width / 2 : 0, 
				y : temp_image ? temp_image.height / 2 : 0
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

			image : temp_image,

			addChild : function(child, frontOrBack) {
				if(!frontOrBack) frontOrBack = true;
				if(child.__transform) 
					(frontOrBack ? this.frontChildren : this.backChildren).push(child);
				else
					(frontOrBack ? this.frontChildren : this.backChildren).push(child = engine.plugins.scene.createTransform(child));

				this.children.push(child);
				return child;
			},

			render : predef.render ? predef.render : function(self, drawing) {
				if(self.image) {
					drawing.context.drawImage(self.image, -self.center.x, -self.center.y);
				}
			},

			deepRender : function() {
				if(!engine.drawing.context) return;

				(function(self, drawing) {
					drawing.context.save();
					drawing.context.scale(self.scale.x, self.scale.y);
					drawing.context.translate(self.position.x, self.position.y);
					drawing.context.rotate(self.rotation * Math.PI / 180);

					for(index in self.backChildren) {
						if(self.backChildren[index] && self.backChildren[index].render) {				
							drawing.context.save();
							self.backChildren[index].deepRender();
							drawing.context.restore();
						}
					}

					self.render(self, drawing);

					for(index in self.frontChildren) {
						if(self.frontChildren[index] && self.frontChildren[index].render) {				
							drawing.context.save();
							self.frontChildren[index].deepRender();
							drawing.context.restore();
						}
					}

					drawing.context.restore();
				})(this, engine.drawing);
			},

			update : predef.update ?  predef.update : function(self) {},

			deepUpdate : function() {
				(function(self) {
					if(self.active) {
						self.update(self);

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
				if(this.onMouse) this.onMouse(event);

				for(index in this.children) {
					if(this.children[index] && this.children[index].mouse) {				
						this.children[index].mouse(event);
					}
				}
			},

			key : function(event) {
				if(this.onKey) this.onKey(event);

				for(index in this.children) {
					if(this.children[index] && this.children[index].key) {
						this.children[index].key(event);
					}
				}
			}
		};
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
	scene.stage = scene.createTransform();

	(function animloop(){
  		requestAnimationFrame(animloop);

  		engine.plugins.scene.update();
    	engine.plugins.scene.render();
	})();
})(engine.plugins.scene);