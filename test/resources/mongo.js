
module.exports = function(dependencies, callback){
  console.log("mongo resource initializing...");
  callback(null, dependencies);
};

module.exports.collection = function(dependencies, name, callback) {
  console.log("mongo collection('"+name+"') initializing...");
  callback(null, dependencies);
};