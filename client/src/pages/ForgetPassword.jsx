import React, { useState } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';

function ForgetPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/forgot-password', { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  return (
    <div>
      <Header />
      <div className="forgot-password template d-flex justify-content-center align-items-center vh-100" style={{ background: "linear-gradient(120deg,#AB7442, #ffffff)" }}>
        <div className="w-25 p-5 rounded bg-white">
          <form onSubmit={handleSubmit}>
            <h3 className="text-center">Forgot Password</h3>
            <div className="mb-2">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="d-grid">
              <button className="btn btn-primary mt-2">Submit</button>
            </div>
            {message && <p className="text-center mt-2 text-success">{message}</p>}
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ForgetPassword;
