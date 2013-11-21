/*
	var = broj | string | niz | 
		  objekat | funkcija | var |
		  izraz (var + var, var * var, var - var, ...)
	niz = [ var, var, ... ]
	osobina = string : var
	objekat = { osobina, osobina, osobina, ... }
*/

engine.plugins.scene = {
	createTransform : function(assetname) {
		if(assetname == undefined) assetname = "";

		return {
			name : assetname,
			position : { 
				x : 0, 
				y : 0 
			},
			rotation : 0,
			scale : { 
				x : 1, 
				y : 1 
			},
			
			children : [],
			parent : null,

			image : engine.plugins.asset_manager.assets[assetname],

			addChild : function(child) {
				this.children.push(child);
				return child;
			},

			render : function() {				
				(function(self, context, canvas) {
					for(index in self.children) {
						if(self.children[index] && self.children[index].render) {							
							self.children[index].render();
						}
					}

					if(self.image) {
						context.drawImage(self.image, self.position.x, self.position.y);
					}
				})(this, engine.drawing.context, engine.drawing.canvas);
			}
		};
	},

	stage : null,

	render : function() {
		if(this.stage && this.stage.render) {
			this.stage.render();
		}
	}
};

// CLOSURE

(function(scene) {
	scene.stage = scene.createTransform();
})(engine.plugins.scene);