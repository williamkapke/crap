var parallel = require('../parallel.js');
var should = require('should');


function task(ms) {
  return function (done) {
    //negative causes failure
    if(ms<0)
      setTimeout(function () { done("boooo"); }, Math.abs(ms));
    else
      setTimeout(done, ms);
  }
}
function tasks() {
  var tasks = {};
  for (var i = 0; i < arguments.length; i++)
    tasks["t"+i] = task(arguments[i]);
  return tasks;
}

function thenable(ms) {
  return function (done) {
    return {
      then: function (resolve, reject) {
        //negative causes failure
        if(ms<0)
          setTimeout(function () { reject("boooo"); }, Math.abs(ms));
        else
          setTimeout(resolve, ms);
      }
    }
  }
}
function thenables() {
  var tasks = {};
  for (var i = 0; i < arguments.length; i++)
    tasks["t"+i] = thenable(arguments[i]);
  return tasks;
}

describe("parallel tests", function () {

  it("should allow callback style (success)", function (done) {
    parallel(tasks(10,500,20,50), function (err, results) {
      (!err).should.be.true;
      results.should.eql({ t0: undefined, t2: undefined, t3: undefined, t1: undefined });
      done();
    });
  });
  it("should allow callback style (failure)", function (done) {
    parallel(tasks(10,500,-20,50), function (err, results) {
      should(err).not.be.null;
      (!results).should.be.true;
      done();
    });
  });
  it("should allow thenable style (success)", function (done) {
    parallel(thenables(10,500,20,50), function (err, results) {
      (!err).should.be.true;
      results.should.eql({ t0: undefined, t2: undefined, t3: undefined, t1: undefined });
      done();
    });
  });
  it("should allow thenable style (failure)", function (done) {
    parallel(thenables(10,500,-20,50), function (err, results) {
      should(err).not.be.null;
      (!results).should.be.true;
      done();
    });
  });
});
