import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';

const AddOwl = ({ }) => {
    const [isSubmit, setIsSubmit] = useState(false);
    const [serverError, setServerError] = useState('');
    const [file, setFile] = useState(null);
    const [owls, setOwls] = useState([]);
    const [error, setError] = useState('');

    const fetchOwls = async () => {
        try {
            const response = await axios.get('http://localhost:3001/fetchowls');
            setOwls(response.data);
        } catch (err) {
            setError('Failed to load Owl. Please try again later.');
        }
    };

    useEffect(() => {
        fetchOwls();
    }, []);

    const deleteOwl = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/owls/${id}`);
            fetchOwls();
        } catch (err) {
            setError('Failed to delete owl. Please try again later.');
        }
    };

    const handleOwlSubmit = async (e) => {
        e.preventDefault();
        setIsSubmit(true);
        setServerError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            await axios.post('http://localhost:3001/addowl', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            fetchOwls();
        } catch (err) {
            setServerError(err.response ? err.response.data.message : 'An error occurred');
        } finally {
            setIsSubmit(false);
            setFile(null);
        }
    };

    const handleOwl = (e) => {
        setFile(e.target.files[0]);
    };

    return (
        <div>
            <div className='w-100 p-4 rounded bg-white'>
                <form onSubmit={handleOwlSubmit}>
                    <h5 className='text-center'>Owl Carousel Pictures</h5>
                    {error ? (
                        <li>{error}</li>
                    ) : (
                        owls.map((owl) => (
                            <li key={owl._id} >
                                <a className='text-black text-decoration-underline' href={`http://localhost:3001/public/owlimage/${owl.file}`}>{owl.file}</a>
                                <i className="fa-solid fa-trash" onClick={() => deleteOwl(owl._id)} style={{ cursor: 'pointer' }}></i>
                            </li>
                        ))
                    )}
                    <div className='mb-2'>
                        <label htmlFor="photo">Upload Photo (Must be 16:9)</label>
                        <input
                            type="file"
                            className='form-control'
                            onChange={handleOwl}
                        />
                    </div>
                    {/* {serverError && <p className="text-danger">{serverError}</p>} */}
                    {serverError && <div className="alert alert-danger mt-3">{serverError}</div>}
                    <div className='d-grid'>
                        <button className='btn btn-primary mt-2' type="submit" disabled={isSubmit} >
                            {isSubmit ? 'Submitting...' : 'Add'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddOwl;
