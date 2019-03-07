var mongoose = module.require('mongoose');

var IntoleranceSchema = new mongoose.Schema({
    food: {
        type: String
    },
    contamination: {
        type: Boolean
    }
});

module.exports = mongoose.model('Intolerance', IntoleranceSchema);
