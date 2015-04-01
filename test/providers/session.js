
module.exports = function auto(dependencies, callback){
  console.log("session provider initializing...");
  //return a thenable (in the future this would be a legit Promise)
  return {
    then: function(resolve, reject) {
      resolve(dependencies)
      //reject("booo!")
    }
  };
};

