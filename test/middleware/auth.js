
module.exports = function auto(dependencies, callback){
  console.log("auth middleware initializing...");
  callback(null, dependencies);
};
