import ProtectedRoute from './ProtectedRoute';
import Footer from "./Footer";
import Header from "./Header";
import axios from 'axios';
import { useEffect, useState } from 'react';
import MarkSubForm from './MarkSubForm';
import termReplace from './termMap';
import courseIdReplace from './courseCodeMap';
import Signup from './Signup';
import AddNotice from './AddNotice';
import AddRoutine from './AddRoutine';
import AddOwl from './AddOwl';
import AddPic from './AddPic';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import HeaderComponent from './HeaderComponent';
import SearchStudent from './SearchStudent';
import AddRecentEvents from './AddRecentEvents';

function Admin() {
  const [teacherEmail, setTeacherEmail] = useState('');
  const [batch, setBatch] = useState('');
  const [term, setTerm] = useState('');
  const [course, setCourse] = useState('');
  const [exam, setExam] = useState('');
  const [studentId, setStudentId] = useState('');
  const [marks, setMarks] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [marksData, setMarksData] = useState({});
  const [batchVisibility, setBatchVisibility] = useState({});
  const [termVisibility, setTermVisibility] = useState({});
  const [courseVisibility, setCourseVisibility] = useState({});
  const [notices, setNotices] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState('');
  const [contactError, setContactError] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [facebook, setFacebook] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [desig, setDesig] = useState('');
  const [foi, setFoi] = useState('');
  const [quali, setQuali] = useState('');
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [info, setInfo] = useState('');
  const [year, setYear] = useState('');
  const [photo, setPhoto] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');
  const [faculties, setFaculties] = useState([]);
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [facultyVisibility, setFacultyVisibility] = useState({});
  const [routines, setRoutines] = useState([]);
  const [routinesError, setRoutinesError] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventDay, setEventDay] = useState('');
  const [eventMonth, setEventMonth] = useState('');
  const [eventSuccessMessage, setEventSuccessMessage] = useState('');
  const [eventError, setEventError] = useState('');
  const [eventFetchError, setEventFetchError] = useState('');
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const noticesPerPage = 5;
  const [revents, setRevents] = useState([]);
  const [reventError, setReventError] = useState('');

  useEffect(() => {
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

  const fetchContacts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/fetchcontacts');
      setContacts(response.data);
    } catch (err) {
      setContactError('Failed to load notices. Please try again later.');
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

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


  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get('http://localhost:3001/fetchnotices');
        setNotices(response.data);
      } catch (err) {
        setError('Failed to load notices. Please try again later.');
      }
    };

    fetchNotices();
  }, []);

  const deleteNotice = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/notices/${id}`);
      setNotices(notices.filter(notice => notice._id !== id));
    } catch (err) {
      setError('Failed to delete notice. Please try again later.');
    }
  };

  const deleteMessage = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/contacts/${id}`);
      setContacts(contacts.filter(contact => contact._id !== id));
    } catch (err) {
      setError('Failed to delete contact. Please try again later.');
    }
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitMessage('');
    setServerError('');
    const errors = validate(name, email, desig);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('number', number);
      formData.append('facebook', facebook);
      formData.append('linkedin', linkedin);
      formData.append('desig', desig);
      formData.append('foi', foi);
      formData.append('quali', quali);
      formData.append('photo', photo);
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
          fetchFaculties();
          fetchEmails();
          resetForm();
        })
        .catch(err => {
          // if (err.response && err.response.status === 500) {
          setServerError(err.response);
          // } else {
          //   setServerError("An error occurred. Please try again.");
          // }
        });
    }
  };

  const resetForm = () => {
    setName('');
    setNumber('');
    setFacebook('');
    setLinkedin('');
    setDesig('');
    setFoi('');
    setQuali('');
    setTitle('');
    setAuthors('');
    setInfo('');
    setYear('');
    setPhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validate = (name, email, id, password, role, batch, desig) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    // if (!name) {
    //   errors.name = "Username is required";
    // }
    if (!email) {
      errors.email = "Email is required";
    } else if (!regex.test(email)) {
      errors.email = "This is not a valid email format";
    }
    // if (!desig) {
    //   errors.desig = "Designation is required";
    // }
    return errors;
  };


  const fetchFaculties = async () => {
    try {
      const response = await axios.get('http://localhost:3001/faculties');
      setFaculties(response.data);
    } catch (error) {
      console.error('Error fetching faculty data', error);
    }
  };
  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchEmails = async () => {
    try {
      const response = await axios.get('http://localhost:3001/emails');
      setEmails(response.data.map(entry => entry.email));
    } catch (error) {
      console.error('Error fetching emails', error);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const deleteFacultyrecord = async (facultyId, publicationId) => {
    try {
      await axios.delete(`http://localhost:3001/facultyrecord/${facultyId}/publication/${publicationId}`);
      fetchFaculties();
    } catch (err) {
      setError('Failed to delete publication. Please try again later.');
    }
  };

  const deleteFaculty = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/dltfaculty/${id}`);
      fetchFaculties();
      fetchEmails();
    } catch (err) {
      setError('Failed to delete faculty. Please try again later.');
    }
  };

  const toggleFacultyVisibility = (facultyId) => {
    setFacultyVisibility((prev) => ({
      ...prev,
      [facultyId]: !prev[facultyId],
    }));
  };

  const fetchRoutines = async () => {
    try {
      const response = await axios.get('http://localhost:3001/fetchroutines');
      setRoutines(response.data);
    } catch (err) {
      setRoutinesError('Failed to load routines. Please try again later.');
    }
  };

  useEffect(() => {
    fetchRoutines();
  }, []);

  const deleteRoutine = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/routine/${id}`);
      fetchRoutines();
    } catch (err) {
      console.log('Failed to delete routine. Please try again later.');
    }
  };

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

  const handleEventSubmit = (e) => {
    e.preventDefault();
    setEventSuccessMessage('');

    const data = {
      eventName,
      eventDay,
      eventMonth
    };

    axios.post('http://localhost:3001/event', data)
      .then(response => {
        setEventSuccessMessage('Event added successfully');
        axios.get('http://localhost:3001/fetchEvent')
          .then(response => {
            setEvents(response.data);
            resetEventForm();
          });
      })
      .catch(error => {
        setEventError('Error submitting events:', error);
      });
  };

  const resetEventForm = () => {
    setEventName('');
    setEventDay('');
    setEventMonth('');
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:3001/fetchEvent');
      setEvents(response.data);
    } catch (err) {
      setEventFetchError('Failed to load events. Please try again later.');
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const month = {
    '1': 'Jan',
    '2': 'Feb',
    '3': 'Mar',
    '4': 'Apr',
    '5': 'May',
    '6': 'Jun',
    '7': 'Jul',
    '8': 'Aug',
    '9': 'Sep',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dec',
  };

  const deleteEvent = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/events/${id}`);
      fetchEvents();
    } catch (err) {
      setError('Failed to delete event. Please try again later.');
    }
  };

  const totalPages = Math.ceil(notices.length / noticesPerPage);
  const startIndex = (currentPage - 1) * noticesPerPage;
  const currentNotices = notices
    .sort((a, b) => b._id.localeCompare(a._id))
    .slice(startIndex, startIndex + noticesPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    const fetchRevents = async () => {
      try {
        const response = await axios.get('http://localhost:3001/fetchrevents');
        setRevents(response.data);
      } catch (err) {
        setReventError('Failed to load recent events. Please try again later.');
      }
    };

    fetchRevents();
  }, []);

  const deleteRevent = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/revents/${id}`);
      setRevents(revents.filter(revent => revent._id !== id));
    } catch (err) {
      setReventError('Failed to delete recent event. Please try again later.');
    }
  };

  return (
    <div>
      <Header />
      <ProtectedRoute allowedRoles={['admin']} />
      <div style={{ background: "linear-gradient(120deg,#AB7442, #ffffff)" }}>
        <div className="container">
          <div className="row py-sm-5">
            <div className="col-4">
              <Signup />
            </div>
            <div className="col-4">
              <AddOwl />
              <div className="m-2"></div>
              <AddPic />
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
              <div className='w-100 p-3 rounded bg-white mt-2'>
                <SearchStudent />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row m-2">
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
          {marksData && marksData.batch ? (
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
      <div>
        <div className="row mb-3 p-3">
          <div className="col-6 float-start">
            <div className="ms-xxl-1 me-xxl-1 bg-white p-3 mb-xxl-2 bg-dark bg-opacity-10">
              <div className="heading-sect">
                <h3 className="m-0 p-0 fs-6 fw-semibold">Recent Events</h3>
              </div>
              <div>
                <ul className="latest-news-ul">
                  {reventError ? (
                    <li>{reventError}</li>
                  ) : (
                    revents
                      .sort((a, b) => b._id.localeCompare(a._id))
                      .map((revent) => (
                        <li key={revent._id}>
                          <a
                            className={revent.file ? 'text-black text-decoration-underline' : 'text-black'}
                            href={revent.file ? `http://localhost:3001/public/reventfile/${revent.file}` : '#'}>
                            {revent.revent + " "}
                          </a>
                          <button className='btn btn-secondary rounded-3 btn-sm ms-auto' onClick={() => deleteRevent(revent._id)}>Delete</button>
                        </li>
                      ))
                  )}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-6">
            <AddRecentEvents revents={revents} setRevents={setRevents} />
          </div>
        </div>
        <div className="row mb-3 p-3 bg-dark bg-opacity-10">
          <div className="col-6 float-start">
            <div className="ms-xxl-1 me-xxl-1 bg-white p-3 mb-xxl-2 bg-dark bg-opacity-10">
              <div className="heading-sect">
                <h3 className="m-0 p-0 fs-6 fw-semibold">Notices</h3>
              </div>
              <div>
                <ul className="latest-news-ul">
                  {error ? (
                    <li>{error}</li>
                  ) : (
                    currentNotices
                      .map((notice) => (
                        <li key={notice._id}>
                          <a
                            className={notice.file ? 'text-black text-decoration-underline' : 'text-black'}
                            href={notice.file ? `http://localhost:3001/public/noticefile/${notice.file}` : '#'}>
                            {notice.notice + " "}
                          </a>
                          <button className='btn btn-secondary rounded-3 btn-sm ms-auto' onClick={() => deleteNotice(notice._id)}>Delete</button>
                        </li>
                      ))
                  )}
                </ul>
                <div className="text-center mt-3">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="btn btn-primary mx-2"
                  >
                    &larr; Previous
                  </button>
                  <span className="page-info">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="btn btn-primary mx-2"
                  >
                    Next &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-6">
            <AddNotice notices={notices} setNotices={setNotices} />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-6">
            <div className="ms-xxl-1 me-xxl-1 bg-white p-3 mb-xxl-2" style={{ height: "350px" }}>
              <div className="heading-sect">
                <h3 className="m-0 p-0 fs-6 fw-semibold">Upcoming Events</h3>
              </div>
              <ul className="upcoming-event-list">
                {eventFetchError ? (
                  <li>{eventFetchError}</li>
                ) : (
                  events
                    .map((event) => (
                      <li key={event._id}>
                        <span className="event-date">
                          {event.eventDay} <br />
                          {month[event.eventMonth]}</span>
                        <span>
                          {event.eventName}
                          <i className="fa-solid fa-trash" onClick={() => deleteEvent(event._id)} style={{ cursor: 'pointer' }}></i>
                        </span>
                      </li>
                    ))
                )}
              </ul>
            </div>
          </div>
          <div className="col-6">
            <div className="section-title text-start">
              <h3 className="mb-3 mt-4">Add Upcoming Event</h3>
              <form onSubmit={handleEventSubmit}>
                <div className="row g-3">
                  <div className="col-12">
                    <div className='mb-2'>
                      <label htmlFor="event name">Enter Event Name</label>
                      <input
                        type="text"
                        placeholder='Event Name'
                        className='form-control'
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                      />
                    </div>
                    <div className="mb-2">
                      <label htmlFor="day">Enter Event Day</label>
                      <input
                        type="number" id="day" name="day" min="1" max="31" placeholder="DD"
                        className='form-control'
                        value={eventDay}
                        onChange={(e) => setEventDay(e.target.value)}
                      />
                      <div className="mb-2">
                        <label htmlFor="month">Enter Event Month</label>
                        <select id="month" name="month"
                          className='form-control'
                          value={eventMonth}
                          onChange={(e) => setEventMonth(e.target.value)}>
                          <option value="">Select Month</option>
                          <option value="1">January</option>
                          <option value="2">February</option>
                          <option value="3">March</option>
                          <option value="4">April</option>
                          <option value="5">May</option>
                          <option value="6">June</option>
                          <option value="7">July</option>
                          <option value="8">August</option>
                          <option value="9">September</option>
                          <option value="10">October</option>
                          <option value="11">November</option>
                          <option value="12">December</option>
                        </select>
                      </div>
                      {eventSuccessMessage && <p className="text-success">{eventSuccessMessage}</p>}
                    </div>
                  </div>
                  <div className="col-12">
                    <button className='btn btn-primary w-100 py-3' type="submit">
                      Add
                    </button>
                  </div>
                </div>
              </form>
              {eventError && <div className="alert alert-danger mt-3">{eventError}</div>}
            </div>
          </div>
        </div>
        <div className="row mb-3 p-3 bg-dark bg-opacity-10">
          <div className="col-6">
            <div className="ms-xxl-1 me-xxl-1 bg-white p-3 mb-xxl-2 bg-dark bg-opacity-10">
              <div className="heading-sect">
                <h3 className="m-0 p-0 fs-6 fw-semibold">Routines</h3>
              </div>
              <div>
                <ul className="latest-news-ul">
                  {routinesError ? (
                    <li>{routinesError}</li>
                  ) : (
                    routines
                      .map((routine) => (
                        <li key={routine._id}>
                          <a
                            className='text-black text-decoration-underline'
                            href={`http://localhost:3001/public/routine/file/${routine.file1}`}
                          >
                            {routine.dest} Routine
                          </a>
                          {/* <button className='btn btn-secondary rounded-3 btn-sm ms-auto' >Delete</button> */}
                          <i className="fa-solid fa-trash" onClick={() => deleteRoutine(routine._id)} style={{ cursor: 'pointer' }}></i>
                        </li>
                      ))
                  )}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-6">
            <AddRoutine setRoutines={setRoutines} />
          </div>
        </div>
      </div>
      <div className="row m-3">
        <div className="col-12 p-3">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="text-decoration-underline">Contact Messages</h3>
              <button
                className="btn btn-primary"
                onClick={() => fetchContacts()}
              >
                Refresh
              </button>
            </div>
            {contactError ? (
              <p>Error getting contacts.</p>
            ) : (
              contacts.length === 0 ? (
                <p>No messages available.</p>
              ) : (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th style={{ width: "15%" }}>Name</th>
                      <th style={{ width: "15%" }}>Email</th>
                      <th style={{ width: "20%" }}>Subject</th>
                      <th style={{ width: "45%" }}>Message</th>
                      <th style={{ width: "5%" }}>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((contact) => (
                      <tr key={contact._id}>
                        <td>{contact.name}</td>
                        <td>{contact.email}</td>
                        <td>{contact.subject}</td>
                        <td>{contact.message}</td>
                        <td>
                          <button
                            className='btn btn-secondary rounded-3 btn-sm ms-auto'
                            onClick={() => deleteMessage(contact._id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            )}
          </div>
        </div>
      </div>
      <div className="row">
        <h2 className='text-center text-decoration-underline bg-primary py-sm-2 text-white'>Faculty Details</h2>
        <div className="col-4">
          <div className='w-100 p-4 rounded bg-white'>
            <form onSubmit={handleSubmit}>
              <h5 className='text-center'>Faculty Details Update</h5>
              <div className='mb-2'>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  placeholder='Enter Name'
                  className='form-control'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {/* {formErrors.name && <p className="text-danger">{formErrors.name}</p>} */}
              </div>
              <div className='mb-2'>
                <label htmlFor="email">Email</label>
                <div>
                  <select
                    className='form-control'
                    value={selectedEmail}
                    onChange={(e) => {
                      setSelectedEmail(e.target.value);
                      if (e.target.value === 'other') {
                        setEmail('');
                      } else {
                        setEmail(e.target.value);
                      }
                    }
                    }
                  >
                    <option value="">Select an existing email</option>
                    {emails.map((emailOption, index) => (
                      <option key={index} value={emailOption}>{emailOption}</option>
                    ))}
                    <option value="other">Other (Enter a new email)</option>
                  </select>
                </div>
                {selectedEmail === 'other' && (
                  <input
                    type="email"
                    placeholder='Enter Email'
                    className='form-control mt-2'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                )}
                {formErrors.email && <p className="text-danger">{formErrors.email}</p>}
              </div>
              <div className='mb-2'>
                <label htmlFor="number">Number</label>
                <input
                  type="text"
                  placeholder='Enter Number'
                  className='form-control'
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                />
                {/* {formErrors.number && <p className="text-danger">{formErrors.number}</p>} */}
              </div>
              <div className='mb-2'>
                <label htmlFor="number">Facebook Link</label>
                <input
                  type="text"
                  placeholder='Enter Facebook Link'
                  className='form-control'
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                />
                {/* {formErrors.number && <p className="text-danger">{formErrors.number}</p>} */}
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
                {/* {formErrors.number && <p className="text-danger">{formErrors.number}</p>} */}
              </div>
              <div className='mb-2'>
                <label htmlFor="desig">Designation</label>
                <select
                  className='form-control'
                  value={desig}
                  onChange={(e) => setDesig(e.target.value)}
                >
                  <option value="">Select Designation</option>
                  <option value="1">Professor</option>
                  <option value="2">Associate Professor</option>
                  <option value="3">Assistant Professor</option>
                  <option value="4">Lecturer</option>
                </select>
                {/* {formErrors.desig && <p className="text-danger">{formErrors.desig}</p>} */}
              </div>
              <div className="form-floating mb-2">
                <textarea
                  className="form-control"
                  placeholder="Field of Interest"
                  id="foi"
                  style={{ height: '20px' }}
                  value={foi}
                  onChange={(e) => setFoi(e.target.value)}
                />
                <label htmlFor="foi">Field of Interest</label>
              </div>
              <div className="form-floating mb-2">
                <textarea
                  className="form-control"
                  placeholder="Qualification"
                  id="quili"
                  style={{ height: '20px' }}
                  value={quali}
                  onChange={(e) => setQuali(e.target.value)}
                />
                <div className='mb-2'>
                  <label htmlFor="photo">Upload Photo</label>
                  <input
                    type="file"
                    className='form-control'
                    onChange={handlePhotoChange}
                  />
                </div>
                <label htmlFor="quali">Qualification</label>
              </div>
              <div className="fw-bolder pt-3">Publications</div>
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
            {faculties.map((faculty, index) => (
              <div key={index}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4
                    className="text-decoration-underline m-0 p-0"
                    onClick={() => toggleFacultyVisibility(faculty._id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {faculty.name}
                  </h4>
                  <div>
                    <button
                      className="btn btn-primary m-1"
                      onClick={() => deleteFaculty(faculty._id)}
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-primary m-1"
                      onClick={() => fetchFaculties()}
                    >
                      Refresh
                    </button>
                  </div>
                </div>
                {facultyVisibility[faculty._id] && (
                  <div>
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
                        {faculty.publications.map((publication, idx) => (
                          <tr key={idx}>
                            <td>{publication.sn}</td>
                            <td>{publication.title}</td>
                            <td>{publication.authors}</td>
                            <td>{publication.info}</td>
                            <td>{publication.year}</td>
                            <td>
                              <button
                                className='btn btn-secondary rounded-3 btn-sm ms-auto'
                                onClick={() => deleteFacultyrecord(faculty._id, publication._id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
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

export default Admin;
