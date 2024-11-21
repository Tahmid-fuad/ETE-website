import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Faculties from './pages/Faculties';
import Photo from './pages/Photo';
import About from './pages/About';
import Admin from './pages/Admin';
import Teacher from './pages/Teacher';
import Student from './pages/Student';
import ProtectedRoute from './pages/ProtectedRoute';
import Error from './pages/Error';
import Contact from './pages/Contact';
import ForgetPassword from './pages/ForgetPassword';
import ResetPassword from './pages/ResetPassword';
import Faculty from './pages/Faculty';
import 'lightbox2/dist/css/lightbox.min.css';
import 'lightbox2';
import StudentDetails from './pages/StudentDetails';
import Notices from './pages/Notices';


function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/photo' element={<Photo />} />
          <Route path='/faculties' element={<Faculties />} />
          {/* <Route path='/signup' element={<Signup />} /> */}
          <Route path='/login' element={<Login />} />
          <Route path='/about' element={<About />} />
          <Route path='*' element={<Error />} />
          <Route path='/Contact' element={<Contact />} />
          <Route path='/forgot-password' element={<ForgetPassword />} />
          <Route path='/reset-password/:token' element={<ResetPassword />} />
          <Route path="/faculty/:email" element={<Faculty />} />
          <Route path="notices" element={<Notices />} />





          {/* Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path='/admin' element={<Admin />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
            <Route path='/teacher' element={<Teacher />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route path='/student' element={<Student />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['teacher', 'admin']} />}>
            <Route path="/profile/:studentId" element={<StudentDetails />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
