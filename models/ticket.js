var mongoose = module.require('mongoose');

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
    }
});

var Ticket = module.exports = mongoose.model('Ticket', TicketSchema);

module.exports.createTicket = (newTicket, callback) => {
    newTicket.save(callback);
}

module.exports.getByUserID = (userID, callback) => {
    Ticket.find({
        'user_info.id': userID
    }, callback);
}