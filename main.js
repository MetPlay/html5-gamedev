
window.onload = function() {
	engine.config = {
		debug : true,
		assets : [
			{ name : "damir", path : "damir.png" }
		]
	}

	engine.plugins.asset_manager.init(function() {
		engine.self();
	});
}