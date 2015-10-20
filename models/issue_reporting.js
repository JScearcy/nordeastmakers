/**
 * Created by Mothra on 10/16/15.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ReportingSchema = new Schema({
    username: { type: String, required: true },
    toolName: { type: String, required: true },
    issueReport: { type: String, required: true }
});

module.exports = mongoose.model('Reporting', ReportingSchema);
