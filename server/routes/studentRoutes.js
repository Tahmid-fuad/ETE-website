const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.get('/data/:id', studentController.getStudentData);
router.get('/marks/:id', studentController.getStudentMarks);
router.post('/search/:studentId', studentController.searchStudent);
router.get('/photo/:email', studentController.getStudentPhoto);

module.exports = router; 