reengine.start(function() {
	engine.plugins.scene.stage.render = function(self, drawing) {
		drawing.context.fillStyle = "green";
		drawing.context.fillRect(0, 0, drawing.canvas.width, drawing.canvas.height);
	}

	var treex = -100;
	var treey = 0;

	(40).times(function(i) {
		treey += Math.random() * 5;
		("Drvo" + i + ":drvo").instantiate({
			position : { 
				x : Math.random() * engine.drawing.canvas.width, 
				y : treey - 150 
			}
		});
	});
	
	treey += 40;	
	(15).times(function(i) {
		treex += 100 + Math.random() * 5;
		treey += Math.random() * 5;
		("Drvo" + i + ":drvo").instantiate({
			position : { 
				x : treex, 
				y : treey - 150 
			}
		});
	});

	("Damir:damir").instantiate({
		position : { 
			x : engine.WIDTH / 2,
			y : engine.HEIGHT / 2
		},

		tag : {
			target : { 
				x : engine.WIDTH / 2,
				y : engine.HEIGHT / 2
			},
		},
		
		onMouse : function(self, event) {
			if(event.state) {
				if(engine.plugins.scene.hitUnderMouse() !== null) {
				} else {
					self.tag.target.x = event.x;
					self.tag.target.y = event.y;
				}
			}
		}
	}).hookUpdate(function(self) {
		if(self.position.x == self.tag.target.x &&
			self.position.y == self.tag.target.y) {
		} else {		
			var a = self.position;
			var b = self.tag.target;
			var dx = b.x - a.x;
			var dy = b.y - a.y;
			var delta = engine.core.time.delta();
			self.moveBy(dx * delta, dy * delta);
		}
	})
});