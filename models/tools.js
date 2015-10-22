/**
 * Created by MrComputer on 10/7/15.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ToolSchema = new Schema({
    toolName: { type: String, required: true, unique: true},
    dailyHours: { type: Number, required: true},
    weeklyHours: { type: Number, required: true},
    online: { type: Boolean, required: true}

});

module.exports = mongoose.model('Tools', ToolSchema);