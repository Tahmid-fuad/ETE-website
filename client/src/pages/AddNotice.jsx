import React, { useState } from 'react';
import axios from 'axios';

const AddNotice = ({ notices, setNotices, setError }) => {
    const [isSubmit, setIsSubmit] = useState(false);
    const [serverError, setServerError] = useState('');
    const [notice, setNotice] = useState('');
    const [file, setFile] = useState(null);

    const handleNotice = async (e) => {
        e.preventDefault();
        setIsSubmit(true);
        setServerError('');

        const formData = new FormData();
        formData.append('notice', notice);
        formData.append('file', file);

        try {
            await axios.post('http://localhost:3001/addnotice', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const response = await axios.get('http://localhost:3001/fetchnotices');
            setNotices(response.data);
        } catch (err) {
            setServerError(err.response ? err.response.data.message : 'An error occurred');
        } finally {
            setIsSubmit(false);
            setNotice('');
            setFile(null);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    return (
        <div>
            <div className="section-title text-start">
                <h3 className="mb-4">Add Notice</h3>
            </div>
            <form onSubmit={handleNotice}>
                <div className="row g-3">
                    <div className="col-12">
                        <div className="form-floating">
                            <textarea
                                className="form-control"
                                placeholder="Write the notice message"
                                id="message"
                                style={{ height: '100px' }}
                                value={notice}
                                onChange={(e) => setNotice(e.target.value)}
                            />
                            <label htmlFor="message">Notice message</label>
                        </div>
                    </div>
                    <div className='mb-2'>
                        <label htmlFor="file">Upload File</label>
                        <input
                            type="file"
                            className='form-control'
                            onChange={handleFileChange}
                        />
                    </div>
                    <div className="col-12">
                        <button className="btn btn-primary w-100 py-3" type="submit" disabled={isSubmit}>
                            {isSubmit ? 'Submitting...' : 'Add Notice'}
                        </button>
                    </div>
                </div>
            </form>
            {serverError && <div className="alert alert-danger mt-3">{serverError}</div>}
        </div>
    );
};

export default AddNotice;
