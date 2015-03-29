
//a parallel helper that works with callback style OR thenables
module.exports = function parallel(tasks, done) {
  var failed = false;
  var results = {};
  var num_complete = 0;
  var keys = Object.keys(tasks);
  if(!keys.length) return done(null, results);

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
    num_complete++;
    var name = this; //cause we did .bind(name) above
    results[name] = result;

    if(num_complete===keys.length)
      done(null, results);
  }
  function fail(err) {
    if(failed) return;
    failed = true;
    done(err);
  }
};