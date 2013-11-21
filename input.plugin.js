engine.plugins.input = {
	onclick : function(event) {
		console.log(event);
	},

	onkeypress : function(event) {
		if(event.keyCode == 97) {
			console.log("AAAA!");
		}
	}
}

window.onclick = engine.plugins.input.onclick;
window.onkeypress = engine.plugins.input.onkeypress;
