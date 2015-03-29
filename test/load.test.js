var crap = require("../");
var config = require("./crap.verbose.config.js");

crap.load.apps(config, function(err, controllers) {
  console.log('done..');
  console.log(
    err || JSON.stringify(controllers, null, 2)
  );
});

