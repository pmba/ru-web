var mongoose = module.require('mongoose');

const DishSchema = module.require('./dish').Schema;

var TicketSchema = new mongoose.Schema({
    user_info: {
        name: String,
        id: String,
        registration: String
    },
    value: {
        type: Number
    },
    date: {
        type: Date,
        default: Date.now
    },
    validation: {
        status: {
            type: Boolean,
            default: false
        },
        date: {
            type: Date,
            default: null
        }
    },
    rating: {
        status: {
            type: Boolean,
            default: false
        },
        comment: {
            type: String,
            default: null
        }
    }
});

var Ticket = module.exports = mongoose.model('Ticket', TicketSchema);

module.exports.createTicket = (newTicket, callback) => {
    newTicket.save(callback);
}

module.exports.getById = (ticketID, callback) => {
    Ticket.findById(ticketID, callback);
}

//Validar quando o usuário usar o ticket
module.exports.validateTicket = (ticketID, callback) => {
    Ticket.updateOne( { _id: ticketID }, {
        'validation.status': true,
        'validation.date': Date.now()
    }, callback);
}

//Validar quando o usuário avaliar os pratos do ticket
module.exports.validationRating = (ticketID, comment, callback) => {
    Ticket.updateOne({
        _id: ticketID
    }, {
        'rating.status': true,
        'rating.comment': comment
    }, callback);
}

module.exports.getByUserID = (userID, callback) => {
    Ticket.find({
        'user_info.id': userID
    }, callback);
}