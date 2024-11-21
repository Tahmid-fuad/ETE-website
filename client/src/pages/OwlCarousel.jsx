import React, { useEffect, useState } from 'react';
import OwlCarousel from 'react-owl-carousel';
import axios from 'axios';

const Carousel = () => {
    const options = {
        autoplay: true,
        smartSpeed: 1500,
        items: 1,
        dots: true,
        loop: true,
        nav: true,
        navText: [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ]
    };

    const [owls, setOwls] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchOwls = async () => {
        try {
            const response = await axios.get('http://localhost:3001/fetchowls');
            setOwls(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load Owl. Please try again later.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOwls();
    }, []);

    return (
        <div>
            <div className="section-title text-center">
                <h1 className="display-5 mt-5 mb-5">
                    <a href="/photo">Photo Gallery</a>
                </h1>
            </div>
            <div className="container-fluid p-0 pb-5">
                {loading ? (
                    <div className="text-center">
                        <p>Loading owl carousel...</p>
                    </div>
                ) : (
                    <OwlCarousel className="owl-theme header-carousel" {...options}>
                        {error ? (
                            <li>{error}</li>
                        ) : (
                            owls.map((owl) => (
                                <div key={owl._id} className="owl-carousel-item position-relative">
                                    <img
                                        className="img-fluid"
                                        src={`http://localhost:3001/public/owlimage/${owl.file}`}
                                        style={{ maxHeight: '700px', objectFit: 'contain' }}
                                    />
                                </div>
                            ))
                        )}
                    </OwlCarousel>
                )}
            </div>
        </div>
    );
};

export default Carousel;
