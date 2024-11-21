const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema({
    notice: String,
    file: String,
});

const NoticeModel = mongoose.model('notice', NoticeSchema);
module.exports = NoticeModel;