import React, { useState } from 'react';
import axios from 'axios';

const AddRoutine = ({ setRoutines }) => {
    const [isSubmit, setIsSubmit] = useState(false);
    const [serverError, setServerError] = useState('');
    const [dest, setDest] = useState('');
    const [file1, setFile1] = useState(null);
    const [file2, setFile2] = useState(null);

    const handleRoutine = async (e) => {
        e.preventDefault();
        setIsSubmit(true);
        setServerError('');

        const formData = new FormData();
        formData.append('file1', file1);
        formData.append('file2', file2);
        formData.append('dest', dest);

        try {
            await axios.post('http://localhost:3001/addroutine', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const response = await axios.get('http://localhost:3001/fetchroutines');
            setRoutines(response.data);
        } catch (err) {
            setServerError(err.response ? err.response.data.message : 'An error occurred');
        } finally {
            setIsSubmit(false);
            setDest('');
            setFile1(null);
            setFile2(null);
        }
    };

    const handleFileChange1 = (e) => {
        setFile1(e.target.files[0]);
    };
    const handleFileChange2 = (e) => {
        setFile2(e.target.files[0]);
    };

    return (
        <div>
            <div className="section-title text-start">
                <h3 className="mb-4">Add Routine</h3>
            </div>
            <form onSubmit={handleRoutine}>
                <div className="row g-3">
                    <div className='mb-1'>
                        <label htmlFor="file">Upload Routine File</label>
                        <input
                            type="file"
                            className='form-control'
                            onChange={handleFileChange1}
                        />
                    </div>
                    <div className='mb-1'>
                        <label htmlFor="file">Upload Routine Picture</label>
                        <input
                            type="file"
                            className='form-control'
                            onChange={handleFileChange2}
                        />
                    </div>
                    <div className='mb-1'>
                        <label htmlFor="role">Routine for:</label>
                        <select
                            className='form-control'
                            value={dest}
                            onChange={(e) => setDest(e.target.value)}
                        >
                            <option value="">Select Destination</option>
                            <option value="master">Master Routine</option>
                            <option value="20">20 Batch</option>
                            <option value="21">21 Batch</option>
                            <option value="22">22 Batch</option>
                        </select>
                    </div>
                    <div className="col-12">
                        <button className="btn btn-primary w-100 py-3" type="submit" disabled={isSubmit}>
                            {isSubmit ? 'Submitting...' : 'Add Routine'}
                        </button>
                    </div>
                </div>
            </form>
            {serverError && <div className="alert alert-danger mt-3">{serverError}</div>}
        </div>
    );
};

export default AddRoutine;
