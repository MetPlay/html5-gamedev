engine.plugins.asset_manager = {
	asset_count : 0,						// broj ucitanih asseta
	assets : {},							// asseti po kljucevima
	init : function(callback) {	// assets = hash
		var _ = engine.plugins.asset_manager;
		var to_load = engine.config.assets;
		_.asset_count = to_load.length;
		console.log("Imamo " + _.asset_count + " slika da ucitamo.");
		for(var index in to_load) {
			var img = new Image();
			var obj = to_load[index]; 	// sam objekat { name : '', path : '' }
			img.onload = function() {
				_.assets[obj.name] = img;
				_.asset_count--;
				console.log("Slika " + obj.name + " se ucitala. Preostalo je " + _.asset_count + " da se ucita.");
				if(_.asset_count <= 0) {
					callback();
				}
			}
			img.src = obj.path;
		}
	}
}
