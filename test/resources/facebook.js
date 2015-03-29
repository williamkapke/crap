
module.exports = function auto(dependencies, callback){
//  var settings = this.config.settings;
//  console.log(settings)
  console.log("facebook resource initializing...");

  //return a thenable (aka Promise)
  return {
    then: function(resolve, reject) {
      resolve("facebook!!")
    }
  };
  //return Promise.resolve("facebook!");
  //return Promise.reject("facebook!");
};

