(function() {
  var async, del, express, get, info, parallel, param, params, post, put, sequence, sync, _,
    __slice = Array.prototype.slice;

  express = require('express');

  async = require('async');

  _ = require('underscore');

  get = function() {
    var app, handlers, path;
    app = arguments[0], path = arguments[1], handlers = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
    return app.get(path, function(req, res) {
      var i, s;
      i = info(req, res);
      s = sequence(handlers);
      return s.call(i, function(err, data) {
        if (err != null) return res.send(err, 400);
        return res.send(data, 200);
      });
    });
  };

  post = function() {
    var app, handlers, route;
    app = arguments[0], route = arguments[1], handlers = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
  };

  put = function() {
    var app, handlers, route;
    app = arguments[0], route = arguments[1], handlers = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
  };

  del = function() {
    var app, handlers, route;
    app = arguments[0], route = arguments[1], handlers = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
  };

  info = function(req, res) {
    return {
      req: req,
      res: res
    };
  };

  param = function(name) {
    return function(cb) {
      this[name] = this.req.param(name);
      return cb(null, this[name]);
    };
  };

  params = function() {
    var names;
    names = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return parallel.apply(null, names.map(function(n) {
      return param(n);
    }));
  };

  sequence = function(handlers) {
    return function() {
      var args, cb, i, next, ref, _i;
      args = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), cb = arguments[_i++];
      ref = this;
      i = 0;
      next = function() {
        var args, current, err;
        err = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        if (err != null) return cb(err);
        current = handlers[i++];
        if (!(current != null)) {
          return cb.apply(null, [null].concat(__slice.call(args)));
        }
        args.push(next);
        return current.apply(ref, args);
      };
      return next.apply(null, [null].concat(__slice.call(args)));
    };
  };

  parallel = function() {
    var fs;
    fs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return function() {
      var args, cb, m, ref, _i;
      args = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), cb = arguments[_i++];
      ref = this;
      m = function(f, done) {
        var allArgs;
        allArgs = args.concat(done);
        return f.apply(ref, allArgs);
      };
      return async.map(fs, m, function(err, allArgs) {
        var flatArgs;
        if (err != null) return cb(err);
        flatArgs = _.flatten(allArgs);
        return cb.apply(null, [err].concat(__slice.call(flatArgs)));
      });
    };
  };

  sync = function(f) {
    return function() {
      var args, cb, _i;
      args = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), cb = arguments[_i++];
      return cb(null, f.apply(null, args));
    };
  };

  exports.get = get;

  exports.post = post;

  exports.put = put;

  exports.del = del;

  exports.param = param;

  exports.params = params;

  exports.args = parallel;

  exports.sync = sync;

  exports.seq = sequence;

  exports.par = parallel;

}).call(this);
