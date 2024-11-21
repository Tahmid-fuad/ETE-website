import { Link, useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import axios from 'axios';

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [batch, setBatch] = useState('');
    const [desig, setDesig] = useState('');
    const [photo, setPhoto] = useState(null); 
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [serverError, setServerError] = useState('');

    const handlePhotoChange = (e) => {
        setPhoto(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validate(name, email, id, password, role, batch, desig);
        setFormErrors(errors);
        setIsSubmit(true);

        if (Object.keys(errors).length === 0) {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('id', id);
            formData.append('role', role);
            formData.append('batch', batch);
            formData.append('desig', desig);
            formData.append('photo', photo);

            axios.post('http://localhost:3001/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then(result => {
                    const { token, user } = result.data;
                    localStorage.setItem('token', token);
                    localStorage.setItem('role', user.role);
                    resetForm();
                    // navigate('/login');
                })
                .catch(err => {
                    if (err.response && err.response.status === 400) {
                        setServerError("Email already registered");
                    } else {
                        setServerError("An error occurred. Please try again.");
                    }
                });
        }
    };

    const validate = (name, email, id, password, role, batch, desig) => {
        const errors = {};
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if (!name) {
            errors.name = "Username is required";
        }
        if (!email) {
            errors.email = "Email is required";
        } else if (!regex.test(email)) {
            errors.email = "This is not a valid email format";
        }
        if (role === 'student' && !id) {
            errors.id = "Student ID is required";
        } else if (role === 'student' && id.length !== 7) {
            errors.id = "ID must be 7 characters long";
        }
        if (!password) {
            errors.password = "Password is required";
        } else if (password.length < 6) {
            errors.password = "Password must be at least 6 characters long";
        }
        if (!role) {
            errors.role = "Role is required";
        }
        if (role === 'student' && !batch) {
            errors.batch = "Batch is required";
        }
        if (role === 'teacher' && !desig) {
            errors.desig = "Designation is required";
        }
        return errors;
    };

    const resetForm = () => {
        setName('');
        setEmail('');
        setId('');
        setPassword('');
        setRole('');
        setBatch('');
        setDesig('');
        setPhoto(null); 
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset file input
        }
    };

    return (
        <div>
            {/* <Header /> */}
            {/* <div className='signup template d-flex justify-content-center align-items-center vh-100' style={{ background: "linear-gradient(120deg,#AB7442, #ffffff)" }}> */}
            <div className='w-100 p-4 rounded bg-white'>
                <form onSubmit={handleSubmit}>
                    <h5 className='text-center'>Sign Up</h5>
                    <div className='mb-2'>
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            placeholder='Enter Name'
                            className='form-control'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {formErrors.name && <p className="text-danger">{formErrors.name}</p>}
                    </div>
                    <div className='mb-2'>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            placeholder='Enter Email'
                            className='form-control'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {formErrors.email && <p className="text-danger">{formErrors.email}</p>}
                    </div>
                    <div className='mb-2'>
                        <label htmlFor="role">Role</label>
                        <select
                            className='form-control'
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="">Select Role</option>
                            <option value="admin">Admin</option>
                            <option value="teacher">Teacher</option>
                            <option value="student">Student</option>
                        </select>
                        {formErrors.role && <p className="text-danger">{formErrors.role}</p>}
                    </div>
                    {role === 'student' && (
                        <>
                            <div className='mb-2'>
                                <label htmlFor="id">Student ID</label>
                                <input
                                    type="text"
                                    placeholder='Enter Student ID'
                                    className='form-control'
                                    value={id}
                                    onChange={(e) => setId(e.target.value)}
                                />
                                {formErrors.id && <p className="text-danger">{formErrors.id}</p>}
                            </div>
                            <div className='mb-2'>
                                <label htmlFor="batch">Batch</label>
                                <select
                                    className='form-control'
                                    value={batch}
                                    onChange={(e) => setBatch(e.target.value)}
                                >
                                    <option value="">Select Batch</option>
                                    <option value="19">19</option>
                                    <option value="20">20</option>
                                    <option value="21">21</option>
                                    <option value="22">22</option>
                                    <option value="23">23</option>
                                </select>
                                {formErrors.batch && <p className="text-danger">{formErrors.batch}</p>}
                            </div>
                        </>
                    )}
                    {role === 'teacher' && (
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
                            {formErrors.desig && <p className="text-danger">{formErrors.desig}</p>}
                        </div>
                    )}
                    <div className='mb-2'>
                        <label htmlFor="photo">Upload Photo</label>
                        <input
                            type="file"
                            className='form-control'
                            onChange={handlePhotoChange}
                        />
                    </div>
                    {serverError && <p className="text-danger">{serverError}</p>}
                    <div className='mb-2'>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            placeholder='Enter Password'
                            className='form-control'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {formErrors.password && <p className="text-danger">{formErrors.password}</p>}
                    </div>
                    <div className='d-grid'>
                        <button className='btn btn-primary mt-2'>Sign up</button>
                    </div>
                        {/* <p className='text-center mt-2'>
                            <Link to="/login" className='ms-2 mt-2'>Login</Link>
                        </p> */}
                </form>
            </div>
            {/* </div> */}
            {/* <Footer /> */}
        </div>
    );
}

export default Signup;
