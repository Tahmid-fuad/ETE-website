const StudentModel = require('../models/student');
const MarksModel = require('../models/marks');
const path = require('path');
const fs = require('fs');

const studentController = {
    getStudentData: async (req, res) => {
        const studentId = req.params.id;
        try {
            const student = await StudentModel.findOne({ id: studentId });
            if (!student) {
                return res.status(404).json({ message: 'Student not found' });
            }
            res.json({
                name: student.name,
                email: student.email,
                id: student.id,
                batch: student.batch
            });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    },

    getStudentMarks: async (req, res) => {
        const studentId = req.params.id;
        try {
            const studentMarks = await MarksModel.findOne(
                { 'students.studentId': studentId },
                { 'students.$': 1 }
            );
            if (!studentMarks) {
                return res.status(404).json({ message: 'Marks not found for the student' });
            }
            res.json(studentMarks.students[0]);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    },

    searchStudent: async (req, res) => {
        const studentId = req.params.studentId;
        try {
            const student = await StudentModel.findOne({ id: studentId });
            if (!student) {
                return res.status(404).json({ message: 'Student not found' });
            }
            res.json({ message: "Student found" });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    },

    getStudentPhoto: async (req, res) => {
        const email = req.params.email;
        const possibleExtensions = ['jpeg', 'jpg', 'png'];

        const photoPath = possibleExtensions
            .map(ext => path.join(__dirname, '../public/images', `${email}.${ext}`))
            .find(filePath => fs.existsSync(filePath));

        if (photoPath) {
            res.sendFile(photoPath);
        } else {
            res.status(404).send('Photo not found');
        }
    }
};

module.exports = studentController; 