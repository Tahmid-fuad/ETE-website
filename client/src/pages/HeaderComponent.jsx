import React from 'react';

const HeaderComponent = () => {
    return (
        <div className="container">
            <div className="row d-flex justify-content-between align-items-center">
                <div className="col-2 text-left d-flex justify-content-start">
                    <img src="assets/CUET logo.png" className="img-fluid" style={{ height: "auto", width: "50%" }} />
                </div>
                <div className="col-8 text-center">
                    <div className="pdf-header mb-3">
                        <h2>Chittagong University of Engineering and Technology</h2>
                        <h3>Department of Electronics and Telecommunication Engineering</h3>
                        <h4>Chittagong - 4349</h4>
                    </div>
                </div>
                <div className="col-2 text-right d-flex justify-content-end">
                    <img src="assets/ete logo black.png" className="img-fluid" style={{ height: "auto", width: "50%" }} />
                </div>
            </div>
            <hr />
        </div>
    )
};

export default HeaderComponent;
