var engine = {
	config : {},
	plugins : {},

	// CONTENT PIPELINE

	self : function() {
		var slika = engine.plugins.asset_manager.assets["damir"];

		var fitWindow = function(element) {
			element.width = window.innerWidth;
			element.height = window.innerHeight;
		};

		var render = function(context) {
			context.fillStyle = "darkred";
			context.fillRect(0, 0, canvas.width, canvas.height);
			context.drawImage(slika,	// FIXME 
				canvas.width / 2 - slika.width / 2, 
				canvas.height / 2 - slika.height / 2);
		};

		var canvas = document.getElementById('crtez');
		var context = canvas.getContext("2d");

		window.onresize = function() {
			fitWindow(canvas);
			render(context);
		};

		fitWindow(canvas);
		render(context);
	}
}