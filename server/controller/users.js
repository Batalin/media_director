var User = require('mongoose').model('User');
var encrypt = require('./encryption');


exports.getUsers = function(req, res) {
    User.find({}).exec(function(err, collection) {
        res.send(collection);
    });
};

exports.createUser = function(req, res, next) {
    var data = req.body;
    data.loginName = data.loginName.toLowerCase();
    data.salt = encrypt.makeSalt();
    data.hash_pwd = encrypt.hashPassword(data.salt, data.password);
    User.create(data, function(err, user) {
        if(err) {
            if(err.toString().indexOf('E11000') > -1) {
                err = new Error('Duplicate Username');
            }
            res.status(400);
            return res.send({reason:err.toString()});
        }
        req.logIn(user, function(err) {
            if(err) {return next(err);}
            res.send(user);
        })
    })
};

exports.updateUser = function(req, res) {
    var data = req.body;
    data.loginName = data.loginName.toLowerCase();
    if (req.user._id != data._id && !req.user.hasRole('admin')) {
        res.status(403);
        return res.end();
    }

    req.user.firstName = data.firstName;
    req.user.lastName = data.lastName;
    req.user.loginName = data.loginName;
    if(data.password && data.password.length > 0) {
        req.user.salt = encrypt.makeSalt();
        req.user.hash_pwd = encrypt.hashPassword(req.user.salt, data.password);
    }
    req.user.save(function(err) {
        if(err) { res.status(400); return res.send({reason:err.toString()});}
        res.send(req.user);
    });
}

