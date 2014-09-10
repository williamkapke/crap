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
        var builder = require(pathname);
        var ctx = {
          config: crap_cfg,
          type: type,
          name: name
        };
        ctx.load = bind_helpers(ctx);
        if(builder.length===1)
          return builder.call(ctx, cb);

        //auto load; infer dependencies from config
        var tasks = {};
        ["controllers","providers","resources"].forEach(function(type) {
          var cfg = crap_cfg[type];
          var keys = cfg && Object.keys(cfg);
          if(keys && keys.length)
            tasks[type] = load.bind(ctx, type, keys, crap_cfg);
        });
        async.parallel(tasks, function(err, results) {
          if(err) callback(err);
          else builder.call(ctx, results, cb);
        });
      }
    }
  }
};
crap.load = bind_helpers(crap);

function get_loader(protocol) {
  for (var i=1; i<arguments.length; i++) {
    var obj = arguments[i];
    var loader = obj.loaders && obj.loaders[protocol];
    if(loader) return loader;
  }
}

function load(type) {
  var list,crap_cfg,callback = arguments[arguments.length-1];
  var signature = Array.prototype.map.call(arguments, function(arg){ return Array.isArray(arg)? "array" : typeof arg }).join();

  switch(signature) {
    case "string,string,object,function":
    case "string,array,object,function":
      list = array(arguments[1]);
      crap_cfg = arguments[2];
      break;
    case "string,array,function":
    case "string,string,function":
      list = array(arguments[1]);
      break;
    case "string,object,function":
      crap_cfg = arguments[1];
      break;
    case "string,function":
      break;
    default:
      throw new Error("unknown signature: "+ signature);
  }
  if(!crap_cfg) crap_cfg = this.config || { root: project_root };
  if(!list) list = crap_cfg[type]? Object.keys(crap_cfg[type]) : [];

  var tasks = {};
  var root = crap_cfg.root || project_root;

  list.forEach(function(name) {
    var cfg = (crap_cfg[type] && crap_cfg[type][name]) || {};

    var source = url.parse(cfg.source || crap.resolve(type, name));
    var protocol = (source.protocol || "file:").replace(/:$/,'');
    if(!cfg.root) cfg.root = root;

    var loader = get_loader(protocol, cfg, crap.config, crap);
    if(!loader) throw Error('Unknown protocol: "'+ protocol+'"');

    tasks[name] = loader(cfg, type, name, source);
  });

  async.parallel(tasks, callback);
}
function array(list) {
  if(Array.isArray(list))
    return list;

  return list.split(',');
}

function bind_helpers(ctx){
  var l = load.bind(ctx);
  l.controllers = l.bind(ctx, "controllers");
  l.providers = l.bind(ctx, "providers");
  l.resources = l.bind(ctx, "resources");
  return l;
}
