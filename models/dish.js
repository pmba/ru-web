var mongoose = module.require('mongoose');

const IntoleranceSchema = module.require('./intolerance').Schema;

var DishSchema = new mongoose.Schema({
    name: {
        type: String,
        index: {
            unique: true
        }
    },
    type: {
        type: String
    },
    intolerances: {
        type: [String]
    },
    rating: {
        type: Number,
        default: 7
    },
    ratingCounter: {
        type: Number,
        default: 1
    }
});

var Dish = module.exports = mongoose.model('Dish', DishSchema);

module.exports.getDishById = (id, callback) => {
    Dish.findById(id, callback);
}

module.exports.getByType = (type, callback) => {
    Dish.find({
        type: type
    }, callback);
}

module.exports.getManyPromisses = (dishNames) => {
    return Dish.find({name: { $in: dishNames }}).exec();
}

module.exports.getAllPromisses = () => {
    return Dish.find({}).exec();
}

module.exports.getMany = (dishNames, callback) => {
    Dish.find({
        name: {
            $in: dishNames
        }
    }, callback);
}

module.exports.getAll = (callback) => {
    Dish.find({}, callback);
}

module.exports.createDish = (newDish, callback) => {
    newDish.save(callback);
}

module.exports.deleteDishById = (id, callback) => {
    Dish.deleteOne({
        _id: id
    }, callback);
}

module.exports.updateDishById = (id, modifiedDish, callback) => {
    Dish.updateOne({
        _id: id
    }, {
        name: modifiedDish.name,
        intolerances: modifiedDish.intolerances,
        type: modifiedDish.type
    }, callback);
}

//Calcular a nova média com a quantidade de avaliações existentes e a nova nota
module.exports.addRating = (dish, rating, callback) => {
    calculateRating(dish, rating, (newNumber) => {
        Dish.updateOne({ _id: dish._id }, {
            rating: newNumber
        }, callback);
    })
}

function calculateRating(dish, rating, callback) {
  var newNumber = ((dish.rating * dish.ratingCounter) + rating) / (dish.ratingCounter + 1);
  callback(newNumber);
}

//Adicionar um contador de avaliação
module.exports.addRatingCounter = (dish, callback) => {
    Dish.updateOne({ _id: dish._id }, {
        $inc: { ratingCounter: 1 }
    }, callback);
}
