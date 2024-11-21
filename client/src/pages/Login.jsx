import Header from './Header';
import Footer from './Footer';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/login', { email, password })
            .then(result => {
                if (result.data.message === "Success") {
                    localStorage.setItem('role', result.data.role); 
                    localStorage.setItem('id', result.data.id); 
                    localStorage.setItem('email', result.data.email); 
                    if (result.data.role === 'admin') {
                        navigate('/admin');
                    } else if (result.data.role === 'teacher') {
                        navigate('/teacher');
                    } else if (result.data.role === 'student') {
                        navigate('/student');
                    }
                } else {
                    setErrorMessage(result.data.message); 
                }
            })
            .catch(err => {
                if (err.response && err.response.data && err.response.data.message) {
                    setErrorMessage(err.response.data.message); 
                } else {
                    setErrorMessage("An error occurred. Please try again."); 
                }
            });
    };

    return (
        <div>
            <Header />
            <div className='login template d-flex justify-content-center align-items-center 100-w vh-100' style={{ background: "linear-gradient(120deg,#AB7442, #ffffff)" }}>
                <div className='w-25 p-5 rounded bg-white'>
                    <form onSubmit={handleSubmit}>
                        <h3 className='text-center'>Log in</h3>
                        <div className='mb-2'>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                placeholder='Enter Email'
                                className='form-control'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className='mb-2'>
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                placeholder='Enter Password'
                                className='form-control'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {errorMessage && <p className="text-danger">{errorMessage}</p>}
                        <div className='d-grid'>
                            <button type='submit' className='btn btn-primary mt-2'>Log in</button>
                        </div>
                        <p className='text-right mt-2'>
                            <Link to="/forgot-password">Forgot Password?</Link>
                        </p>
                        {/* <div className="text-center mt-2">
                            <Link to="/signup" className='ms-2'>Sign up</Link>
                        </div> */}
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Login;
