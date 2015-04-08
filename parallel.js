var debug = require('debug')('crap:parallel');
//a parallel helper that works with callback style OR thenables
module.exports = function parallel(tasks, done) {

  function executor(resolve, reject) {
    var failed = false;
    var results = {};
    var num_complete = 0;
    var keys = Object.keys(tasks);
    debug('runing tasks: %s', keys);
    if(!keys.length) {
      if(resolve) resolve(results);
      if(done) done(null, results);
      return;
    }

    keys.forEach(function (name) {
      var worker = tasks[name];

      function cb(err, result) {
        if(thenable) return;//callback style not allowed if thenable used!
        if (err) fail(err);
        else success.call(name, result);
      }
      var return_value = worker(cb);
      var thenable = return_value && typeof return_value.then === "function";
      if(thenable)
        return_value.then(success.bind(name), fail);
    });

    function success(result){
      var name = this; //cause we did .bind(name) above
      debug('%s complete! %d/%d %s failed=%s', name, num_complete+1, keys.length, keys, failed);
      if(failed) return;
      num_complete++;
      results[name] = result;

      if(num_complete===keys.length) {
        process.nextTick(function () {
          if (resolve) resolve(results);
          if (done) done(null, results);
        })
      }
    }
    function fail(err) {
      debug('one fail! %s', keys);
      if(failed) return;
      failed = true;
      process.nextTick(function(){
        if (reject) reject(err);
        if (done) done(err);
      })
    }
  }

  if(typeof Promise!=='undefined')
    return new Promise(executor);

  executor();
};
