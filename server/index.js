const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const StudentModel = require('./models/student');
const setupTransporter = require('./emailConfig');
const MarksModel = require("./models/marks");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const NoticeModel = require("./models/notice");
const ContactModel = require("./models/contact");
const FacultyModel = require("./models/faculty");
const OwlModel = require("./models/owllink");
const PicModel = require("./models/piclib");
const RoutineModel = require("./models/routine");
const EventModel = require("./models/events");
const ReventModel = require("./models/revent");
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true
}));

const uri = process.env.MONGO_URI;

mongoose.connect(uri)
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    let fileName;
    fileName = `${req.body.email}${ext}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

app.post('/register', upload.single('photo'), async (req, res) => {
  const { name, email, password, id, role, batch, desig } = req.body;
  const photo = req.file ? req.file.filename : null;

  try {
    const existingUser = await StudentModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new StudentModel({ name, email, password: hashedPassword, id, role, batch, desig, photo });
    const savedUser = await newUser.save();

    const token = jwt.sign({ email, role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ user: savedUser, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.use('/uploads', express.static('uploads'));

app.get('/user-photo/:email', (req, res) => {
  const email = req.params.email;
  const possibleExtensions = ['jpeg', 'jpg', 'png'];

  const photoPath = possibleExtensions
    .map(ext => path.join(__dirname, 'public/images', `${email}.${ext}`))
    .find(filePath => fs.existsSync(filePath));

  if (photoPath) {
    res.sendFile(photoPath);
  } else {
    res.status(404).send('Photo not found');
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await StudentModel.findOne({ email });
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const token = jwt.sign({ email, role: user.role, id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: "Success", role: user.role, id: user.id, email: user.email, token });
      } else {
        res.status(400).json({ message: "The password is incorrect" });
      }
    } else {
      res.status(400).json({ message: "No record existed" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.status(200).json({ message: "Logged out successfully" });
});

// Forget password part
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await StudentModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 600000; // Token valid for 1 hour
    await user.save();

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    // Get the transporter and send the email
    const transporter = await setupTransporter();
    await transporter.sendMail({
      to: email,
      subject: 'Password Reset Request',
      text: `Please use the following link to reset your password: ${resetLink}
      
Best regards,
Dept. of Electronics and Telecommunication Engineering, CUET.`,
    });

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to handle resetting the password
app.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await StudentModel.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Student data retrieve
app.get('/studentdata/:id', async (req, res) => {
  const studentId = req.params.id;
  try {
    const student = await StudentModel.findOne({ id: studentId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ name: student.name, email: student.email, id: student.id, batch: student.batch });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Teacher data retrieve
app.get('/teacherdata/:email', async (req, res) => {
  const email = req.params.email;
  try {
    const teacher = await StudentModel.findOne({ email });
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Mark submission
app.post('/submitMarks', async (req, res) => {
  const { batch, term, course, courseCrdt, courseTyp, exam, studentId, marks, teacherEmail } = req.body;

  try {
    // Ensure batch document exists
    let batchDoc = await MarksModel.findOneAndUpdate(
      { batchYear: batch },
      { $setOnInsert: { batchYear: batch, students: [] } },
      { new: true, upsert: true }
    );

    // Find or create student entry
    let student = batchDoc.students.find(s => s.studentId === studentId);
    if (!student) {
      student = { studentId: studentId, terms: [] };
      batchDoc.students.push(student);
      await batchDoc.save(); // Save to ensure nested document structure
    }

    // Retrieve updated batchDoc with student included
    batchDoc = await MarksModel.findOne({ batchYear: batch });
    student = batchDoc.students.find(s => s.studentId === studentId);

    // Find or create term entry
    let semester = student.terms.find(t => t.term === term);
    if (!semester) {
      semester = { term: term, courses: [] };
      student.terms.push(semester);
      await batchDoc.save(); // Save to ensure nested document structure
    }

    // Retrieve updated batchDoc with student included
    batchDoc = await MarksModel.findOne({ batchYear: batch });
    student = batchDoc.students.find(s => s.studentId === studentId);
    semester = student.terms.find(t => t.term === term);

    // Find or create course entry
    let courseEntry = semester.courses.find(c => c.courseCode === course);
    if (!courseEntry) {
      courseEntry = { courseCode: course, courseCredit: courseCrdt, courseType: courseTyp, exams: [] };
      semester.courses.push(courseEntry);
      await batchDoc.save(); // Save to ensure nested document structure
    }

    // Retrieve updated batchDoc with course included
    batchDoc = await MarksModel.findOne({ batchYear: batch });
    student = batchDoc.students.find(s => s.studentId === studentId);
    semester = student.terms.find(t => t.term === term);
    courseEntry = semester.courses.find(c => c.courseCode === course);

    // Find or create exam entry
    let examEntry = courseEntry.exams.find(e => e.examType === exam);
    if (!examEntry) {
      examEntry = { examType: exam, marks: [] };
      courseEntry.exams.push(examEntry);
      await batchDoc.save(); // Save to ensure nested document structure
    }

    // Retrieve updated batchDoc with exam included
    batchDoc = await MarksModel.findOne({ batchYear: batch });
    student = batchDoc.students.find(s => s.studentId === studentId);
    semester = student.terms.find(t => t.term === term);
    courseEntry = semester.courses.find(c => c.courseCode === course);
    examEntry = courseEntry.exams.find(e => e.examType === exam);

    // Clear existing marks
    examEntry.marks = [];

    // Add the new marks entry
    examEntry.marks.push({ marks, teacherEmail });

    // Save the updated batch document
    await batchDoc.save();

    res.status(200).json({ message: 'Marks submitted successfully' });
  } catch (error) {
    console.error('Error submitting marks:', error);
    res.status(500).json({ message: 'Error submitting marks' });
  }
});




// Fetch student marks by studentId
app.get('/studentMarks/:id', async (req, res) => {
  const studentId = req.params.id;
  try {
    const studentMarks = await MarksModel.findOne({ 'students.studentId': studentId }, { 'students.$': 1 });
    if (!studentMarks) {
      return res.status(404).json({ message: 'Marks not found for the student' });
    }
    res.json(studentMarks.students[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


app.get('/getMarksByCourse', async (req, res) => {
  try {
    const marksData = await MarksModel.find({});
    if (!marksData || marksData.length === 0) {
      return res.status(404).json({ message: 'No marks data found' });
    }

    const batchData = [];

    marksData.forEach(batch => {
      const batchObj = {
        batchName: batch.batchYear,
        terms: []
      };

      batch.students.forEach(student => {
        student.terms.forEach(term => {
          let termObj = batchObj.terms.find(t => t.term === term.term);
          if (!termObj) {
            termObj = {
              term: term.term,
              courses: []
            };
            batchObj.terms.push(termObj);
          }

          term.courses.forEach(course => {
            let courseObj = termObj.courses.find(c => c.courseCode === course.courseCode);
            if (!courseObj) {
              courseObj = {
                courseCode: course.courseCode,
                students: []
              };
              termObj.courses.push(courseObj);
            }

            let studentObj = courseObj.students.find(s => s.studentId === student.studentId);
            if (!studentObj) {
              studentObj = {
                studentId: student.studentId,
                courseCredit: course.courseCredit || "",
                courseType: course.courseType || "",
                exams: []
              };
              courseObj.students.push(studentObj);
            }

            course.exams.forEach(exam => {
              const examObj = {
                examType: exam.examType,
                marks: exam.marks.map(m => m.marks).join(', ')
              };
              studentObj.exams.push(examObj);
            });
          });
        });
      });

      batchData.push(batchObj);
    });

    res.json({ batch: batchData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




const storages = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/noticefile');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const uploads = multer({ storage: storages });

app.use('/public', express.static('public'));

app.post('/addnotice', uploads.single('file'), async (req, res) => {
  const { notice } = req.body;
  const file = req.file ? req.file.filename : null;

  try {
    const newNotice = new NoticeModel({ notice, file: file });
    const savedNotice = await newNotice.save();
    res.status(201).json({ notice: savedNotice });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.use('/public/noticefile', express.static(path.join(__dirname, 'public/noticefile')));

app.get('/fetchnotices', async (req, res) => {
  try {
    const notices = await NoticeModel.find({});
    res.status(200).json(notices);
  } catch (error) {
    console.error('Error fetching notices:', error);
    res.status(500).json({ message: 'Failed to retrieve notices.' });
  }
});

app.delete('/notices/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const notice = await NoticeModel.findById(id);

    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    // Delete the associated file
    if (notice.file) {
      const filePath = path.join(__dirname, 'public/noticefile', notice.file);
      // console.log('Attempting to delete file:', filePath);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Failed to delete file:', err);
        }
      });
    }

    // Delete the notice from the database
    await NoticeModel.findByIdAndDelete(id);

    res.status(200).json({ message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// contact
app.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    const newMessage = new ContactModel({ name, email, subject, message });
    const savedMessage = await newMessage.save();

    const emailMessage = `
Hi ${name},
   
Thank you for reaching out to us regarding "${subject}".
We have received your message and will get back to you if further communication is needed.

Here is a copy of your message:
"${message}"

Best regards,
Dept. of Electronics and Telecommunication Engineering, CUET.
`;

    const transporter = await setupTransporter();
    await transporter.sendMail({
      to: email,
      subject: 'We have received your message',
      text: emailMessage,
    });

    res.status(201).json({ contact: savedMessage, message: 'Message sent successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/fetchcontacts', async (req, res) => {
  try {
    const contacts = await ContactModel.find({});
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve contacts.' });
  }
});

app.delete('/contacts/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const contact = await ContactModel.findById(id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    await ContactModel.findByIdAndDelete(id);

    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Multer setup

const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/teacherimage');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    let fileName;
    fileName = `${req.body.email}${ext}`;
    cb(null, fileName);
  }
});

const upload2 = multer({ storage: storage2 });

app.post('/facultydetails', upload2.single('photo'), async (req, res) => {
  const { name, email, number, facebook, linkedin, desig, foi, quali, title, authors, info, year } = req.body;
  const photo = req.file ? req.file.filename : null;
  try {
    const existingUser = await FacultyModel.findOne({ email });

    if (!existingUser) {
      const newUser = new FacultyModel({
        name,
        email,
        number,
        facebook,
        linkedin,
        desig,
        foi,
        quali,
        photo,
        publications: [{
          sn: 1,
          title,
          authors,
          info,
          year
        }]
      });
      const savedUser = await newUser.save();
      res.status(201).json({ user: savedUser });
    } else {
      const newPublication = {
        sn: existingUser.publications.length + 1,
        title,
        authors,
        info,
        year
      };

      if (name) {
        existingUser.name = name;
      }
      if (number) {
        existingUser.number = number;
      }
      if (facebook) {
        existingUser.facebook = facebook;
      }
      if (linkedin) {
        existingUser.linkedin = linkedin;
      }
      if (desig) {
        existingUser.desig = desig;
      }
      if (foi) {
        existingUser.foi = foi;
      }
      if (quali) {
        existingUser.quali = quali;
      }
      if (photo) {
        existingUser.photo = photo || existingUser.photo;
      }
      // if (publications){
      existingUser.publications.push(newPublication);
      // }

      const updatedUser = await existingUser.save();
      res.status(200).json({ user: updatedUser });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.use('/uploads', express.static('uploads'));

app.get('/teacher-photo/:email', (req, res) => {
  const email = req.params.email;
  const possibleExtensions = ['jpeg', 'jpg', 'png'];

  const photoPath = possibleExtensions
    .map(ext => path.join(__dirname, 'public/teacherimage', `${email}.${ext}`))
    .find(filePath => fs.existsSync(filePath));

  if (photoPath) {
    res.sendFile(photoPath);
  } else {
    res.status(404).send('Photo not found');
  }
});

app.get('/faculties', async (req, res) => {
  try {
    const faculties = await FacultyModel.find();
    res.status(200).json(faculties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/emails', async (req, res) => {
  try {
    const emails = await FacultyModel.find().select('email -_id');
    res.status(200).json(emails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/facultyrecord/:facultyId/publication/:publicationId', async (req, res) => {
  const { facultyId, publicationId } = req.params;


  try {
    const updatedFaculty = await FacultyModel.findByIdAndUpdate(
      facultyId,
      { $pull: { publications: { _id: publicationId } } },
      { new: true }
    );

    if (!updatedFaculty) {
      return res.status(404).json({ message: 'Faculty record not found' });
    }

    res.status(200).json({ message: 'Publication deleted successfully', updatedFaculty });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/dltfaculty/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const faculty = await FacultyModel.findById(id);

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    await FacultyModel.findByIdAndDelete(id);

    res.status(200).json({ message: 'Faculty deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/faculty/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const faculty = await FacultyModel.findOne({ email });
    res.status(200).json(faculty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const storage3 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/owlimage');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload3 = multer({ storage: storage3 });

app.use('/public', express.static('public'));

app.post('/addowl', upload3.single('file'), async (req, res) => {
  const file = req.file ? req.file.filename : null;

  try {
    const newOwl = new OwlModel({ file: file });
    const savedOwl = await newOwl.save();
    res.status(201).json({ message: "Success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/fetchowls', async (req, res) => {
  try {
    const owl = await OwlModel.find({});
    res.status(200).json(owl);
  } catch (error) {
    console.error('Error fetching owls:', error);
    res.status(500).json({ message: 'Failed to retrieve owls.' });
  }
});

app.use('/public/owlimage', express.static(path.join(__dirname, 'public/owlimage')));

app.get('/owl-photo/:file', (req, res) => {
  const fileName = req.params.file;
  const photoPath = path.join(__dirname, 'public/owlimage', fileName);

  if (fs.existsSync(photoPath)) {
    res.sendFile(photoPath);
  } else {
    res.status(404).send('Photo not found');
  }
});

app.delete('/owls/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const owl = await OwlModel.findById(id);

    if (!owl) {
      return res.status(404).json({ message: 'Picture not found' });
    }

    // Delete the associated file
    if (owl.file) {
      const filePath = path.join(__dirname, 'public/owlimage', owl.file);
      // console.log('Attempting to delete file:', filePath);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Failed to delete file:', err);
        }
      });
    }

    await OwlModel.findByIdAndDelete(id);

    res.status(200).json({ message: 'Owl deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const storage4 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/piclib');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload4 = multer({ storage: storage4 });

app.use('/public', express.static('public'));

app.post('/addpic', upload4.single('file'), async (req, res) => {
  const { name, filter } = req.body;
  const file = req.file ? req.file.filename : null;

  try {
    const newPic = new PicModel({ file: file, name, filter });
    const savedPic = await newPic.save();
    res.status(201).json({ message: "Success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/fetchpics', async (req, res) => {
  try {
    const pics = await PicModel.find({});
    res.status(200).json(pics);
  } catch (error) {
    console.error('Error fetching pics:', error);
    res.status(500).json({ message: 'Failed to retrieve pics.' });
  }
});

app.use('/public/piclib', express.static(path.join(__dirname, 'public/piclib')));

app.delete('/pics/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const pic = await PicModel.findById(id);

    if (!pic) {
      return res.status(404).json({ message: 'Picture not found' });
    }

    // Delete the associated file
    if (pic.file) {
      const filePath = path.join(__dirname, 'public/piclib', pic.file);
      // console.log('Attempting to delete file:', filePath);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Failed to delete file:', err);
        }
      });
    }

    await PicModel.findByIdAndDelete(id);

    res.status(200).json({ message: 'Pic deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const storageFile = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'file1') {
      cb(null, 'public/routine/file');
    } else if (file.fieldname === 'file2') {
      cb(null, 'public/routine/image');
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload5 = multer({ storage: storageFile });

app.use('/public', express.static('public'));

app.post('/addroutine', upload5.fields([{ name: 'file1', maxCount: 1 }, { name: 'file2', maxCount: 1 }]), async (req, res) => {
  const { dest } = req.body;
  const file1 = req.files['file1'] ? req.files['file1'][0].filename : null;
  const file2 = req.files['file2'] ? req.files['file2'][0].filename : null;

  try {
    const newRoutine = new RoutineModel({ file1, file2, dest });
    const savedRoutine = await newRoutine.save();
    res.status(201).json({ message: "Success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/fetchroutine/:dest', async (req, res) => {
  try {
    const dest = req.params.dest;
    const routine = await RoutineModel.findOne({ dest });
    res.status(200).json(routine);
  } catch (error) {
    console.error('Error fetching routine:', error);
    res.status(500).json({ message: 'Failed to retrieve routine.' });
  }
});

app.use('/public/routine/file', express.static(path.join(__dirname, 'public/routine/file')));
app.use('/public/routine/image', express.static(path.join(__dirname, 'public/routine/image')));

app.get('/fetchroutines', async (req, res) => {
  try {
    const routines = await RoutineModel.find({});
    res.status(200).json(routines);
  } catch (error) {
    console.error('Error fetching routines:', error);
    res.status(500).json({ message: 'Failed to retrieve routines.' });
  }
});

app.delete('/routine/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const routine = await RoutineModel.findById(id);

    if (!routine) {
      return res.status(404).json({ message: 'Routine not found' });
    }

    // Delete the associated file
    if (routine.file1) {
      const filePath1 = path.join(__dirname, 'public/routine/file', routine.file1);
      // console.log('Attempting to delete file:', filePath1);
      fs.unlink(filePath1, (err) => {
        if (err) {
          console.error('Failed to delete routine file:', err);
        }
      });
    }

    if (routine.file2) {
      const filePath2 = path.join(__dirname, 'public/routine/image', routine.file2);
      // console.log('Attempting to delete file:', filePath2);
      fs.unlink(filePath2, (err) => {
        if (err) {
          console.error('Failed to delete routine image:', err);
        }
      });
    }

    await RoutineModel.findByIdAndDelete(id);

    res.status(200).json({ message: 'Routine deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/searchStudent/:studentId', async (req, res) => {
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
});

app.post('/event', async (req, res) => {
  const { eventName, eventDay, eventMonth } = req.body;

  try {
    const newEvent = new EventModel({ eventName, eventDay, eventMonth });
    const savedEvent = await newEvent.save();
    res.status(201).json({ Event: savedEvent });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/fetchEvent', async (req, res) => {
  try {
    const events = await EventModel.find({});
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Failed to retrieve events.' });
  }
});

app.delete('/events/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const event = await EventModel.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await EventModel.findByIdAndDelete(id);

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const storage6 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/reventfile');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload6 = multer({ storage: storage6 });

app.use('/public', express.static('public'));

app.post('/addrevent', upload6.single('file'), async (req, res) => {
  const { revent } = req.body;
  const file = req.file ? req.file.filename : null;

  try {
    const newRevent = new ReventModel({ revent, file: file });
    const savedRevent = await newRevent.save();
    res.status(201).json({ revent: savedRevent });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error.message);
  }
});

app.use('/public/reventfile', express.static(path.join(__dirname, 'public/reventfile')));

app.get('/fetchrevents', async (req, res) => {
  try {
    const revents = await ReventModel.find({});
    res.status(200).json(revents);
  } catch (error) {
    console.error('Error fetching recent events:', error);
    res.status(500).json({ message: 'Failed to retrieve recent events.' });
  }
});

app.delete('/revents/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const revent = await ReventModel.findById(id);

    if (!revent) {
      return res.status(404).json({ message: 'Recent event not found' });
    }

    // Delete the associated file
    if (revent.file) {
      const filePath = path.join(__dirname, 'public/reventfile', revent.file);
      // console.log('Attempting to delete file:', filePath);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Failed to delete file:', err);
        }
      });
    }

    // Delete the notice from the database
    await ReventModel.findByIdAndDelete(id);

    res.status(200).json({ message: 'Recent event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Define port and start server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
