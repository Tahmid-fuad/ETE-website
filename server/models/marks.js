const mongoose = require('mongoose');

const MarksSchema = new mongoose.Schema({
    marks: { type: String, required: true },
    teacherEmail: { type: String }
})
const ExamSchema = new mongoose.Schema({
    examType: { type: String, required: true },
    marks: [MarksSchema]
});

const CourseSchema = new mongoose.Schema({
    courseCode: { type: String, required: true },
    courseCredit: { type: Number, },
    courseType: { type: String, },
    exams: [ExamSchema]
});

const TermSchema = new mongoose.Schema({
    term: { type: String, required: true, index: true },
    courses: [CourseSchema]
});

const StudentSchema = new mongoose.Schema({
    studentId: { type: String, required: true, index: true },
    terms: [TermSchema]
});

const BatchSchema = new mongoose.Schema({
    batchYear: { type: String, required: true, index: true },
    students: [StudentSchema]
});

const MarksModel = mongoose.model('Marks', BatchSchema);
module.exports = MarksModel;
