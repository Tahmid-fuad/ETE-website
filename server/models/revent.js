const mongoose = require('mongoose');

const ReventSchema = new mongoose.Schema({
    revent: String,
    file: String,
});

const ReventModel = mongoose.model('revent', ReventSchema);
module.exports = ReventModel;