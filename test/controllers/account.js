

module.exports = function auto(dependencies, callback){
  console.log("account controller initializing...");
  callback(null, dependencies);
};

module.exports.deps = function() {
  return {
    providers: {
      account: require('../providers/account.js').deps({get:1})
    }
  }
}

//or ...

//module.exports = function(callback){
//  console.log("account controller initializing...");
//  this.load.providers(function(err, providers) {
//    callback(null, providers);
//  });
//};
