
window.onload = function() {
	(function($) {
		engine.config = {
			debug : true,
			assets : {
				/* <damir> */
				
					// slike i prva animacija
					damir1 : { path : "assets/damir1.png", type : $.asset_types.IMAGE },				
					damir2 : { path : "assets/damir2.png", type : $.asset_types.IMAGE },				
					damir3 : { path : "assets/damir3.png", type : $.asset_types.IMAGE },				
					damir4 : { path : "assets/damir4.png", type : $.asset_types.IMAGE },				
					damir_idle : { 
						frames : [ "damir1", "damir2", "damir3", "damir4" ], 
						type : $.asset_types.ANIMATION,
						repeat : engine.constants.repeat_types.LOOP,
					},

					// slike i druga animacija
					damir11 : { path : "assets/damir11.png", type : $.asset_types.IMAGE },				
					damir22 : { path : "assets/damir22.png", type : $.asset_types.IMAGE },				
					damir33 : { path : "assets/damir33.png", type : $.asset_types.IMAGE },				
					damir44 : { path : "assets/damir44.png", type : $.asset_types.IMAGE },				
					damir_attack : { 
						frames : [ "damir11", "damir22", "damir33", "damir44" ], 
						type : $.asset_types.ANIMATION,
						repeat : engine.constants.repeat_types.STOP_AT_END,
						speed: 0.1
					},

					// sprite
					damir : { 
						paths : { 
							idle : "damir_idle", 
							attack : "damir_attack" 
						},
						type : $.asset_types.SPRITE
					}
				/* </damir> */
			} 
		};
	})(engine.plugins.asset_manager);

	engine.plugins.asset_manager.init(function() {
		engine.self(function() {
			engine.plugins.scene.stage.render = function(self, drawing) {
				drawing.context.fillStyle = "green";
				drawing.context.fillRect(0, 0, drawing.canvas.width, drawing.canvas.height);
			}

			engine.plugins.scene.stage.addChild({				
				name : "Damir",
				asset : "damir",

				position : { 
					x : Math.random() * engine.drawing.canvas.width,
					y : Math.random() * engine.drawing.canvas.height
				},

				tag : {
					holding_mouse : true,
					rotation_speed : 10 * (Math.random() - 0.5)
				},
				
				onKey : function(self, event) {
					if(event.key == 32 && event.state) {
						self.tag.holding_mouse = !self.tag.holding_mouse;
					} else if(event.key != 32) {
						self.asset.path_at = "attack";
					}
				},

				onMouse : function(self, event) {
					if(event.state) {
						if(engine.plugins.scene.hitUnderMouse() === self) {
							self.scaleTo(1.1, 1.1);
						}
					} else self.scaleTo(1, 1);
				}
			}).addUpdateHook(function(self) {
				if(self.tag.holding_mouse) {
					self.moveTo(engine.plugins.input.mouse_position.x, engine.plugins.input.mouse_position.y);
				}
				self.rotateBy(self.tag.rotation_speed * engine.core.time.delta());
			}).addRenderHook(function(self, drawing) {
				drawing.context.save();
				drawing.context.fillStyle = "#fff";
				drawing.context.fillText(self.tag.holding_mouse ? "Mouse Held" : "Mouse Free", 100, 30);
				drawing.context.restore();
			}).addLateRenderHook(function(self, drawing) {
				drawing.context.save();
				drawing.context.fillStyle = "#fff";
				drawing.context.fillText(self.tag.holding_mouse ? "Mouse Held" : "Mouse Free", 100, 30);
				drawing.context.restore();
			});
		});
	});
}