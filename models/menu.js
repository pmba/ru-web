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
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Dish'
        },
        vegetarian: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Dish'
        },
        sideDish: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Dish'
        },
        dessert: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Dish'
        },
        drinks: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Dish'
        }
    },
    dinner: {
        meat: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Dish'
        },
        vegetarian: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Dish'
        },
        sideDish: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Dish'
        },
        dessert: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Dish'
        },
        drinks: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Dish'
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

module.exports.getAll = (callback) => {
    Menu.find({}, callback);
}

module.exports.getMenuByWeek = (week, callback) => {
    Menu.findOne({'date.week': week},callback);
}

module.exports.deleteMenuById = (id, callback) => {
    Menu.deleteOne({
        _id: id
    }, callback);
}
