import React, { useRef, useState } from 'react';
import axios from 'axios';

const AddRecentEvents = ({ revents, setRevents }) => {
    const [isSubmit, setIsSubmit] = useState(false);
    const [serverError, setServerError] = useState('');
    const [revent, setRevent] = useState('');
    const [file, setFile] = useState(null);

    const handleRevent = async (e) => {
        e.preventDefault();
        setIsSubmit(true);
        setServerError('');

        const formData = new FormData();
        formData.append('revent', revent);
        formData.append('file', file);

        try {
            await axios.post('http://localhost:3001/addrevent', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const response = await axios.get('http://localhost:3001/fetchrevents');
            setRevents(response.data);
        } catch (err) {
            setServerError(err.response ? err.response.data.message : 'An error occurred');
        } finally {
            setIsSubmit(false);
            setRevent('');
            setFile(null);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    return (
        <div>
            <div className="section-title text-start">
                <h3 className="mb-4">Add Recent Events</h3>
            </div>
            <form onSubmit={handleRevent}>
                <div className="row g-3">
                    <div className="col-12">
                        <div className="form-floating">
                            <textarea
                                className="form-control"
                                placeholder="Write the recent event caption"
                                id="caption"
                                style={{ height: '50px' }}
                                value={revent}
                                onChange={(e) => setRevent(e.target.value)}
                            />
                            <label htmlFor="message">Recent Event Caption</label>
                        </div>
                    </div>
                    <div className='mb-2'>
                        <label htmlFor="file">Upload Photo (Should be 16:9)</label>
                        <input
                            type="file"
                            className='form-control'
                            onChange={handleFileChange}
                        />
                    </div>
                    <div className="col-12">
                        <button className="btn btn-primary w-100 py-3" type="submit" disabled={isSubmit}>
                            {isSubmit ? 'Submitting...' : 'Add Recent Event'}
                        </button>
                    </div>
                </div>
            </form>
            {serverError && <div className="alert alert-danger mt-3">{serverError}</div>}
        </div>
    );
};

export default AddRecentEvents;
