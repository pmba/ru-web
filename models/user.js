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
    intolerances: {
        type: [IntoleranceSchema]
    }
});

module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            console.log(newUser.username, newUser.password, newUser.name, hash);
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}
