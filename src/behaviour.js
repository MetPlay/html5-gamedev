
  engine.behaviour = {};
  
  engine.defineBehaviour = function(nt, fn) {
    var nntt = nt.split(":");
    type = nntt[0];
    name = nntt[1];
    engine.behaviour[name] = { type: type, fn: fn };
  }