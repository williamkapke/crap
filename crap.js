var async = require("async");
var url = require("url");
var path = require("path");
var fs = require("fs");
var root = path.dirname(require.main.filename);

var crap = module.exports = {
  get config() {
    var filename = root + '/crap.config.js';
    return (fs.existsSync(filename) && require(filename)) || {};
  },
  controllers: {
    load: load.bind(this, "controllers")
  },
  providers: {
    load: load.bind(this, "providers")
  },
  resources: {
    load: load.bind(this, "resources")
  },
  resolve: function(type, name) {
    return root + '/' + type + '/' + name;
  },
  loaders: {
    file: function(cfg, root, source) {
      var pathname = path.resolve(root, source.pathname);
      return function(cb) {
        require(pathname)(cfg, cb);
      }
    }
  },
  load: load
};


function load(type, list, crap_cfg, callback) {
  callback = arguments[arguments.length-1];
  if(callback===crap_cfg)
    crap_cfg = crap.config || { root: root };

  var tasks = {};
  var root = crap_cfg.root || root;

  list && list.split(',').forEach(function(name) {
    var cfg = (crap_cfg[type] && crap_cfg[type][name]) || {};

    var source = url.parse(cfg.source || crap.resolve(type, name));
    var loader = crap.loaders[source.protocol || "file"];
    if(!loader)
      throw Error('Unknown protocol: "'+ source.protocol+'"');

    tasks[name] = loader(cfg, root, source);
  });

  async.parallel(tasks, function(err, results) {
    callback(err, results);
  });
}