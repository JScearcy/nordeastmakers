/**
 * Created by MrComputer on 10/7/15.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BookingSchema = new Schema({
<<<<<<< HEAD
    date: { type: Date, required: true},
    toolName: { type: String, required: true},
    time: { type: Array, required: true}
    //the time is going to be an array of objects {time: timeReserved, userId: userId} etc.
=======
    date: { type: String, required: true},
    toolId: { type: String, required: true},
    reservations: { type: Array, required: true}
    //the time is going to be an array of objects {time: timeReserved, userId: userId} etc.

>>>>>>> 711842b30f3d1fa9e2d8daf5384dc61e7a90e455
});

module.exports = mongoose.model('Booking', BookingSchema);
