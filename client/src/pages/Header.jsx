import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function Header() {
  const [HeaderText, setHeaderText] = useState('Home');
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const navigate = useNavigate();

  useEffect(() => {
    const path = window.location.pathname;
    setCurrentPath(path);
  }, []);

  const getNavLinkClass = (path) => {
    return `nav-item nav-link${currentPath === path ? " active" : ""}`;
  };

  const handleLogout = () => {
    axios.post('http://localhost:3001/logout', {}, { withCredentials: true })
      .then(() => {
        localStorage.removeItem('role');
        localStorage.removeItem('id');
        localStorage.removeItem('email');
        // localStorage.removeItem('token');
        navigate('/login');
      })
      .catch(err => {
        console.log(err);
      });
  };

  const getIcon = () => {
    return currentPath === '/login' ? "fa-arrow-down" : "fa-arrow-right";
  };

  let profile = '';
  switch (localStorage.getItem('role')) {
    case 'student':
      profile = '/student';
      break;
    case 'teacher':
      profile = '/teacher';
      break;
    case 'admin':
      profile = '/admin';
      break;
    default:
      profile = '/login';
      break;
  }

  return (
    <div>
      {/* Navbar Start */}
      <nav className="navbar navbar-expand-lg bg-white navbar-light sticky-top p-0">
        <a href="/" className="navbar-brand d-flex align-items-center px-4 px-lg-5">
          <img src="assets/ete logo black.png" alt="" style={{ height: "100%", width: "auto" }} />
        </a>
        <div className="navbar-nav ms-auto p-4 p-lg-0">
          <a href="/" className={getNavLinkClass("/")}>Home</a>
          <a href="/About" className={getNavLinkClass("/About")}>About</a>
          <a href="/faculties" className={getNavLinkClass("/faculties")}>Faculties</a>
          {/* <a href="https://alumni-ete-cuet.netlify.app/?fbclid=IwAR0HCp0F7QXw-GWn8Y3F_O574PxSl4XH7M_TFkXJ1yWGPM8cQ-c4IrA9_eY"
            className="nav-item nav-link">Alumni</a> */}
          <a href="/photo" className={getNavLinkClass("/photo")}>Photo Gallery</a>
          <a href={profile} className={getNavLinkClass(`/${localStorage.getItem('role')}`)}>My Profile</a>
          <div className="nav-item dropdown">
            <a href="#" className="nav-link dropdown-toggle">More</a>
            <div className="dropdown-menu fade-up m-0">
              {/* <a href="#" className="dropdown-item">Offered Degrees</a> */}
              <a href="/Notices" className="dropdown-item">Notices</a>
              <a href="https://alumni-ete-cuet.netlify.app/?fbclid=IwAR0HCp0F7QXw-GWn8Y3F_O574PxSl4XH7M_TFkXJ1yWGPM8cQ-c4IrA9_eY"
                className="dropdown-item">Alumni</a>
              <a href="/contact" className="dropdown-item">Contact</a>
            </div>
          </div>
        </div>
        {
          ['teacher', 'student', 'admin'].includes(localStorage.getItem('role')) ? (
            <button onClick={handleLogout} className="btn btn-primary py-4 px-lg-5 d-none d-lg-block">
              Logout
              <i className="fa fa-arrow-right ms-3"></i>
            </button>
          ) : (
            <a href="/login" className="btn btn-primary py-4 px-lg-5 d-none d-lg-block">
              Login
              <i className={`fa ${getIcon()} ms-3`}></i>
            </a>
          )
        }
      </nav>
      {/* Navbar End */}
    </div>
  );
}

export default Header;
