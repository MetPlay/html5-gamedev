
window.onload = function() {
	engine.config = {
		debug : true,
		assets : [
			{ name : "damir", path : "damir.png" }
		]
	}

	engine.plugins.asset_manager.init(function() {
		engine.self(function() {
			for(var i = 0; i < 100; i++) {
				var d1 = engine.plugins.scene.stage.addChild(
					engine.plugins.scene.createTransform("damir"));

				d1.position.x = Math.random() * 600;
				d1.position.y = Math.random() * 500;
			}
		});
	});
}