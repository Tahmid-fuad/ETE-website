const mongoose = require("mongoose");

const FacultySchema = new mongoose.Schema({
    name: String,
    desig: String,
    photo: String,
    email: String,
    number: String,
    foi: String,
    quali: String,
    publications: [{
        sn: Number,
        title: String,
        authors: String,
        info: String,
        year: Number,
    }],
    facebook: String,
    linkedin: String,
});

const FacultyModel = mongoose.model('faculty', FacultySchema);
module.exports = FacultyModel;