const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    eventName: String,
    eventDay: String,
    eventMonth: String,
});

const EventModel = mongoose.model('event', EventSchema);
module.exports = EventModel;