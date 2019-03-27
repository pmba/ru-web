var mongoose = module.require('mongoose');

const DishSchema = module.require('./dish').Schema;

var dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

var DailyMenuSchema = new mongoose.Schema({
    lunch: {
        meat: {
            type: [DishSchema],
            default: null
        },
        vegetarian: {
            type: [DishSchema],
            default: null
        },
        sideDish: {
            type: [DishSchema],
            default: null
        },
        dessert: {
            type: [DishSchema],
            default: null
        },
        drinks: {
            type: [DishSchema],
            default: null
        }
    },
    dinner: {
        meat: {
            type: [DishSchema],
            default: null
        },
        vegetarian: {
            type: [DishSchema],
            default: null
        },
        sideDish: {
            type: [DishSchema],
            default: null
        },
        dessert: {
            type: [DishSchema],
            default: null
        },
        drinks: {
            type: [DishSchema],
            default: null
        }
    }
});

var DaySchema = new mongoose.Schema({
    date: {
        day: {
            type: Number,
            default: new Date().getDate()
        },
        month: {
            type: Number,
            default: new Date().getMonth() + 1
        },
        year: {
            type: Number,
            default: new Date().getFullYear()
        }
    },
    name: {
        type: String,
        default: dayNames[new Date().getDay()]
    },
    menu: {
        type: DailyMenuSchema
    }
});

var MenuSchema = new mongoose.Schema({
    date: {
        day: {
            type: Number,
            default: new Date().getDate()
        },
        month: {
            type: Number,
            default: new Date().getMonth() + 1
        },
        year: {
            type: Number,
            default: new Date().getFullYear()
        },
        week: {
            type: Number,
            default: new Date().getWeek()
        }
    },
    days: {
        type: [DaySchema]
    }
});

var Menu = module.exports = mongoose.model('Menu', MenuSchema);
var DailyMenuSchema = module.exports = mongoose.model('DailyMenu', DailyMenuSchema);

module.exports.createMenu = (newMenu, callback) => {
    newMenu.save(callback);
}