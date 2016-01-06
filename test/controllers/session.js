

module.exports = function auto(dependencies, callback){
  console.log("session controller initializing...");
  callback(null, dependencies);
};

module.exports.deps = function() {
  return {
    source: __filename,
    providers: {
      session: require('../providers/session.js').deps()
    }
  }
}
