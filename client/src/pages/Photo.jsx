import React, { useEffect, useState } from 'react';
import Breadcrumb from './Breadcrumb';
import Footer from './Footer';
import Header from './Header';
import 'lightbox2/dist/css/lightbox.min.css';
import 'lightbox2';
// import Isotope from 'isotope-layout';
import axios from 'axios';
import imagesLoaded from 'imagesloaded';

function Photo() {
    const [pics, setPics] = useState([]);
    const [error, setError] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchPics = async () => {
        try {
            const response = await axios.get('http://localhost:3001/fetchpics');
            setPics(response.data);
            setIsLoading(false);
        } catch (err) {
            setError('Failed to load photos. Please try again later.');
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPics();
    }, []);

    useEffect(() => {
        if (!isLoading) {
            const imgLoad = imagesLoaded('.portfolio-container');
            imgLoad.on('progress', function () {
                const isotope = new Isotope('.portfolio-container', {
                    itemSelector: '.portfolio-item',
                    layoutMode: 'fitRows'
                });

                const filters = document.querySelectorAll('#portfolio-flters li');
                filters.forEach(filter => {
                    filter.addEventListener('click', function () {
                        filters.forEach(f => f.classList.remove('active'));
                        this.classList.add('active');
                        const filterValue = this.getAttribute('data-filter');
                        isotope.arrange({ filter: filterValue });
                    });
                });

                window.lightbox.option({
                    resizeDuration: 200,
                    wrapAround: true
                });

                isotope.layout();
            });
        }
    }, [isLoading]);

    const deletePic = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/pics/${id}`);
            fetchPics();
        } catch (err) {
            setDeleteError('Failed to delete pic. Please try again later.');
        }
    };

    return (
        <div>
            <Header />
            <Breadcrumb />
            <div className="container-xxl py-5">
                <div className="container mb-5">
                    <div className="section-title text-center">
                        <h1 className="display-5 mb-5">Photo Gallery</h1>
                    </div>
                    <div className="row mt-n2 wow fadeInUp">
                        <div className="col-12 text-center">
                            <ul className="list-inline mb-5" id="portfolio-flters">
                                <li className="mx-2 active" data-filter="*">All</li>
                                <li className="mx-2" data-filter=".first">Academic</li>
                                <li className="mx-2" data-filter=".second">Extra-Curriculam</li>
                            </ul>
                        </div>
                    </div>
                    {isLoading ? (
                        <div className="row">
                            <div className="col-12 text-center">
                                <div className="spinner-border" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="row g-4 portfolio-container">
                            {error ? (
                                <div className="col-12">
                                    <div className="alert alert-danger">{error}</div>
                                </div>
                            ) : (
                                pics
                                    .sort((a, b) => b._id.localeCompare(a._id))
                                    .map((pic) => (
                                        <div key={pic._id} className={`col-lg-4 col-md-6 portfolio-item ${pic.filter} wow fadeInUp`}>
                                            <div className="card h-100">
                                                <div className="position-relative overflow-hidden">
                                                    <img className="card-img-top" src={`http://localhost:3001/public/piclib/${pic.file}`} alt={pic.name} style={{ objectFit: 'contain', height: '200px' }} />
                                                    <div className="portfolio-overlay d-flex align-items-center justify-content-center">
                                                        <a className="btn btn-square btn-outline-light mx-1" href={`http://localhost:3001/public/piclib/${pic.file}`} data-lightbox="portfolio"><i className="fa fa-eye"></i></a>
                                                        <a className="btn btn-square btn-outline-light mx-1" href={`http://localhost:3001/public/piclib/${pic.file}`}><i className="fa fa-link"></i></a>
                                                        {localStorage.getItem('role') === 'admin' && (
                                                            <a className="btn btn-square btn-outline-light mx-1" onClick={() => deletePic(pic._id)}><i className="fa-solid fa-trash"></i></a>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="card-body text-center">
                                                    <h5 className="card-title">{pic.name}</h5>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                            )}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Photo;
