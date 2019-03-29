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
        default: 0
    },
    ratingCounter: {
        type: Number,
        default: 0
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
module.exports.addRating = (dishID, rating, callback) => {
    calculateRating(dishID, rating, (newNumber) => {
        Dish.updateOne({ _id: dishID }, {
            rating: newNumber
        }, callback);
    })
}

//Pega a nota atual contida em DB.dishs, e não do objeto dish passado no argumento
function calculateRating(dishID, rating, callback) {
    Dish.findById(dishID, (err, dbDish) => {
        if (err) throw err;

        var newNumber = ((dbDish.rating * dbDish.ratingCounter) + rating) / (dbDish.ratingCounter + 1);
        callback(newNumber);
    });
}

//Adicionar um contador de avaliação
module.exports.addRatingCounter = (dishID, callback) => {
    Dish.updateOne({ _id: dishID }, {
        $inc: { ratingCounter: 1 }
    }, callback);
}
