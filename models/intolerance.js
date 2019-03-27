var mongoose = module.require('mongoose');

var IntoleranceSchema = new mongoose.Schema({
    food: {
        type: String,
        index: {
            unique: true
        }
    },
    contamination: {
        type: Boolean
    }
});

var Intolerance = module.exports = mongoose.model('Intolerance', IntoleranceSchema);

module.exports.createIntolerance = (newIntolerance, callback) => {
    newIntolerance.save(callback);
}

module.exports.getIntoleranceById = (id, callback) => {
    Intolerance.findById(id, callback);
}

module.exports.getMany = (names, callback) => {
    Intolerance.find({
        food: {
            $in: names
        }
    }, callback);
}

module.exports.getManyBut = (butIntolerances, callback) => {
    names = [];

    butIntolerances.forEach(intolerance => names.push(intolerance.food));

    Intolerance.find({
        food: {
            $nin: names
        }
    }, callback);
}

module.exports.getAll = (callback) => {
    Intolerance.find({}, callback);
}

module.exports.updateIntoleranceById = (id, updatedIntolerance, callback) => {
    Intolerance.updateOne({_id: id}, {
        food: updatedIntolerance.food,
        contamination: updatedIntolerance.contamination
    }, callback);
}