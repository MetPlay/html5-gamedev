
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
				drawing.context.fillStyle = "green";
				drawing.context.fillRect(0, 0, drawing.canvas.width, drawing.canvas.height);
			}

			engine.plugins.scene.stage.addChild({
				position : { 
					x : Math.random() * engine.drawing.canvas.width,
					y : Math.random() * engine.drawing.canvas.height
				},
				name : "Damir",
				image : "damir",
				tag : {
					rotation_speed : 2 * (Math.random() - 0.5)
				},
				update : function(self) {
					self.position.x = engine.plugins.input.mouse_position.x;
					self.position.y = engine.plugins.input.mouse_position.y;
					self.rotation += self.tag.rotation_speed;
				},
				onMouse : function(event) {
					console.log(event);
				}
			});
		});
	});
}