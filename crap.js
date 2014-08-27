var async = require("async");
var url = require("url");
var path = require("path");


module.exports = {
  controllers: {
//    directory: './controllers',
//    pattern: /^(.+)Controller/,
    load: load.bind(this, "controllers")
  },
  providers: {
    load: load.bind(this, "providers")
  },
  resources: {
    load: load.bind(this, "resources")
  }
};


function load(type, list, crap_cfg, callback) {
  var tasks = {};
  var root = crap_cfg.root || path.dirname(require.main.filename);

  list && list.split(',').forEach(function(name) {
    console.log('›››', name, type);
    if(!crap_cfg[type]) throw new Error('config member missing: crap_cfg["'+type+'"]' );
    var cfg = crap_cfg[type][name];
    if(!cfg) throw new Error('config member missing: crap_cfg["'+type+'"]["'+name+'"]' );
    var source = url.parse(cfg.source);
    if(!source.protocol || source.protocol==="file"){
      tasks[name] = function(cb) {
        var initializer = require(path.resolve(root, source.pathname));
        initializer(cfg, cb);
      };
      return;
    }
    throw Error('Unknown protocol: "'+ source.protocol+'"');
  });

  async.parallel(tasks, function(err, results) {
    callback(err, results);
  });
}