(function(){
  function load(script) {
    document.write('<'+'script src="'+script+'" type="text/javascript"><' + '/script>');
  }

  load("engine.js");
  load("asset_manager.js");
  load("input.js");
  load("scene.js");
  load("loading.js");
  load("main.js");
})();
