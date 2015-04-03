
//a parallel helper that works with callback style OR thenables
module.exports = function parallel(tasks, done) {

  function executor(resolve, reject) {
    var failed = false;
    var results = {};
    var num_complete = 0;
    var keys = Object.keys(tasks);
    if(!keys.length) {
      if(resolve) resolve(results);
      if(done) done(null, results);
      return;
    }

    keys.forEach(function (name) {
      var worker = tasks[name];
      var return_value = worker(callback.bind(name));
      if(return_value && typeof return_value.then === "function")
        return_value.then(success.bind(name), fail);
    });

    function callback(err, result) {
      if(err) fail(err);
      else success.call(this, result);
    }
    function success(result){
      if(failed) return;
      num_complete++;
      var name = this; //cause we did .bind(name) above
      results[name] = result;

      if(num_complete===keys.length)
        process.nextTick(function(){
          if (resolve) resolve(results);
          if (done) done(null, results);
        })
    }
    function fail(err) {
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
