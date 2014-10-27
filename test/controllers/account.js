

module.exports = function auto(dependencies, callback){
  console.log("account controller initializing...");
  callback(null, dependencies);
};

//or ...

//module.exports = function(callback){
//  console.log("account controller initializing...");
//  this.load.providers(function(err, providers) {
//    callback(null, providers);
//  });
//};
