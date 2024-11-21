import React, { useEffect, useState } from 'react'
import Header from './Header'
import Breadcrumb from './Breadcrumb'
import Footer from './Footer'
import axios from 'axios';

function Notices() {
    const [notices, setNotices] = useState([]);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const noticesPerPage = 15;  

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const response = await axios.get('http://localhost:3001/fetchnotices');
                setNotices(response.data);
            } catch (err) {
                setError('Failed to load notices. Please try again later.');
            }
        };

        fetchNotices();
    }, []);

    const totalPages = Math.ceil(notices.length / noticesPerPage);
    const startIndex = (currentPage - 1) * noticesPerPage;
    const currentNotices = notices
        .sort((a, b) => b._id.localeCompare(a._id))
        .slice(startIndex, startIndex + noticesPerPage);

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };
    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    return (
        <div>
            <Header />
            <Breadcrumb />
            <div>
                <div className="ms-xxl-1 me-xxl-1 bg-white p-3 mb-xxl-2">
                    <div className="heading-sect">
                        <h3 className="m-0 p-0 fs-6 fw-semibold">All Notices</h3>
                    </div>
                    <ul className="latest-news-ul">
                        {error ? (
                            <li>{error}</li>
                        ) : (
                            currentNotices.map((notice) => (
                                <li key={notice._id}>
                                    <a
                                        className={notice.file ? 'text-black text-decoration-underline' : 'text-black'}
                                        href={notice.file ? `http://localhost:3001/public/noticefile/${notice.file}` : '#'}>
                                        {notice.notice + " "}
                                    </a>
                                </li>
                            ))
                        )}
                    </ul>

                    <div className="text-center mt-3">
                        <button 
                            onClick={handlePrevPage} 
                            disabled={currentPage === 1}
                            className="btn btn-primary mx-2"
                        >
                            &larr; Previous
                        </button>
                        <span className="page-info">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button 
                            onClick={handleNextPage} 
                            disabled={currentPage === totalPages}
                            className="btn btn-primary mx-2"
                        >
                            Next &rarr;
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Notices;
