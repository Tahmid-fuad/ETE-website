import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProtectedRoute from './ProtectedRoute';
import Footer from "./Footer";
import Header from "./Header";
import Notice from './Notice';
import getAdvisorEmail from './advisorLogic';
import courseIdReplace from './courseCodeMap.jsx';
import termReplace from './termMap';
import HeaderComponent from './HeaderComponent.jsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function Student() {
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [studentBatch, setStudentBatch] = useState('');
  const [advisor, setAdvisor] = useState([]);
  const [studentMarks, setStudentMarks] = useState(null);
  const [termVisibility, setTermVisibility] = useState({});
  const [photoUrl, setPhotoUrl] = useState('');
  const [routine, setRoutine] = useState([]);
  const [routineError, setRoutineError] = useState('');

  const advisorEmail = getAdvisorEmail(studentBatch, studentId);

  useEffect(() => {
    const studentId = localStorage.getItem('id');

    if (studentId) {
      axios.get(`http://localhost:3001/studentdata/${studentId}`)
        .then(response => {
          setStudentName(response.data.name);
          setStudentEmail(response.data.email);
          setStudentId(response.data.id);
          setStudentBatch(response.data.batch);

          // Initialize term visibility for each term
          if (response.data.marks && response.data.marks.terms) {
            const initialTermVisibility = {};
            response.data.marks.terms.forEach(term => {
              initialTermVisibility[term.term] = true;
            });
            setTermVisibility(initialTermVisibility);
          }
        })
        .catch(error => {
          console.error('Error fetching student details:', error);
        });

      fetchMarks();
    }
  }, [studentId]);

  const fetchMarks = async () => {
    // Fetch student marks data by course
    try {
      const response = await axios.get(`http://localhost:3001/studentMarks/${studentId}`)
      setStudentMarks(response.data);
    } catch (error) {
      console.error('Error fetching student marks:', error);
    }
  }

  useEffect(() => {
    if (advisorEmail) {
      axios.get(`http://localhost:3001/teacherdata/${advisorEmail}`)
        .then(response => {
          setAdvisor(response.data);
        })
        .catch(error => {
          console.error('Error fetching teacher details:', error);
        });
    }
  }, [advisorEmail]);

  useEffect(() => {
    if (studentEmail) {
      setPhotoUrl(`http://localhost:3001/user-photo/${studentEmail}`);
    }
  }, [studentEmail]);

  let academicYear = '';
  switch (studentBatch) {
    case '20':
      academicYear = '2020-21';
      break;
    case '21':
      academicYear = '2021-22';
      break;
    case '22':
      academicYear = '2022-23';
      break;
    default:
    // academicYear = 'Unknown Batch';
  }

  const addContentWithHeader = (pdf, contentCanvas, headerCanvas, startY) => {
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const contentHeight = contentCanvas.height;
    const contentWidth = contentCanvas.width;
    const headerHeight = headerCanvas.height * (pdfWidth / headerCanvas.width);

    let remainingHeight = contentHeight;
    let currentY = startY;

    while (remainingHeight > 0) {
      const availableHeight = pdfHeight - currentY - 10; // 10 is for bottom margin
      const sliceHeight = Math.min(availableHeight, remainingHeight);
      const scaleRatio = pdfWidth / contentWidth;

      // Adjust sliceHeight according to the scale ratio
      const adjustedSliceHeight = sliceHeight / scaleRatio;

      const pageContent = contentCanvas.getContext('2d').getImageData(0, contentHeight - remainingHeight, contentWidth, adjustedSliceHeight);

      // Create a new canvas for this part of the content
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = contentWidth;
      tempCanvas.height = adjustedSliceHeight;
      tempCanvas.getContext('2d').putImageData(pageContent, 0, 0);

      const pageData = tempCanvas.toDataURL('image/png');
      pdf.addImage(pageData, 'PNG', 10, currentY, pdfWidth - 20, adjustedSliceHeight * scaleRatio);

      remainingHeight -= adjustedSliceHeight;

      if (remainingHeight > 0) {
        pdf.addPage();
        currentY = 10; // Reset Y position for new page
        pdf.addImage(headerCanvas.toDataURL('image/png'), 'PNG', 10, currentY, pdfWidth - 20, headerHeight);
        currentY += headerHeight + 10; // Adjust Y for new content
      }
    }
  };

  // Function to print result with a header
  const printResultContent = async (studentId) => {
    const resultElement = document.getElementById("result");
    const contentCanvas = await html2canvas(resultElement);

    const headerElement = document.getElementById('pdf-header');
    const headerCanvas = await html2canvas(headerElement);

    const pdf = new jsPDF('p', 'mm', 'a4', true);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const headerHeight = headerCanvas.height * (pdfWidth / headerCanvas.width);

    pdf.addImage(headerCanvas.toDataURL('image/png'), 'PNG', 10, 10, pdfWidth - 20, headerHeight);

    addContentWithHeader(pdf, contentCanvas, headerCanvas, 20 + headerHeight);
    pdf.save(`Result_report_of_ID_${studentId}.pdf`);
  };

  // Function to print term content with a header
  const printTermContent = async (studentId, termName) => {
    const courseElement = document.getElementById(`term-${termName}`);
    const contentCanvas = await html2canvas(courseElement);

    // Render header to canvas
    const headerElement = document.getElementById('pdf-header');
    const headerCanvas = await html2canvas(headerElement);

    const pdf = new jsPDF('p', 'mm', 'a4', true);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const headerHeight = headerCanvas.height * (pdfWidth / headerCanvas.width);

    pdf.addImage(headerCanvas.toDataURL('image/png'), 'PNG', 10, 10, pdfWidth - 20, headerHeight);

    addContentWithHeader(pdf, contentCanvas, headerCanvas, 20 + headerHeight);
    pdf.save(`${studentId}_Term_${termName}_Report.pdf`);
  };

  const toggleTermVisibility = (termName) => {
    setTermVisibility((prev) => ({
      ...prev,
      [termName]: !prev[termName],
    }));
  };

  const fetchRoutine = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/fetchroutine/${studentBatch}`);
      setRoutine(response.data);
    } catch (err) {
      setRoutineError('Failed to load routine. Please try again later.');
      console.log(routineError);
    }
  };

  useEffect(() => {
    fetchRoutine();
  }, [studentBatch]);

  const calculateBestMarks = (course) => {
    const courseCredit = parseFloat(course.courseCredit);
    const ctMarks = course.exams
      .filter(exam => exam.examType.startsWith('CT'))
      .map(exam => parseFloat(exam.marks[0].marks));

    const bestN = courseCredit === 3 ? 3 : courseCredit === 4 ? 4 : ctMarks.length;
    const bestMarks = ctMarks
      .sort((a, b) => b - a)
      .slice(0, bestN)
      .reduce((acc, mark) => acc + mark, 0);

    const attendanceMarks = parseFloat(course.exams.find(exam => exam.examType === 'Attendance')?.marks[0].marks || 0);
    const termFinalMarks = parseFloat(course.exams.find(exam => exam.examType === 'Term Final')?.marks[0].marks || 0);

    return (bestMarks + attendanceMarks + termFinalMarks).toFixed(2);
  };

  const calculateLabTotal = (course) => {
    const labMarks = course.exams
      .filter(exam => exam.examType.startsWith('Lab'))
      .map(exam => parseFloat(exam.marks[0].marks) || 0);

    const averageLabMarks = labMarks.reduce((acc, mark) => acc + mark, 0) / labMarks.length;

    const quizMark = parseFloat(course.exams.find(exam => exam.examType === 'Quiz')?.marks[0].marks) || 0;
    const vivaMark = parseFloat(course.exams.find(exam => exam.examType === 'Viva')?.marks[0].marks) || 0;
    const attendanceMark = parseFloat(course.exams.find(exam => exam.examType === 'Attendance')?.marks[0].marks) || 0;

    const totalMarks = (averageLabMarks * course.courseCredit * 6) + quizMark + vivaMark + attendanceMark;

    return totalMarks.toFixed(2);
  };

  const calculateGrade = (course, totalMarks) => {
    const courseCredit = course.courseCredit;
    const maxMarks = courseCredit * 100;
    const percentage = totalMarks / maxMarks;

    const attendanceMark = parseFloat(course.exams.find(exam => exam.examType === 'Attendance')?.marks[0].marks) || 0;
    const minAttendanceMark = courseCredit * 6;

    if (attendanceMark < minAttendanceMark) {
      return 'F';
    }

    if (percentage >= 0.8) {
      return 'A+';
    } else if (percentage >= 0.75) {
      return 'A';
    } else if (percentage >= 0.70) {
      return 'A-';
    } else if (percentage >= 0.65) {
      return 'B+';
    } else if (percentage >= 0.60) {
      return 'B';
    } else if (percentage >= 0.55) {
      return 'B-';
    } else if (percentage >= 0.50) {
      return 'C+';
    } else if (percentage >= 0.45) {
      return 'C';
    } else if (percentage >= 0.40) {
      return 'D';
    } else {
      return 'F';
    }
  };

  const gradeToGpa = {
    'A+': 4.0,
    'A': 3.75,
    'A-': 3.5,
    'B+': 3.25,
    'B': 3.0,
    'B-': 2.75,
    'C+': 2.5,
    'C': 2.25,
    'D': 2.0,
    'F': 0.0,
  };

  const calculateGpa = (courses) => {
    let totalGradePoints = 0;
    let totalCredits = 0;

    courses.forEach(course => {
      if (course.courseType === "theory") {
        const grade = calculateGrade(course, calculateBestMarks(course));
        const gradePoint = gradeToGpa[grade];
        const courseCredit = course.courseCredit;
        totalGradePoints += gradePoint * courseCredit;
        totalCredits += courseCredit;
      }
      else if (course.courseType === "lab") {
        const grade = calculateGrade(course, calculateLabTotal(course));
        const gradePoint = gradeToGpa[grade];
        const courseCredit = course.courseCredit;
        totalGradePoints += gradePoint * courseCredit;
        totalCredits += courseCredit;
      }
    });

    if (totalCredits === 0) return "0.00";
    return (totalGradePoints / totalCredits).toFixed(2);
  };

  const calculateCgpa = (terms) => {
    let totalGradePoints = 0;
    let totalCredits = 0;


    terms.forEach(term => {
      const courses = term.courses;
      courses.forEach(course => {
        let grade;
        if (course.courseType === "theory") {
          grade = calculateGrade(course, calculateBestMarks(course));
        } else if (course.courseType === "lab") {
          grade = calculateGrade(course, calculateLabTotal(course));
        }

        const gradePoint = gradeToGpa[grade];
        totalGradePoints += gradePoint * course.courseCredit;
        totalCredits += course.courseCredit;
      });
    });

    if (totalCredits === 0) return "0.00";
    return (totalGradePoints / totalCredits).toFixed(2);
  };

  return (
    <div>
      <Header />
      <ProtectedRoute allowedRoles={['student']} />
      <div style={{ background: "linear-gradient(120deg,#AB7442, #ffffff)" }}>
        <div className="container">
          <div className="row py-sm-5">
            <div className="col-3">
              {photoUrl ? (
                <img src={photoUrl} className="img-fluid" />
              ) : (
                <div>Loading photo...</div>
              )}
            </div>
            <div className="col-5 d-flex align-items-center">
              <table className='table' style={{ borderColor: "transparent" }}>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: "bold" }}>Name:</td>
                    <td>{studentName}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold" }}>Student ID:</td>
                    <td>{studentId}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold" }}>Email:</td>
                    <td>{studentEmail}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold" }}>Session:</td>
                    <td>{academicYear}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-2"></div>
            <div className="col-2">
              <img src={`http://localhost:3001/public/images/${advisor.photo}`}
                alt="" className="img-fluid"
              />
              <h5>Name of the advisor:</h5>{advisor.name}
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="row">
          <div className="col-4 float-start">
            <Notice />
          </div>
          <div className="col-8 mt-3">
            <h4><a className='text-black text-decoration-underline' href={`http://localhost:3001/public/routine/file/${routine.file1}`}>Routine for {routine.dest} Batch</a></h4>
            <img
              className="img-fluid"
              src={`http://localhost:3001/public/routine/image/${routine.file2}`}
            />
          </div>
        </div>
        <div className="row m-2">
          {/* Display student marks */}
          <div className="col-12 bg-dark bg-opacity-10" id="result">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3>Exam Results of ID: {`${studentId}`}</h3>
              {studentMarks ? (
                <p className='fw-bold fs-5'>CGPA: {calculateCgpa(studentMarks.terms)}</p>
              ) : (
                <p>Loading...</p>
              )}
              <div>
                <button
                  className="btn btn-primary mx-4"
                  onClick={() => fetchMarks()}
                >
                  Refresh
                </button>
                <button
                  className="btn btn-primary mx-4"
                  onClick={() => printResultContent(studentId)}
                >
                  Download
                </button>
              </div>
            </div>
            {studentMarks ? (
              studentMarks.terms.map(term => {
                const theoryExamTypes = Array.from(new Set(term.courses.filter(course => course.courseType === 'theory').flatMap(course => course.exams.map(exam => exam.examType))));
                const labExamTypes = Array.from(new Set(term.courses.filter(course => course.courseType === 'lab').flatMap(course => course.exams.map(exam => exam.examType))));
                return (
                  <div key={term.term} className="mb-4" id={`term-${term.term}`}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h4
                        className="text-decoration-underline m-0 p-0"
                        onClick={() => toggleTermVisibility(term.term)}
                      >
                        {termReplace[term.term]}
                      </h4>
                      <p className='fw-bold fs-5'>GPA:  {calculateGpa(term.courses)}</p>
                      <button
                        className="btn btn-primary mx-4"
                        onClick={() => printTermContent(studentId, term.term)}
                      >
                        Download
                      </button>
                    </div>
                    {termVisibility[term.term] && (
                      <div>
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>Theory Courses</th>
                              {theoryExamTypes.map(examType => (
                                <th key={examType}>{examType}</th>
                              ))}
                              <th>Total</th>
                              <th>Grade</th>
                            </tr>
                          </thead>
                          <tbody>
                            {term.courses.map(course => (
                              course.courseType === 'theory' && (
                                <tr key={course.courseCode}>
                                  <td>{courseIdReplace[course.courseCode] || course.courseCode}</td>
                                  {theoryExamTypes.map(examType => {
                                    const exam = course.exams.find(exam => exam.examType === examType);
                                    return <td key={examType}>{exam ? exam.marks[0].marks : '-'}</td>;
                                  })}
                                  <td>
                                    {course.exams.some(exam => exam.examType === "Term Final")
                                      ? calculateBestMarks(course)
                                      : 'N/A'}
                                  </td>
                                  <td>
                                    {course.exams.some(exam => exam.examType === "Term Final")
                                      ? calculateGrade(course, calculateBestMarks(course))
                                      : 'N/A'}
                                  </td>
                                </tr>
                              )
                            ))}
                          </tbody>
                        </table>
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>Lab Courses</th>
                              {labExamTypes.map(examType => (
                                <th key={examType}>{examType}</th>
                              ))}
                              <th>Total</th>
                              <th>Grade</th>
                            </tr>
                          </thead>
                          <tbody>
                            {term.courses.map(course => (
                              course.courseType === 'lab' && (
                                <tr key={course.courseCode}>
                                  <td>{courseIdReplace[course.courseCode] || course.courseCode}</td>
                                  {labExamTypes.map(examType => {
                                    const exam = course.exams.find(exam => exam.examType === examType);
                                    return <td key={examType}>{exam ? exam.marks[0].marks : '-'}</td>;
                                  })}
                                  <td>{course.exams.some(exam => exam.examType === "Quiz") && course.exams.some(exam => exam.examType === "Viva")
                                    ? calculateLabTotal(course)
                                    : 'N/A'}
                                  </td>
                                  <td>{course.exams.some(exam => exam.examType === "Quiz") && course.exams.some(exam => exam.examType === "Viva")
                                    ? calculateGrade(course, calculateLabTotal(course))
                                    : 'N/A'}
                                  </td>
                                </tr>
                              )
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p>No marks available</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
      <div id="pdf-header" style={{ position: 'absolute', top: '-99999999px' }}>
        <HeaderComponent />
      </div>
    </div>
  );
}

export default Student;
