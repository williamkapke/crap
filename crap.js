var async = require("async");
var url = require("url");
var path = require("path");
var fs = require("fs");
var project_root = path.dirname(require.main.filename);

var crap = module.exports = {
  get config() {
    var filename = project_root + '/crap.config.js';
    return (fs.existsSync(filename) && require(filename)) || {};
  },
  resolve: function(type, name) {
    return project_root + '/' + type + '/' + name;
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
    crap_cfg = crap.config || { root: project_root };

  var tasks = {};
  var root = crap_cfg.root || project_root;

  list && list.split(',').forEach(function(name) {
    var cfg = (crap_cfg[type] && crap_cfg[type][name]) || {};

    var source = url.parse(cfg.source || crap.resolve(type, name));
    var protocol = source.protocol || "file";
    var loaders = crap_cfg.loaders || crap.loaders;
    var loader = loaders[protocol.replace(/:$/,'')];
    if(!loader)
      throw Error('Unknown protocol: "'+ source.protocol+'"');

    tasks[name] = loader(cfg, root, source);
  });

  async.parallel(tasks, function(err, results) {
    callback(err, results);
  });
}

load.controllers = load.bind(this, "controllers");
load.providers = load.bind(this, "providers");
load.resources = load.bind(this, "resources");
