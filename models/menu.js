var mongoose = module.require('mongoose');

var dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

var DailyMenuSchema = new mongoose.Schema({
    date: {
        name: {
            type: String,
            default: dayNames[new Date().getDay()]
        },
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
    lunch: {
        meat: {
            type: [Object]
        },
        vegetarian: {
            type: [Object]
        },
        sideDish: {
            type: [Object]
        },
        dessert: {
            type: [Object]
        },
        drinks: {
            type: [Object]
        }
    },
    dinner: {
        meat: {
            type: [Object]
        },
        vegetarian: {
            type: [Object]
        },
        sideDish: {
            type: [Object]
        },
        dessert: {
            type: [Object]
        },
        drinks: {
            type: [Object]
        }
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
            default: new Date().getWeek(),
            index: {
                unique: true
            }
        }
    },
    days: {
        type: [Object]
    }
});

var Menu = module.exports.MenuSchema = mongoose.model('Menu', MenuSchema);
var DailyMenuSchema = module.exports.DailyMenuSchema = mongoose.model('DailyMenu', DailyMenuSchema);

module.exports.createMenu = (newMenu, callback) => {
    newMenu.save(callback);
}