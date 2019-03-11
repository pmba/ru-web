var mongoose = module.require('mongoose');
var bcrypt = module.require('bcryptjs');

const IntoleranceSchema = module.require('./intolerance').Schema;

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password: {
        type: String
    },
    name: {
        type: String
    },
    registration: {
        type: String
    },
    course: {
        type: String
    },
    intolerances: {
        type: [IntoleranceSchema]
    }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash;
            newUser.save(callback);
            console.log(`Usuario cadastrado: ${newUser.username}, ${newUser.name}`);
        });
    });
}

module.exports.getUserByUsername = (username, callback) => {
    var query = {
        username: username
    };
    User.findOne(query, callback);
}

module.exports.getUserById = (id, callback) => {
    User.findById(id, callback);
}

module.exports.comparePassword = (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) return err;
        callback(null, isMatch);
    });
}
