const mongoose = require('mongoose');

const OwlSchema = new mongoose.Schema({
    file: String,
});

const OwlModel = mongoose.model('owllink', OwlSchema);
module.exports = OwlModel;