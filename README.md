# CRaP
A tiny framework for loading Ⓒontrollers Ⓡesources Ⓐnd ⓟroviders.

### Installation
```bash
$ npm install crap
```

### What is CRaP?
CRaP is a tiny framework that helps you write layered apps by assisting with dependency loading and injection.

### Why do we need this CRaP?
All but the most trivial apps can benefit a lot from dependency injection and proper layering. Layering helps with separation of concerns and heavy code reuse from the lower layers. Dependency injection helps make your application more testable and flexible. CRaP is here to make you think about layering as you write your apps as well as do the tedious job of loading and injecting dependencies.

### How?
CRaP does everything based on config, more on that later. To create the most basic CRaP module, just export a function that takes a callback. 
```javascript
    module.exports = function(cb) {
        var self = {
	        foo: function() {
		        self.log('foo');
	        },
	        log: function(str) {
		        console.log(new Date().toISOString(), str);
	        }
        };
        cb(null, self);
    };
```
CRaP loads your module by calling the exported function and waiting for you to call the callback with your component.

If your module has dependencies, you have options. First, you could load them by hand.
```javascript
    // simple authorization middleware
    var crap = require('crap');
    module.exports = function(cb) {
		crap.load.resources('session', function(err, resources) {
			if (err) return cb(err);
			cb(null, auth);
			function auth(req, res, next) {
				var token = req.header('x-auth-token');
				if (!token) return res.send(401);
				resources.session.findOne(token, function(err, session) {
					if (err) return res.send(500);
					if (!session) return res.send(401);
					req.token = token;
					req.session = session;
					next();
				});
			}
		});
    };
```
This works but its not as clean as it could be. Instead, it would be nice if you didn't have to write all of the plumbing to load your dependencies. If we name our export function 'auto',  CRaP will look at the config, load the your module's dependencies and pass them in with the callback to your export function.
```javascript
    // simple authorization middleware
    module.exports = function auto(dependencies, cb) {
		if (err) return cb(err);
		var resources = dependencies.resources;
		cb(null, auth);
		function auth(req, res, next) {
			var token = req.header('x-auth-token');
			if (!token) return res.send(401);
			resources.session.findOne(token, function(err, session) {
				if (err) return res.send(500);
				if (!session) return res.send(401);
				req.token = token;
				req.session = session;
				next();
			});
		}
    };
```
That's better, but in order for CRaP to know what dependencies your module needs you have to define a config. CRaP looks in `crap.root` which by default is set to `process.cwd()` for a file called `crap.config.js` to use as its config. It stores the config in `crap.config`.  The config file for the above auth middleware might look something like this
```javascript
	var cfg = module.exports = {
		middleware: {
			auth: {
				resources: {
			        get session() { return cfg.resources.session; }
				}
			}
		},
		resources: {
			session: {
				source: "./resources/redis.js?hash",
				settings: {
					host: '127.0.0.1'
					port: 6379
				}
			}
		}
	};
```

### API

**crap.root**
___
Default: `process.cwd()`
The directory which every module will be relatively loaded from.
Can be overridden by setting a `root` property in your config or by setting `crap.root` directly

**crap.config**
___
Default: The export from `crap.config.js` if it exists, otherwise `{}` 

**crap.load(type:string, callback:function)**
___
Load all modules of the given type that are found in `crap.config`

**crap.load(type:string, config:object, callback:function)**
___
Load all modules of the given type that are found in the given config

**crap.load(type:string, modules:array|string, callback:function)**
___
Load the given modules of the given type found in `crap.config`
If modules is a string, `modules = modules.split(',')`

**crap.load(type:string, modules:array|string, config:object, callback:function)**
___
Load the given modules of the given type found in the given config
If modules is a string, `modules = modules.split(',')`

### Helper functions

**crap.load.controllers()**
**crap.load.providers()**
**crap.load.resources()**
___
Same as the load functions with the respective type.

License
===

The MIT License (MIT) Copyright (c) 2015 William Kapke & Tinder INC.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.