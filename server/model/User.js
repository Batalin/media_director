var mongoose = require('mongoose'),
    encrypt = require('../controller/encryption');



var userSchema = mongoose.Schema({
    firstName: {type: String, required: '{PATH} is reqired!'},
    lastName: {type: String, required: '{PATH} is reqired!'},
    loginName: {
        type: String,
        required: '{PATH} is reqired!',
        unique: true},
    salt: String,
    hash_pwd: String,
    roles: [String]
});

userSchema.methods = {
    authenticate: function(password) {
        return encrypt.hashPassword(this.salt, password) === this.hash_pwd;
    },
    hasRole: function(role) {
        return this.roles.indexOf(role) > -1;
    }
}

var User = mongoose.model('User', userSchema);


function createUsers() {
    User.find({}).exec(function (err, collection) {
        if (collection.length === 0) {
            var salt, hash;
            salt = encrypt.makeSalt();
            hash = encrypt.hashPassword(salt, '123');
            User.create({
                firstName: 'Oleg',
                lastName: 'Batalin',
                loginName: 'olegba',
                salt: salt,
                hash_pwd: hash,
                roles: ['admin']
            });
            User.create({
                firstName: 'Test',
                lastName: 'User',
                loginName: 'test',
                salt: salt,
                hash_pwd: hash,
                roles: ['user']
            });
        }
    });
}

exports.createDefaultUsers = createUsers;


