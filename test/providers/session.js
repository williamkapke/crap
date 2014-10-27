
module.exports = function auto(dependencies, callback){
  console.log("session provider initializing...");
  callback(null, dependencies);
};

