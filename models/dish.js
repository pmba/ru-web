var mongoose = module.require('mongoose');

const IntoleranceSchema = module.require('./intolerance').Schema;

var DishSchema = new mongoose.Schema({
    name: {
        type: String
    },
    intolerances: {
        type: [IntoleranceSchema]
    }
});

module.exports = mongoose.model('Dish', DishSchema);
