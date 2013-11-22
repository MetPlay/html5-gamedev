
window.onload = function() {
	(function($) {
		engine.config = {
			debug : true,
			assets : {
				damir1 : { path : "assets/damir1.png", type : $.asset_types.IMAGE },				
				damir2 : { path : "assets/damir2.png", type : $.asset_types.IMAGE },				
				damir3 : { path : "assets/damir3.png", type : $.asset_types.IMAGE },				
				damir4 : { path : "assets/damir4.png", type : $.asset_types.IMAGE },				
				damir_idle : { 
					frames : [ "damir1", "damir2", "damir3", "damir4" ], 
					type : $.asset_types.ANIMATION,
					repeat : engine.constants.repeat_types.LOOP
				},

				damir11 : { path : "assets/damir11.png", type : $.asset_types.IMAGE },				
				damir22 : { path : "assets/damir22.png", type : $.asset_types.IMAGE },				
				damir33 : { path : "assets/damir33.png", type : $.asset_types.IMAGE },				
				damir44 : { path : "assets/damir44.png", type : $.asset_types.IMAGE },				
				damir_attack : { 
					frames : [ "damir11", "damir22", "damir33", "damir44" ], 
					type : $.asset_types.ANIMATION,
					repeat : engine.constants.repeat_types.STOP_AT_END
				},

				damir : { 
					paths : { idle : "damir_idle", attack : "damir_attack" },
					type : $.asset_types.SPRITE
				}
			}
		}
	})(engine.plugins.asset_manager);

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
				asset : "damir",
				tag : {
					rotation_speed : 100 * (Math.random() - 0.5)
				},
				update : function(self) {
					self.position.x = engine.plugins.input.mouse_position.x;
					self.position.y = engine.plugins.input.mouse_position.y;
					self.rotation += self.tag.rotation_speed * engine.core.time.delta();

					self.scale.x = self.scale.y = engine.plugins.input.isMouseButtonDown(0) ? 1.1 : 1;
					
					if(self.asset.update)
						self.asset.update();
				},
				
				onMouse : function(self, event) {},

				onKey : function(self, event) {
					self.asset.path_at = "attack";
				}
			});
		});
	});
}