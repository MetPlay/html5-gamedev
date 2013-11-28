
window.onload = function() {
	(function($) {
		engine.config = {
			debug : true,
			assets : {
				/* <drvo> */
					drvo1 : { 
						path : "assets/drvo.png", 
						type : $.asset_types.IMAGE 
					},
					drvo_idle : { 
						frames : [ "drvo1" ], 
						type : $.asset_types.ANIMATION,
						repeat : engine.constants.repeat_types.LOOP 
					},
					drvo : {
						paths : { 
							idle : "drvo_idle" 
						},
						type : $.asset_types.SPRITE
					},
				/* </drvo> */
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

			var treex = -100;
			var treey = 0;

			for(var i = 1; i < 40; i++) {
				treey += Math.random() * 5;
				engine.plugins.scene.stage.addChild({
					name : "Drvo" + i,
					asset : "drvo",
					position : { 
						x : Math.random() * engine.drawing.canvas.width, 
						y : treey - 150 
					}
				});
			}
			treey += 40
			for(var i = 1; i < 15; i++) {
				treex += 100 + Math.random() * 5;
				treey += Math.random() * 5;
				engine.plugins.scene.stage.addChild({
					name : "Drvo" + i,
					asset : "drvo",
					position : { 
						x : treex, 
						y : treey - 150 
					}
				});
			}


			engine.plugins.scene.stage.addChild({				
				name : "Damir",
				asset : "damir",

				position : { 
					x : engine.drawing.canvas.width / 2,
					y : engine.drawing.canvas.height / 2
				},

				tag : {
					target : { 
						x : engine.drawing.canvas.width / 2,
						y : engine.drawing.canvas.height / 2
					},
				},
				
				onKey : function(self, event) {	

				},

				onMouse : function(self, event) {
					if(event.state) {
						if(engine.plugins.scene.hitUnderMouse() !== null) {
							self.scaleTo(1.1, 1.1);
						} else {
							self.tag.target.x = event.x;
							self.tag.target.y = event.y;
						}
					} else self.scaleTo(1, 1);
				}
			})
			.addUpdateHook(function(self) {
				if(self.position.x == self.tag.target.x &&
					self.position.y == self.tag.target.y) {
					// stigli na odrediste i nista vise
				} else {		
					var a = self.position;
					var b = self.tag.target;
					// { x : 10, y : 12 } - { x : 9, y : 6 }
					// posto ne mozemo da oduzimamo objekte,
					// moramo oduzimati komponente x, y posebno
					var dx = b.x - a.x;
					var dy = b.y - a.y;
					// vremenska delta izmedju dva frejma
					var delta = engine.core.time.delta();
					// mrdamo damira za deo puta koji moze da
					// stane u delta-vremenu
					self.moveBy(dx * delta, dy * delta);
				}
			})
		});
	});
}