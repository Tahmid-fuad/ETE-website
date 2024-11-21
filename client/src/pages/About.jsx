import Breadcrumb from "./Breadcrumb"
import Footer from "./Footer"
import Header from "./Header"

function About() {
    return (
        <div>
            <Header />
            <Breadcrumb />
            <section id="About" className="about_section m-4">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 ">
                            <div className="img-box">
                                <img src="/assets/picture-1.jpg" alt="" />
                            </div>
                        </div>
                        <div className="col-lg-6 about-text wow fadeIn">
                            <div className="p-lg-5 pe-lg-0">
                                <div className="section-title text-start">
                                    <h1 className="display-5 mb-4">About Us</h1>
                                </div>
                                <p className="mb-4 pb-2">The Department of Electronics and Telecommunication Engineering (ETE) at CUET, launched in 2012, aims to produce resourceful engineers with strong research and development skills. The department offers a comprehensive curriculum with specialized faculty in areas like Embedded Systems, VLSI Design, and Applied Electronics. Students gain practical exposure through advanced labs and innovative teaching methodologies. The program prepares graduates for careers in electronics, communication, and computing by providing a solid foundation in engineering fundamentals, physical sciences, and hands-on experience with cutting-edge technologies, addressing both current and future challenges in the field.
                                </p>
                                <h5>Dr. Md. Azad Hossain</h5>
                                <p>Head<br />Email : azad@cuet.ac.bd</p>
                                <br />
                                <div className="row g-4 mb-4 pb-2">
                                    <div className="col-sm-6 wow fadeIn">
                                        <div className="d-flex align-items-center">
                                            <div className="d-flex flex-shrink-0 align-items-center justify-content-center bg-white" style={{ width: "60px", height: "60px" }}>
                                                <i className="fa fa-chalkboard fa-2x text-primary"></i>
                                            </div>
                                            <div className="ms-3">
                                                <h2 className="text-primary mb-1">17</h2>
                                                <p className="fw-medium mb-0">Total Teachers</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6 wow fadeIn">
                                        <div className="d-flex align-items-center">
                                            <div className="d-flex flex-shrink-0 align-items-center justify-content-center bg-white" style={{ width: "60px", height: "60px" }}>
                                                <i className="fa fa-users fa-2x text-primary"></i>
                                            </div>
                                            <div className="ms-3">
                                                <h2 className="text-primary mb-1">244</h2>
                                                <p className="fw-medium mb-0">Total Students</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row g-4 mb-4 pb-2">
                                    <div className="col-sm-6 wow fadeIn">
                                        <div className="d-flex align-items-center">
                                            <div className="d-flex flex-shrink-0 align-items-center justify-content-center bg-white" style={{ width: "60px", height: "60px" }}>
                                                <i className="fa fa-microchip fa-2x text-primary"></i>
                                            </div>
                                            <div className="ms-3">
                                                <h2 className="text-primary mb-1">5</h2>
                                                <p className="fw-medium mb-0">Total Lab</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6 wow fadeIn">
                                        <div className="d-flex align-items-center">
                                            <div className="d-flex flex-shrink-0 align-items-center justify-content-center bg-white" style={{ width: "60px", height: "60px" }}>
                                                <i className="fa fa-laptop fa-2x text-primary"></i>
                                            </div>
                                            <div className="ms-3">
                                                <h2 className="text-primary mb-1">60</h2>
                                                <p className="fw-medium mb-0">Total Computer</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <a href="https://cuet.ac.bd/dept/ete" className="btn btn-primary py-3 px-5">Explore More</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* About Start */}
            {/* <div className="container-fluid bg-light overflow-hidden my-5 px-lg-0">
                <div className="container about px-lg-0">
                    <div className="row g-0 mx-lg-0">
                        <div className="col-lg-6 ps-lg-0" >
                            <div className="position-relative h-100">
                                <img className="position-absolute img-fluid w-100 h-100" src="assets/picture-1.jpg" style={{ objectFit: "cover" }} alt="" />
                            </div>
                        </div>
                        <div className="col-lg-6 about-text wow fadeIn">
                            <div className="p-lg-5 pe-lg-0">
                                <div className="section-title text-start">
                                    <h1 className="display-5 mb-4">About Us</h1>
                                </div>
                                <p className="mb-4 pb-2">Today, we are at the peak of the information technology age, and communication engineering plays a vital role in todays rapidly changing world. In this prospect, CUET has launched Department of Electronics and Telecommunication Engineering (ETE) in the year 2012. The vision of this department is to make great contribution by producing efficient and resourceful engineers with research and development capabilities.

                                    The ETE Department has well qualified and experienced faculty members with areas of specialization that include Embedded Systems, Applied Electronics and VLSI design. The department has taken step to collect technologically advanced equipment and to build enriched laboratories. Students will be given vast amount of practical exposure through the use of innovative methodologies in the design and development of electronics, which is the backbone for all engineering disciplines.

                                    The Department of ETE offers a comprehensive range of rigorous, innovative programs .The undergraduate curriculum of Electronics and Telecommunication Engineering: is designed to give students a sound knowledge of Engineering fundamentals, strong physical sciences background and adequate practical training so that they will be ready to quickly achieve competence in treating current technical problems as well as those that will come with the rapidly changing technologies of the year-to-come. The Electronic and Telecommunication Engineering program prepares students for careers in such areas of electronics, computer, communication etc.

                                    The aim of the undergraduate program of the Department of Electronics and Telecommunication Engineering (ETE) is to provide the students with a technical and engineering background and scientific research capabilities in the design and development and production of electronic devices, circuits and systems used in a wide spectrum of applications ranging from home appliances to the most sophisticated satellite communications.
                                </p>
                                <h5>Dr. Md. Azad Hossain</h5>
                                <p>Head<br />Email : azad@cuet.ac.bd</p>
                                <br />
                                <div className="row g-4 mb-4 pb-2">
                                    <div className="col-sm-6 wow fadeIn">
                                        <div className="d-flex align-items-center">
                                            <div className="d-flex flex-shrink-0 align-items-center justify-content-center bg-white" style={{ width: "60px", height: "60px" }}>
                                                <i className="fa fa-chalkboard fa-2x text-primary"></i>
                                            </div>
                                            <div className="ms-3">
                                                <h2 className="text-primary mb-1">20</h2>
                                                <p className="fw-medium mb-0">Total Teachers</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6 wow fadeIn">
                                        <div className="d-flex align-items-center">
                                            <div className="d-flex flex-shrink-0 align-items-center justify-content-center bg-white" style={{ width: "60px", height: "60px" }}>
                                                <i className="fa fa-users fa-2x text-primary"></i>
                                            </div>
                                            <div className="ms-3">
                                                <h2 className="text-primary mb-1">300</h2>
                                                <p className="fw-medium mb-0">Total Students</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row g-4 mb-4 pb-2">
                                    <div className="col-sm-6 wow fadeIn">
                                        <div className="d-flex align-items-center">
                                            <div className="d-flex flex-shrink-0 align-items-center justify-content-center bg-white" style={{ width: "60px", height: "60px" }}>
                                                <i className="fa fa-microchip fa-2x text-primary"></i>
                                            </div>
                                            <div className="ms-3">
                                                <h2 className="text-primary mb-1">4</h2>
                                                <p className="fw-medium mb-0">Total Lab</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6 wow fadeIn">
                                        <div className="d-flex align-items-center">
                                            <div className="d-flex flex-shrink-0 align-items-center justify-content-center bg-white" style={{ width: "60px", height: "60px" }}>
                                                <i className="fa fa-laptop fa-2x text-primary"></i>
                                            </div>
                                            <div className="ms-3">
                                                <h2 className="text-primary mb-1">60</h2>
                                                <p className="fw-medium mb-0">Total Computer</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <a href="https://cuet.ac.bd/dept/ete" className="btn btn-primary py-3 px-5">Explore More</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
            {/* About End */}


            {/* Team Start */}
            {/* <div className="container-xxl py-5">
                <div className="container">
                    <div className="section-title text-center">
                        <h1 className="display-5 mb-5">Developed by</h1>
                    </div>
                    <div className="row g-4 d-flex justify-content-center align-items-center justify-content-evenly">
                        <div className="col-lg-4 col-md-6 wow fadeInUp">
                            <div className="team-item">
                                <div className="overflow-hidden position-relative">
                                    <img className="img-fluid" src="assets/njr.jpg" alt="" />
                                    <div className="team-social">
                                        <a className="btn btn-square" href="https://www.facebook.com/profile.php?id=61561535323996"><i className="fab fa-facebook-f"></i></a>
                                        <a className="btn btn-square" href="https://www.instagram.com/njr.jahan.7/"><i className="fab fa-instagram"></i></a>
                                        <a className="btn btn-square" href="mailto:u2008056@student.cuet.ac.bd"><i className="fa fa-envelope" aria-hidden="true"></i></a>
                                    </div>
                                </div>
                                <div className="text-center border border-5 border-light border-top-0 p-4">
                                    <h5 className="mb-0">Nusrat Jahan</h5>
                                    <small>ID: 2008056</small>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 wow fadeInUp">
                            <div className="team-item">
                                <div className="overflow-hidden position-relative">
                                    <img className="img-fluid" src="assets/tahmid.png" alt="" />
                                    <div className="team-social">
                                        <a className="btn btn-square" href="https://facebook.com/tahmidfk"><i className="fab fa-facebook-f"></i></a>
                                        <a className="btn btn-square" href="https://x.com/TFkhan0"><i className="fa-brands fa-x-twitter"></i></a>
                                        <a className="btn btn-square" href="https://www.instagram.com/tahmid.fuad/"><i className="fab fa-instagram"></i></a>
                                        <a className="btn btn-square" href="mailto:u2008055@student.cuet.ac.bd"><i className="fa fa-envelope" aria-hidden="true"></i></a>
                                    </div>
                                </div>
                                <div className="text-center border border-5 border-light border-top-0 p-4">
                                    <h5 className="mb-0">Tahmid Fuad Khan</h5>
                                    <small>ID: 2008055</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
            {/* Team End */}
            <Footer />
        </div>
    )
}

export default About
