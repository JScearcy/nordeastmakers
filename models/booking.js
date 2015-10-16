/**
 * Created by MrComputer on 10/7/15.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BookingSchema = new Schema({
    date: { type: Date, required: true},
    toolName: { type: String, required: true},
    time: { type: Array, required: true}
    //the time is going to be an array of objects {time: timeReserved, userId: userId} etc.
});

module.exports = mongoose.model('Booking', BookingSchema);
