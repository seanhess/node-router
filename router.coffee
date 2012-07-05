# Attempt at remkaing that router I made for apiweb. 
# The goal: that the router is the controller layer. 
# You'll need a "helper" layer to do some conversions, etc. Don't put controller logic in your models. 

express = require('express')
async = require('async')
_ = require('underscore')

get = (app, path, handlers...) ->
    app.get path, (req, res) ->
        i = info req, res
        s = sequence handlers
        s.call i, (err, data) ->
            if err? then return res.send err, 400
            res.send data, 200

post = (app, route, handlers...) ->
put = (app, route, handlers...) ->
del = (app, route, handlers...) ->

# the "this" context for these functions
info = (req, res) -> {req, res}

# pull a param out of the request
param = (name) -> (cb) -> 
    this[name] = @req.param name
    cb null, this[name]

# pulls several params out of the request
params = (names...) -> 
    parallel.apply null, names.map (n) -> param n





# These functions could go in another library

# create a sequence from an array of handlers
# returns a function that calls the sequence
sequence = (handlers) ->
    (args..., cb) -> 
        ref = this
        i = 0
        next = (err, args...) ->
            if err? then return cb err
            current = handlers[i++]
            if not current? then return cb null, args...
            args.push(next)
            current.apply ref, args
        next null, args...

# Args calls all handlers with the SAME arguments, then calls back 
# with each argument in order. call them in parallel. 
parallel = (fs...) ->
    (args..., cb) -> # this will be called with the correct this pointer
        ref = this

        m = (f, done) -> 
            allArgs = args.concat done 
            f.apply ref, allArgs

        async.map fs, m, (err, allArgs) ->
            if err? then return cb err
            flatArgs = _.flatten allArgs
            cb err, flatArgs...

# turns a sync function into an async one
sync = (f) -> (args..., cb) -> cb null, f args...

exports.get = get
exports.post = post
exports.put = put
exports.del = del

exports.param = param
exports.params = params
exports.args = parallel
exports.sync = sync

exports.seq = sequence
exports.par = parallel
