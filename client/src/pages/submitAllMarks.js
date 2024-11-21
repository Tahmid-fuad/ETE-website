import axios from 'axios';

const batch = '20';
const term = '22';
const course = '212';
const courseCrdt = 0.75;
const courseTyp = 'lab';
const exam = 'Quiz';
const teacherEmail = 'azad@cuet.ac.bd';

let studentId = 2008001;

const grades = `A+
A+
A+
A+
A+
A+
A+
A+
A+
A+
F
A+
A+
A+
A+
A+
A+
A
A+
A+
A+
A+
A+
A+
A+
A+
A+
A+
A
A+
A+
A+
A
A+
A+
A+
A+
A+
A+
A+
A+
A+
A+
A+
A+
A+
A+
A+
A+
A+
A+
A+
A+
A+
A+
A
A+
A+`;

const marksArray = grades
    .trim() // Remove any extra whitespace from start and end
    .split('\n') // Split the string by new lines
    .map(grade => grade.trim()); // Trim each grade and return as an array

// const abcd = {
//     "A+": 210,
//     "A": 195,
//     "A-": 180,
//     "B+": 165,
//     "B": 150,
//     "B-": 135,
//     "C+": 120,
//     "C": 105,
//     "D": 90,
//     "F": 0
// };

//for 1.5 credit
// const abcd = {
//     "A+": 65,
//     "A": 57.5,
//     "A-": 50,
//     "B+": 42.5,
//     "B": 35,
//     "B-": 27.5,
//     "C+": 20,
//     "C": 12.5,
//     "D": 5,
//     "F": 0
// };

//for 0.75 credit
const abcd = {
    "A+": 32.5,
    "A": 28.75,
    "A-": 25,
    "B+": 21.25,
    "B": 17.5,
    "B-": 13.75,
    "C+": 10,
    "C": 6.25,
    "D": 2.5,
    "F": 0
};


// for 4 credit 
// const abcd = {
//     "A+": 280,
//     "A": 260,
//     "A-": 240,
//     "B+": 220,
//     "B": 200,
//     "B-": 180,
//     "C+": 160,
//     "C": 140,
//     "D": 120,
//     "F": 0
// };

const submitMarks = async (studentId, marks) => {
    const data = {
        batch,
        term,
        course,
        courseCrdt,
        courseTyp,
        exam,
        studentId: `${studentId}`,
        marks: `${marks}`,
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
    let index = 0;
    while (index < marksArray.length) {
        if (studentId === 2008041 || studentId === 2008028 || studentId === 2008052) {
            studentId++;
            continue;
        }

        const grade = marksArray[index];
        const numericMarks = abcd[grade]; // Map grade to numeric marks

        await submitMarks(studentId, numericMarks);
        studentId++;
        index++;
    }
};

submitAllMarks();
