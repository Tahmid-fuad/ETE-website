import ProtectedRoute from './ProtectedRoute';
import Footer from "./Footer";
import Header from "./Header";
import axios from 'axios';
import Notice from './Notice';
import React, { useEffect, useState } from 'react';
import courseIdReplace from './courseCodeMap';
import termReplace from './termMap';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import HeaderComponent from './HeaderComponent';
import MarkSubForm from './MarkSubForm';
import SearchStudent from './SearchStudent';

function Teacher() {
  const [teacherName, setTeacherName] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [teacherDesig, setTeacherDesig] = useState('');
  const [batch, setBatch] = useState('');
  const [term, setTerm] = useState('');
  const [course, setCourse] = useState('');
  const [exam, setExam] = useState('');
  const [studentId, setStudentId] = useState('');
  const [marks, setMarks] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [marksData, setMarksData] = useState(null);
  const [batchVisibility, setBatchVisibility] = useState({});
  const [termVisibility, setTermVisibility] = useState({});
  const [courseVisibility, setCourseVisibility] = useState({});
  const [photoUrl, setPhotoUrl] = useState('');
  const [facebook, setFacebook] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [info, setInfo] = useState('');
  const [year, setYear] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');
  const [serverError, setServerError] = useState('');
  const [facultyId, setFacultyId] = useState('');
  const [publication, setPublication] = useState([]);
  const [routine, setRoutine] = useState([]);
  const [routineError, setRoutineError] = useState('');

  useEffect(() => {
    const teacherEmail = localStorage.getItem('email');

    if (teacherEmail) {
      axios.get(`http://localhost:3001/teacherdata/${teacherEmail}`)
        .then(response => {
          setTeacherName(response.data.name);
          setTeacherEmail(response.data.email);
          setTeacherDesig(response.data.desig);
          setPhotoUrl(`http://localhost:3001/user-photo/${teacherEmail}`);
        })
        .catch(error => {
          console.error('Error fetching teacher details:', error);
        });
    }

    fetchMarks();

  }, []);

  const fetchMarks = async () => {
    // Fetch student marks data by course
    try {
      const response = await axios.get('http://localhost:3001/getMarksByCourse')
      setMarksData(response.data);
    } catch (error) {
      console.error('Error fetching student marks:', error);
    }
  }

  let designation = '';
  switch (teacherDesig) {
    case '1':
      designation = 'Professor';
      break;
    case '2':
      designation = 'Associate Professor';
      break;
    case '3':
      designation = 'Assistant Professor';
      break;
    case '4':
      designation = 'Lecturer';
      break;
    default:
      // designation = 'Unknown Designation';
      break;
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

  const printBatchContent = async (batchYear) => {
    const batchElement = document.getElementById(`batch-${batchYear}`);
    const contentCanvas = await html2canvas(batchElement);

    const headerElement = document.getElementById('pdf-header');
    const headerCanvas = await html2canvas(headerElement);

    const pdf = new jsPDF('p', 'mm', 'a4', true);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const headerHeight = headerCanvas.height * (pdfWidth / headerCanvas.width);

    pdf.addImage(headerCanvas.toDataURL('image/png'), 'PNG', 10, 10, pdfWidth - 20, headerHeight);

    addContentWithHeader(pdf, contentCanvas, headerCanvas, 20 + headerHeight);
    pdf.save(`Batch_${batchYear}_Report.pdf`);
  };

  const printTermContent = async (batchYear, termName) => {
    const courseElement = document.getElementById(`term-${batchYear}-${termName}`);
    const contentCanvas = await html2canvas(courseElement);

    const headerElement = document.getElementById('pdf-header');
    const headerCanvas = await html2canvas(headerElement);

    const pdf = new jsPDF('p', 'mm', 'a4', true);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const headerHeight = headerCanvas.height * (pdfWidth / headerCanvas.width);

    pdf.addImage(headerCanvas.toDataURL('image/png'), 'PNG', 10, 10, pdfWidth - 20, headerHeight);

    addContentWithHeader(pdf, contentCanvas, headerCanvas, 20 + headerHeight);
    pdf.save(`Batch_${batchYear}_Term_${termName}_Report.pdf`);
  };

  const printCourseContent = async (batchYear, term, courseCode) => {
    const courseElement = document.getElementById(`course-${batchYear}-${term}-${courseCode}`);
    const contentCanvas = await html2canvas(courseElement);

    const headerElement = document.getElementById('pdf-header');
    const headerCanvas = await html2canvas(headerElement);

    const pdf = new jsPDF('p', 'mm', 'a4', true);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const headerHeight = headerCanvas.height * (pdfWidth / headerCanvas.width);

    pdf.addImage(headerCanvas.toDataURL('image/png'), 'PNG', 10, 10, pdfWidth - 20, headerHeight);

    addContentWithHeader(pdf, contentCanvas, headerCanvas, 20 + headerHeight);
    pdf.save(`Course_${courseCode}_Batch_${batchYear}_Report.pdf`);
  };

  const toggleBatchVisibility = (batchYear) => {
    setBatchVisibility((prev) => ({
      ...prev,
      [batchYear]: !prev[batchYear],
    }));
  };

  const toggleTermVisibility = (batchYear, termName) => {
    setTermVisibility((prev) => ({
      ...prev,
      [batchYear]: {
        ...prev[batchYear],
        [termName]: !prev[batchYear]?.[termName]
      }
    }));
  };

  const toggleCourseVisibility = (batchYear, termName, courseCode) => {
    setCourseVisibility((prev) => ({
      ...prev,
      [batchYear]: {
        ...prev[batchYear],
        [termName]: {
          ...prev[batchYear]?.[termName],
          [courseCode]: !prev[batchYear]?.[termName]?.[courseCode]
        }
      }
    }));
  };



  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitMessage('');
    setServerError('');

    const formData = new FormData();
    formData.append('facebook', facebook);
    formData.append('linkedin', linkedin);
    formData.append('email', teacherEmail);
    formData.append('title', title);
    formData.append('authors', authors);
    formData.append('info', info);
    formData.append('year', year);

    axios.post('http://localhost:3001/facultydetails', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(result => {
        setSubmitMessage('Updated Successfully');
        fetchFaculty();
        resetForm();
      })
      .catch(err => {
        // if (err.response && err.response.status === 500) {
        setServerError(err.response);
        // } else {
        //   setServerError("An error occurred. Please try again.");
        // }
      });

  };

  const resetForm = () => {
    setTitle('');
    setFacebook('');
    setLinkedin('');
    setAuthors('');
    setInfo('');
    setYear('');
  };

  useEffect(() => {
    fetchFaculty();
  }, [teacherEmail]);

  const fetchFaculty = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/faculty/${teacherEmail}`);
      setPublication(response.data.publications);
      setFacultyId(response.data._id);
    } catch (error) {
      console.error('Error fetching faculty data', error);
    }
  };

  const deleteFacultyrecord = async (facultyId, publicationId) => {
    try {
      await axios.delete(`http://localhost:3001/facultyrecord/${facultyId}/publication/${publicationId}`);
      fetchFaculty();
    } catch (err) {
      setError('Failed to delete publication. Please try again later.');
    }
  };

  const fetchRoutine = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/fetchroutine/master`);
      setRoutine(response.data);
    } catch (err) {
      setRoutineError('Failed to load routine. Please try again later.');
      console.log(routineError);
    }
  };

  useEffect(() => {
    fetchRoutine();
  }, []);

  const calculateBestMarks = (student) => {
    const courseCredit = parseFloat(student.courseCredit);
    const ctMarks = student.exams
      .filter(exam => exam.examType.startsWith('CT'))
      .map(exam => parseFloat(exam.marks));
    const bestN = courseCredit === 3 ? 3 : courseCredit === 4 ? 4 : ctMarks.length;
    const bestMarks = ctMarks
      .sort((a, b) => b - a)
      .slice(0, bestN)
      .reduce((acc, mark) => acc + mark, 0);


    const attendanceMarks = parseFloat(student.exams.find(exam => exam.examType === 'Attendance')?.marks || 0);
    const termFinalMarks = parseFloat(student.exams.find(exam => exam.examType === 'Term Final')?.marks || 0);
    return (bestMarks + attendanceMarks + termFinalMarks).toFixed(2);
  };

  const calculateLabTotal = (course) => {
    const labMarks = course.exams
      .filter(exam => exam.examType.startsWith('Lab'))
      .map(exam => parseFloat(exam.marks) || 0);

    const averageLabMarks = labMarks.reduce((acc, mark) => acc + mark, 0) / labMarks.length;

    const quizMark = parseFloat(course.exams.find(exam => exam.examType === 'Quiz')?.marks) || 0;
    const vivaMark = parseFloat(course.exams.find(exam => exam.examType === 'Viva')?.marks) || 0;
    const attendanceMark = parseFloat(course.exams.find(exam => exam.examType === 'Attendance')?.marks) || 0;

    const totalMarks = (averageLabMarks * course.courseCredit * 6) + quizMark + vivaMark + attendanceMark;

    return totalMarks.toFixed(2);
  };

  const calculateGrade = (student, totalMarks) => {
    const courseCredit = student.courseCredit;
    const maxMarks = courseCredit * 100;
    const percentage = totalMarks / maxMarks;

    const attendanceMark = parseFloat(student.exams.find(exam => exam.examType === 'Attendance')?.marks) || 0;
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

  return (
    <div>
      <Header />
      <ProtectedRoute allowedRoles={['teacher']} />
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
                    <td>{teacherName}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold" }}>Email:</td>
                    <td>{teacherEmail}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold" }}>Designation:</td>
                    <td>{designation}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-4">
              <div className='w-100 p-3 rounded bg-white'>
                <MarkSubForm
                  teacherEmail={teacherEmail}
                  batch={batch}
                  setBatch={setBatch}
                  term={term}
                  setTerm={setTerm}
                  course={course}
                  setCourse={setCourse}
                  exam={exam}
                  setExam={setExam}
                  studentId={studentId}
                  setStudentId={setStudentId}
                  marks={marks}
                  setMarks={setMarks}
                  setMarksData={setMarksData}
                  successMessage={successMessage}
                  setSuccessMessage={setSuccessMessage}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="row">
          <div className="col-4 float-start">
            <Notice />
            <SearchStudent />
          </div>
          <div className="col-8">
            <h3><a className='text-black text-decoration-underline' href={`http://localhost:3001/public/routine/file/${routine.file1}`}>Master Routine</a></h3>
            <img
              className="img-fluid"
              src={`http://localhost:3001/public/routine/image/${routine.file2}`}
            // style={{ objectFit: 'cover', height: '500px' }}
            />
          </div>
        </div>
      </div>
      <div className="row m-2 bg-dark bg-opacity-10">
        {/* Display Marks Data */}
        <div className="container mt-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="text-decoration-underline">Exam Results</h3>
            <button
              className="btn btn-primary mx-4"
              onClick={() => fetchMarks()}
            >
              Refresh
            </button>
          </div>

          {marksData ? (
            marksData.batch.map(batch => (
              <div key={batch.batchName} id={`batch-${batch.batchName}`} className="mb-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5
                    className="text-decoration-underline m-0 p-0"
                    onClick={() => toggleBatchVisibility(batch.batchName)}>
                    Batch: {batch.batchName}
                  </h5>
                  <button
                    className="btn btn-primary mx-4"
                    onClick={() => printBatchContent(batch.batchName)}
                  >
                    Download
                  </button>
                </div>
                {batchVisibility[batch.batchName] && (
                  <>
                    {batch.terms.map(term => (
                      <div key={term.term} id={`term-${batch.batchName}-${term.term}`}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h5 className="text-decoration-underline"
                            onClick={() => toggleTermVisibility(batch.batchName, term.term)}>
                            {termReplace[term.term] || term.term}
                          </h5>
                          <button
                            className="btn btn-primary mx-4"
                            onClick={() => printTermContent(batch.batchName, term.term)}
                          >
                            Download
                          </button>
                        </div>
                        {termVisibility[batch.batchName] && termVisibility[batch.batchName][term.term] && (
                          <>
                            {term.courses.map(course => {
                              const examTypes = [...new Set(course.students.flatMap(student => student.exams.map(exam => exam.examType)))];
                              return (
                                <div key={course.courseCode} id={`course-${batch.batchName}-${term.term}-${course.courseCode}`}>
                                  <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="text-decoration-underline"
                                      onClick={() => toggleCourseVisibility(batch.batchName, term.term, course.courseCode)}>
                                      {courseIdReplace[course.courseCode] || course.courseCode}</h5>
                                    <button
                                      className="btn btn-primary mx-4"
                                      onClick={() => printCourseContent(batch.batchName, term.term, course.courseCode)}
                                    >
                                      Download
                                    </button>
                                  </div>
                                  {courseVisibility[batch.batchName] && courseVisibility[batch.batchName][term.term] && courseVisibility[batch.batchName][term.term][course.courseCode] && (
                                    <>
                                      <table className="table table-bordered">
                                        <thead>
                                          <tr>
                                            <th>Student ID</th>
                                            {examTypes.map(examType => (
                                              <th key={examType}>{examType}</th>
                                            ))}
                                            <th>Total</th>
                                            <th>Grade</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {course.students.map(student => (
                                            <tr key={student.studentId}>
                                              <td>{student.studentId}</td>
                                              {examTypes.map(examType => {
                                                const exam = student.exams.find(e => e.examType === examType);
                                                return <td key={examType}>{exam ? exam.marks : ''}</td>;
                                              })}
                                              <td>
                                                {student.courseType === 'theory' && student.exams.some(e => e.examType === 'Term Final')
                                                  ? calculateBestMarks(student)
                                                  : student.courseType === 'theory'
                                                    ? 'N/A'
                                                    : student.courseType === 'lab' && student.exams.some(e => e.examType === 'Quiz') && student.exams.some(e => e.examType === 'Viva')
                                                      ? calculateLabTotal(student)
                                                      : student.courseType === 'lab'
                                                        ? 'N/A'
                                                        : ''}
                                              </td>
                                              <td>
                                                {student.courseType === 'theory' && student.exams.some(e => e.examType === 'Term Final')
                                                  ? calculateGrade(student, calculateBestMarks(student))
                                                  : student.courseType === 'theory'
                                                    ? 'N/A'
                                                    : student.courseType === 'lab' && student.exams.some(e => e.examType === 'Quiz') && student.exams.some(e => e.examType === 'Viva')
                                                      ? calculateGrade(student, calculateLabTotal(student))
                                                      : student.courseType === 'lab'
                                                        ? 'N/A'
                                                        : ''}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>

                                      </table>
                                    </>
                                  )}
                                </div>
                              );
                            })}
                          </>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>
            ))
          ) : (
            <p>No marks data available.</p>
          )}
        </div>
      </div>
      <div className="row">
        <h2 className='text-center text-decoration-underline bg-primary py-sm-2 text-white'>My Research</h2>
        <div className="col-4">
          <div className='w-100 p-4 rounded bg-white'>
            <form onSubmit={handleSubmit}>
              <h5 className='text-center'>Update My Social Link</h5>
              <div className='mb-2'>
                <label htmlFor="number">Facebook Link</label>
                <input
                  type="text"
                  placeholder='Enter Facebook Link'
                  className='form-control'
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                />
              </div>
              <div className='mb-2'>
                <label htmlFor="number">LinkedIn link</label>
                <input
                  type="text"
                  placeholder='Enter LinkedIn Link'
                  className='form-control'
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                />
              </div>
              <h5 className='text-center'>Update My Research</h5>
              <div className="form-floating mb-2">
                <textarea
                  className="form-control"
                  placeholder="Title"
                  id="title"
                  style={{ height: '20px' }}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label htmlFor="title">Title</label>
              </div>
              <div className="form-floating mb-2">
                <textarea
                  className="form-control"
                  placeholder="Authors"
                  id="authors"
                  style={{ height: '20px' }}
                  value={authors}
                  onChange={(e) => setAuthors(e.target.value)}
                />
                <label htmlFor="authors">Authors</label>
              </div>
              <div className="form-floating mb-2">
                <textarea
                  className="form-control"
                  placeholder="Informations"
                  id="info"
                  style={{ height: '20px' }}
                  value={info}
                  onChange={(e) => setInfo(e.target.value)}
                />
                <label htmlFor="info">Information</label>
              </div>
              <div className='mb-2'>
                {/* <label htmlFor="number">Year</label> */}
                <input
                  type="number"
                  placeholder='Year'
                  className='form-control'
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>
              {submitMessage && <p className="text-success">{submitMessage}</p>}
              {serverError && <p className="text-danger">{serverError}</p>}
              <div className='d-grid'>
                <button className='btn btn-primary mt-2'>Save</button>
              </div>
            </form>
          </div>
        </div>
        <div className="col-8">
          <div className='m-2'>
            <div className="d-flex justify-content-end">
              <button
                className="btn btn-primary m-1"
                onClick={fetchFaculty}
              >
                Refresh
              </button>
            </div>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th style={{ width: "5%" }}>SN</th>
                  <th style={{ width: "25%" }}>Title</th>
                  <th style={{ width: "25%" }}>Authors</th>
                  <th style={{ width: "30%" }}>Info</th>
                  <th style={{ width: "10%" }}>Year</th>
                  <th style={{ width: "5%" }}>Delete</th>
                </tr>
              </thead>
              <tbody>
                {publication.map((publication, idx) => (
                  <tr key={idx}>
                    <td>{publication.sn}</td>
                    <td>{publication.title}</td>
                    <td>{publication.authors}</td>
                    <td>{publication.info}</td>
                    <td>{publication.year}</td>
                    <td>
                      <button
                        className='btn btn-secondary rounded-3 btn-sm ms-auto'
                        onClick={() => deleteFacultyrecord(facultyId, publication._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

export default Teacher;
