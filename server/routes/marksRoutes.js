const express = require('express');
const router = express.Router();
const marksController = require('../controllers/marksController');

router.post('/submit', marksController.submitMarks);
router.get('/course', marksController.getMarksByCourse);

module.exports = router; 