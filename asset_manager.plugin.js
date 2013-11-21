engine.plugins.asset_manager = {
	asset_count : 0,						// broj ucitanih asseta
	assets : {},							// asseti po kljucevima
	init : function(callback) {				// assets = hash
		var _ = engine.plugins.asset_manager;
		var to_load = engine.config.assets;
		_.asset_count = to_load.length;
		for(var index in to_load) {
			var img = new Image();
			var obj = to_load[index]; 	// sam objekat { name : '', path : '' }
			img.onload = function() {
				_.assets[obj.name] = img;
				_.asset_count--;
				if(_.asset_count <= 0) {
					callback();
				}
			}
			img.src = obj.path;
		}
	}
}
