import axios from 'axios';
import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';

function SearchStudent() {
    const [serverError, setServerError] = useState('');
    const [studentId, setStudentId] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate(); 

    const handleStudentSearch = async (e) => {
        e.preventDefault();
        const errors = validate(studentId);
        setFormErrors(errors);


        if (Object.keys(errors).length === 0) {
            try {
                await axios.post(`http://localhost:3001/searchStudent/${studentId}`)
                    .then(response => {
                        if (response.data.message === "Student found") {
                            navigate(`/profile/${studentId}`);
                        }
                    })
            } catch (err) {
                setServerError(err.response ? err.response.data.message : 'An error occurred');
            } 
        }
    };

    const validate = (studentId) => {
        const errors = {};
        if (!studentId) {
            errors.studentId = "Student Id is required";
        } else if (studentId.length != 7) {
            errors.studentId = "Student ID  must be at least 7 characters long";
        }
        return errors;
    };

    return (
        <div>
            <div className='w-100 p-3 rounded bg-white'>
                <form onSubmit={handleStudentSearch}>
                    <h5 className='text-center'>Search Student</h5>
                    <div className='mb-2'>
                        <input
                            type="text"
                            placeholder='Enter Student ID'
                            className='form-control'
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                        />
                        {formErrors.studentId && <p className="text-danger">{formErrors.studentId}</p>}
                    </div>
                    {serverError && <div className="alert alert-danger mt-3">{serverError}</div>}
                    <div className='d-grid'>
                        <button className='btn btn-primary mt-2' type="submit" >Search</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SearchStudent
