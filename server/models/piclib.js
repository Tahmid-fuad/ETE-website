const mongoose = require('mongoose');

const PicSchema = new mongoose.Schema({
    file: String,
    name: String,
    filter: String,
});

const PicModel = mongoose.model('PicLib', PicSchema);
module.exports = PicModel;