
module.exports = function auto(dependencies, callback){
  console.log("auth middleware initializing...");
  callback(null, dependencies);
};

module.exports.deps = function() {
  return {
    source: __filename,
    controllers: {
      session: require('../controllers/session.js').deps()
    }
  }
}
