/**
 * Created by MrComputer on 10/7/15.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BookingSchema = new Schema({
    date: { type: String, required: true},
    toolId: { type: String, required: true},
    reservations: { type: Array, required: true}
    //the time is going to be an array of objects {time: timeReserved, userId: userId} etc.

});

module.exports = mongoose.model('Booking', BookingSchema);
