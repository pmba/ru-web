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

module.exports.getAll = (callback) => {
    Menu.find({}, callback);
}

module.exports.findDishesByTime = (dateValidated, callback) => {
    Menu.findOne({'date.week': dateValidated.getWeek()}, (err, menu) => {
        if (err) throw err;

        createDishesIDArray(dateValidated, menu, (dishesID) => {

            callback(dishesID);
        });
    });
}

function createDishesIDArray(dateValidated, menu, callback) {
    let dishesID = [];
    const weekDay = dateValidated.getDay();


    //TODO: usar Promises?
    if(dateValidated.getHours() < 16 - 3) {// TIMEZONE = +3
        // Almoço
        menu.days[weekDay].lunch.meat.forEach((dish) => dishesID.push(dish._id));
        menu.days[weekDay].lunch.vegetarian.forEach((dish) => dishesID.push(dish._id));
        menu.days[weekDay].lunch.sideDish.forEach((dish) => dishesID.push(dish._id));
        menu.days[weekDay].lunch.dessert.forEach((dish) => dishesID.push(dish._id));
        menu.days[weekDay].lunch.drinks.forEach((dish) => dishesID.push(dish._id));

    } else {
        // Janta
        menu.days[weekDay].dinner.meat.forEach((dish) => dishesID.push(dish._id));
        menu.days[weekDay].dinner.vegetarian.forEach((dish) => dishesID.push(dish._id));
        menu.days[weekDay].dinner.sideDish.forEach((dish) => dishesID.push(dish._id));
        menu.days[weekDay].dinner.dessert.forEach((dish) => dishesID.push(dish._id));
        menu.days[weekDay].dinner.drinks.forEach((dish) => dishesID.push(dish._id));
    }

    callback(dishesID);
}
