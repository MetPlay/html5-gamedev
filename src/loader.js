
Array.prototype.load = function(prefix) {
  if(!prefix) prefix="";
  this.forEach(function(script) {
    document.write('<'+'script src="'+prefix+script+'" type="text/javascript"><' + '/script>');
  });  
}