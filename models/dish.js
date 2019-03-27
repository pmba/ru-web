var mongoose = module.require('mongoose');

const IntoleranceSchema = module.require('./intolerance').Schema;

var DishSchema = new mongoose.Schema({
    name: {
        type: String,
        index: {
            unique: true
        }
    },
    intolerances: {
        type: [String]
    }
});

var Dish = module.exports = mongoose.model('Dish', DishSchema);

module.exports.getDishById = (id, callback) => {
    Dish.findById(id, callback);
}

module.exports.getAll = (callback) => {
    Dish.find({}, callback);
}

module.exports.createDish = (newDish, callback) => {
    newDish.save(callback);
}

module.exports.deleteDishById = (id, callback) => {
    Dish.deleteOne({_id: id}, callback);
}

module.exports.updateDishById = (id, modifiedDish, callback) => {
    Dish.updateOne({_id: id}, {
        name: modifiedDish.name,
        intolerances: modifiedDish.intolerances
    }, callback);
}
