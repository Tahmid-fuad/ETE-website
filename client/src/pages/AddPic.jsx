import React, { useState } from 'react';
import axios from 'axios';

const AddOwl = ({ }) => {
    const [isSubmit, setIsSubmit] = useState(false);
    const [serverError, setServerError] = useState('');
    const [file, setFile] = useState(null);
    const [name, setName] = useState('');
    const [filter, setFilter] = useState('');


    const handlePicSubmit = async (e) => {
        e.preventDefault();
        setIsSubmit(true);
        setServerError('');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', name);
        formData.append('filter', filter);

        try {
            await axios.post('http://localhost:3001/addpic', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        } catch (err) {
            setServerError(err.response ? err.response.data.message : 'An error occurred');
        } finally {
            setIsSubmit(false);
            setFile(null);
            setName('');
            setFilter('');
        }
    };

    const handlePic = (e) => {
        setFile(e.target.files[0]);
    };

    return (
        <div>
            <div className='w-100 p-3 rounded bg-white'>
                <form onSubmit={handlePicSubmit}>
                    <h5 className='text-center'>Photo Gallery</h5>
                    <div className='mb-2'>
                        <label htmlFor="photo">Upload Photo</label>
                        <input
                            type="file"
                            className='form-control'
                            onChange={handlePic}
                        />
                    </div>
                    <div className='mb-2'>
                        <input
                            type="text"
                            placeholder='Enter Name'
                            className='form-control'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className='mb-2'>
                        <select
                            className='form-control'
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="">Select Filter</option>
                            <option value="first">Academic</option>
                            <option value="second">Extra-Curriculam</option>
                        </select>
                    </div>
                    {serverError && <div className="alert alert-danger mt-3">{serverError}</div>}
                    <div className='d-grid'>
                        <button className='btn btn-primary mt-2' type="submit" disabled={isSubmit} >
                            {isSubmit ? 'Submitting...' : 'Add Picture'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddOwl;
