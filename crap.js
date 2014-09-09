var async = require("async");
var url = require("url");
var path = require("path");
var fs = require("fs");
var project_root = path.dirname(require.main.filename);

var crap = module.exports = {
  get config() {
    return crap.open(project_root + '/crap.config.js');
  },
  open: function(filename) {
    filename = path.resolve(project_root, filename);
    var exists = fs.existsSync(filename);
    return (exists && require(filename)) || {};
  },
  resolve: function(type, name) {
    return project_root + '/' + type + '/' + name;
  },
  loaders: {
    file: function(crap_cfg, type, name, source) {
      var pathname = path.resolve(crap_cfg.root, source.pathname);
      return function(cb) {
        require(pathname)(crap_cfg, type, name, cb);
      }
    }
  },
  load: load
};


function load(type, list, crap_cfg, callback) {
  callback = arguments[arguments.length-1];
  if(!crap_cfg || callback===crap_cfg)
    crap_cfg = crap.config || { root: project_root };

  var tasks = {};
  var root = crap_cfg.root || project_root;

  list && array(list).forEach(function(name) {
    var cfg = (crap_cfg[type] && crap_cfg[type][name]) || {};

    var source = url.parse(cfg.source || crap.resolve(type, name));
    var protocol = (source.protocol || "file:").replace(/:$/,'');
    if(!cfg.root) cfg.root = root;

    var loader = (cfg.loaders && cfg.loaders[protocol]) || (crap.loaders && crap.loaders[protocol]);

    if(!loader)
      throw Error('Unknown protocol: "'+ protocol+'"');

    tasks[name] = loader(cfg, type, name, source);
  });

  async.parallel(tasks, function(err, results) {
    callback(err, results);
  });
}
function array(list) {
  if(Array.isArray(list))
    return list;

  return list.split(',');
}

load.controllers = load.bind(this, "controllers");
load.providers = load.bind(this, "providers");
load.resources = load.bind(this, "resources");
