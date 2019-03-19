var mongoose = module.require('mongoose');
var bcrypt = module.require('bcryptjs');

var AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        index: {
            unique: true
        }
    },
    password: {
        type: String
    },
    role: {
        type: Number
    }
});

var Admin = module.exports = mongoose.model('Admin', AdminSchema);

module.exports.createUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.getUserByUsername = (username, callback) => {
    var query = {
        username: username
    };
    Admin.findOne(query, callback);
}

module.exports.getUserById = (id, callback) => {
    Admin.findById(id, callback);
}

module.exports.comparePassword = (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) return err;
        callback(null, isMatch);
    });
}
