import axios from 'axios';

const batch = '20';
const term = '22';
const course = '212';
const courseCrdt = 0.75;
const courseTyp = 'lab';
const exam = 'Attendance';
const teacherEmail = 'azad@cuet.ac.bd';
const marks = 5;

let studentId = 2008001;
// const marksArray = [15, 12, 14, 17, 19, 11, 14, 16, 13, 14, 15, 15, 12];

const submitMarks = async (studentId, marks) => {
    const data = {
        batch,
        term,
        course,
        courseCrdt,
        courseTyp,
        exam,
        studentId: `${studentId}`,
        marks,
        teacherEmail
    };

    try {
        console.log(data);
        const response = await axios.post('http://localhost:3001/submitMarks', data);
        // console.log(`Marks for Student ID ${studentId} submitted successfully:`, response.data);
    } catch (error) {
        console.error(`Error submitting marks for Student ID ${studentId}:`, error.response ? error.response.data : error.message);
    }
};

const submitAllMarks = async () => {
    while (studentId <= 2008061) {
        if (studentId === 2008041 || studentId === 2008028 || studentId === 2008052) {
            studentId++;
            continue;
        }
        await submitMarks(studentId, marks);
        studentId++;
    }
};

submitAllMarks();
