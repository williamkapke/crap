
module.exports = function auto(dependencies, callback){
  console.log("session resource initializing...");
  callback(null, dependencies);
};

