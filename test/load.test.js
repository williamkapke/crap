var crap = require("../");
delete crap.config;


crap.controllers.load('account', function(err, controllers) {
  console.log('done..');
  console.log(controllers);
});

