var mongoose = module.require('mongoose');

const DishSchema = module.require('./dish').Schema;

var TicketSchema = new mongoose.Schema({
    user_info: {
        name        : String,
        id          : String,
        registration: String
    },
    value: {
        type: Number
    },
    date: {
        type   : Date,
        default: Date.now
    },
    validatedStatus: {
        type: Boolean,
        default: false
    },
    validateDate: {
        type : Date,
        default: null
    },
    validatedDishs: {
        type: [DishSchema],
        default: []
    },
    validateRating: {
        type: Boolean,
        default: false
    },
    ratingComment: {
        type: String,
        default: null
    }
    //TODO: separar os objetos em :  (nao consegui usar eles dessa forma na funcao updateOne())
  /*  validate: {
        status: {
          type: Boolean,
          default: false
        },
        date: {
          type: Date,
          default: null
        },
        dishs: {
          type: [DishSchema],
          default: []
        }
    }
    rating:{
      status: {
        type: Boolean,
        default: false
      },
      comment: {
        type: String,
        default: null
      }
    } */
});

var Ticket = module.exports = mongoose.model('Ticket', TicketSchema);

module.exports.createTicket = (newTicket, callback) => {
    newTicket.save(callback);
}

module.exports.getById = (ticketID, callback) => {
    Ticket.findById(ticketID, callback);
}

//Validar quando o usuário usar o ticket
module.exports.validateTicket = (ticketID, dishs, callback) => {
    Ticket.updateOne({ _id: ticketID }, {
        validatedStatus: true,
        validateDate: Date.now(),
        validatedDishs: dishs
    }, callback);
}

//Validar quando o usuário avaliar os pratos do ticket
module.exports.validateRating = (ticketID, comment, callback) => {
    Ticket.updateOne({ _id: ticketID }, {
        validateRating: true,
        ratingComment: comment
    }, callback);
}

module.exports.getByUserID = (userID, callback) => {
    Ticket.find({
        'user_info.id': userID
    }, callback);
}
