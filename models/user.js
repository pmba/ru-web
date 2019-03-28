var mongoose = module.require('mongoose');
var bcrypt   = module.require('bcryptjs');

const IntoleranceSchema = module.require('./intolerance').Schema;

var UserSchema = new mongoose.Schema({
    username: {
        type : String,
        index: {
            unique: true
        }
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
    },
    wallet: {
        type   : Number,
        default: 0
    },
    role: {
        type   : Number,
        default: 0
    }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.getAll = (options, callback) => {
    User.find({}, options, callback);
}

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

module.exports.updateIntolerances = (userID, intolerances, callback) => {
    User.updateOne({_id: userID}, {
        intolerances: intolerances
    }, callback);
}

module.exports.updateWallet = (userID, amount, callback) => {
    User.updateOne({_id: userID}, {
        $inc: { wallet: amount }
    }, callback);
}

module.exports.comparePassword = (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) return err;
        callback(null, isMatch);
    });
}
