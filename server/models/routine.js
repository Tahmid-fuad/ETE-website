const mongoose = require('mongoose');

const RoutineSchema = new mongoose.Schema({
    file1: String,
    file2: String,
    dest: String,
});

const RoutineModel = mongoose.model('routine', RoutineSchema);
module.exports = RoutineModel;