var resources = require('../resources.js');

module.exports = function auto(dependencies, callback){
  console.log("account provider initializing...");
  callback(null, dependencies);
};

module.exports.deps = function() {
  return {
    resources: {
      users: resources.users,
      facebook: resources.facebook
    }
  }
}
