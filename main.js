
window.onload = function() {
	engine.config = {
		debug : true,
		assets : [
			{ name : "damir", path : "damir.png" }
		]
	}

	engine.plugins.asset_manager.init(function() {
		engine.self(function() {
			engine.plugins.scene.stage.render = function(self, drawing) {
				drawing.context.fillStyle = "red";
				drawing.context.fillRect(0, 0, drawing.canvas.width, drawing.canvas.height);
			}

			for(var i = 0; i < 100; i++) {
				engine.plugins.scene.stage.addChild({
					position : { 
						x : Math.random() * engine.drawing.canvas.width,
						y : Math.random() * engine.drawing.canvas.height
					},
					name : "Damir",
					image : "damir",
					tag : { 
						rotation_speed : Math.random()
					}			
				}).update = function(self) {
					self.rotation += self.tag.rotation_speed;
				};
			}
		});
	});
}