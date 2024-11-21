import { useNavigate } from "react-router-dom";
import Breadcrumb from "./Breadcrumb";
import Footer from "./Footer";
import Header from "./Header";
import axios from 'axios';
import { useState, useEffect } from 'react';

function Faculties() {
    const [faculties, setFaculties] = useState([]);
    const navigate = useNavigate();

    const redirectToFaculty = (email) => {
        navigate(`/faculty/${email}`);
    };

    const fetchFaculties = async () => {
        try {
            const response = await axios.get('http://localhost:3001/faculties');
            const facultiesWithPhotos = response.data.map(faculty => ({
                ...faculty,
                photoUrl: `http://localhost:3001/teacher-photo/${faculty.email}`
            }));
            setFaculties(facultiesWithPhotos);
        } catch (error) {
            console.error('Error fetching faculty data', error);
        }
    };

    useEffect(() => {
        fetchFaculties();
    }, []);

    const groupedFaculties = [];
    for (let i = 0; i < faculties.length; i += 3) {
        groupedFaculties.push(faculties.slice(i, i + 3));
    }

    const designation = {
        '1': 'Professor',
        '2': 'Associate Professor',
        '3': 'Assistant Professor',
        '4': 'Lecturer',
    };

    return (
        <div>
            <Header />
            <Breadcrumb />
            <div>
                <div className="container-xxl py-5">
                    <div className="container">
                        <div className="section-title text-center">
                            <h1 className="display-5 mb-5">Our Faculties</h1>
                        </div>
                        {groupedFaculties.map((facultyGroup, rowIndex) => (
                            <div className="row g-4 p-3" key={rowIndex}>
                                {facultyGroup.map((faculty, index) => (
                                    <div
                                        className="col-md-6 col-lg-4 wow fadeInUp"
                                        key={index}
                                    >
                                        <div className="team-item">
                                            <div className="overflow-hidden position-relative">
                                                {faculty.photoUrl ? (
                                                    <img src={faculty.photoUrl} className="img-fluid" alt={faculty.name} />
                                                ) : (
                                                    <div>Loading photo...</div>
                                                )}
                                                <div className="team-social">
                                                    <a className="btn btn-square" href={faculty.facebook}><i className="fab fa-facebook-f"></i></a>
                                                    <a className="btn btn-square" href={faculty.linkedin}><i className="fab fa-linkedin-in"></i></a>
                                                    <a className="btn btn-square" href={`mailto:${faculty.email}`}><i className="fa fa-envelope" aria-hidden="true"></i></a>
                                                </div>
                                            </div>
                                            <div className="p-4 text-center border border-5 border-light border-top-0">
                                                <h4 className="mb-3">{faculty.name}</h4>
                                                <p>{designation[faculty.desig]}</p>
                                                <a
                                                    className="fw-medium"
                                                    onClick={() => redirectToFaculty(`${faculty.email}`)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    Read More
                                                    <i className="fa fa-arrow-right ms-2"></i>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                        {/* <div className="row g-4 p-3">
                            <div className="col-md-6 col-lg-4 wow fadeInUp">
                                <div className="team-item">
                                    <div className="overflow-hidden position-relative">
                                        <img className="img-fluid" src="assets/Azad sir.jpeg" alt="" />
                                        <div className="team-social">
                                            <a className="btn btn-square" href="https://www.facebook.com/Hiron.RUET?mibextid=ZbWKwL"><i className="fab fa-facebook-f"></i></a>
                                            <a className="btn btn-square" href="https://www.linkedin.com/in/azad-hossain-026b05260?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3B2g1ud9zKT2WT6EVJf8eRjg%3D%3D"><i className="fab fa-linkedin-in"></i></a>
                                            <a className="btn btn-square" href="mailto:"><i className="fa fa-envelope" aria-hidden="true"></i></a>
                                        </div>
                                    </div>
                                    <div className="p-4 text-center border border-5 border-light border-top-0">
                                        <h4 className="mb-3">Dr. Md. Azad Hossain</h4>
                                        <p>Head of the Depertment</p>
                                        <a
                                            className="fw-medium"
                                            onClick={() => redirectToFaculty("azad@cuet.ac.bd")}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Read More
                                            <i className="fa fa-arrow-right ms-2"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-4 wow fadeInUp">
                                <div className="team-item">
                                    <div className="overflow-hidden position-relative">
                                        <img className="img-fluid" src="assets/Jahedsir.jpg" alt="" />
                                        <div className="team-social">
                                            <a className="btn btn-square" href="https://www.facebook.com/mdjahedul.islam.7?mibextid=ZbWKwL"><i className="fab fa-facebook-f"></i></a>
                                            <a className="btn btn-square" href=""><i className="fab fa-linkedin-in"></i></a>
                                            <a className="btn btn-square" href="mailto:jahed@cuet.ac.bd"><i className="fa fa-envelope" aria-hidden="true"></i></a>
                                        </div>
                                    </div>
                                    <div className="p-4 text-center border border-5 border-light border-top-0">
                                        <h4 className="mb-3">Dr. Md. Jahedul Islam</h4>
                                        <p>Proffesor</p>
                                        <a
                                            className="fw-medium"
                                            onClick={() => redirectToFaculty("jahed@cuet.ac.bd")}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Read More
                                            <i className="fa fa-arrow-right ms-2"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-4 wow fadeInUp">
                                <div className="team-item">
                                    <div className="overflow-hidden position-relative">
                                        <img className="img-fluid" src="assets/saifulsir.jpg" alt="" />
                                        <div className="team-social">
                                            <a className="btn btn-square" href="https://www.facebook.com/saiful.i.sumon.5?mibextid=ZbWKwL"><i className="fab fa-facebook-f"></i></a>
                                            <a className="btn btn-square" href="https://www.linkedin.com/in/dr-md-saiful-islam-195b1b298?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BYe2Kp%2FxrTP%2BZ9WbGuSjyhA%3D%3D"><i className="fab fa-linkedin-in"></i></a>
                                            <a className="btn btn-square" href="mailto:saiful05eee@cuet.ac.bd"><i className="fa fa-envelope" aria-hidden="true"></i></a>
                                        </div>
                                    </div>
                                    <div className="p-4 text-center border border-5 border-light border-top-0">
                                        <h4 className="mb-3">Dr. Md. Saiful Islam</h4>
                                        <p>Assistant Proffesor</p>
                                        <a
                                            className="fw-medium"
                                            onClick={() => redirectToFaculty("saiful05eee@cuet.ac.bd")}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Read More
                                            <i className="fa fa-arrow-right ms-2"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row g-4 p-3">
                            <div className="col-md-6 col-lg-4 wow fadeInUp">
                                <div className="team-item">
                                    <div className="overflow-hidden position-relative">
                                        <img className="img-fluid" src="assets/piyassir.jpeg" alt="" />
                                        <div className="team-social">
                                            <a className="btn btn-square" href="https://www.facebook.com/piyas.chowdhury?mibextid=ZbWKwL"><i className="fab fa-facebook-f"></i></a>
                                            <a className="btn btn-square" href="https://www.linkedin.com/in/piyas-chowdhury-b359b675?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BqpVVTZBNTMmbaiK8BAGFIA%3D%3D"><i className="fab fa-linkedin-in"></i></a>
                                            <a className="btn btn-square" href="mailto:piyas@cuet.ac.bd"><i className="fa fa-envelope" aria-hidden="true"></i></a>
                                        </div>
                                    </div>
                                    <div className="p-4 text-center border border-5 border-light border-top-0">
                                        <h4 className="mb-3">Piyas Chowdhury</h4>
                                        <p>Assistant Professor</p>
                                        <a
                                            className="fw-medium"
                                            onClick={() => redirectToFaculty("piyas@cuet.ac.bd")}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Read More
                                            <i className="fa fa-arrow-right ms-2"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-4 wow fadeInUp">
                                <div className="team-item">
                                    <div className="overflow-hidden position-relative">
                                        <img className="img-fluid" src="assets/ful.jpg" alt="" />
                                        <div className="team-social">
                                            <a className="btn btn-square" href="https://www.facebook.com/profile.php?id=61550075086310&mibextid=ZbWKwL"><i className="fab fa-facebook-f"></i></a>
                                            <a className="btn btn-square" href="https://www.linkedin.com/in/mohammad-anisur-rahaman-31198a96?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BOMr%2B1uQWTvmjo6QrW0QaqQ%3D%3D"><i className="fab fa-linkedin-in"></i></a>
                                            <a className="btn btn-square" href="mailto:anisur.rahaman@cuet.ac.bd"><i className="fa fa-envelope" aria-hidden="true"></i></a>
                                        </div>
                                    </div>
                                    <div className="p-4 text-center border border-5 border-light border-top-0">
                                        <h4 className="mb-3">Mohammed Anisur Rahman</h4>
                                        <p> Assistant Proffesor</p>
                                        <a
                                            className="fw-medium"
                                            onClick={() => redirectToFaculty("anisur.rahaman@cuet.ac.bd")}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Read More
                                            <i className="fa fa-arrow-right ms-2"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-4 wow fadeInUp">
                                <div className="team-item">
                                    <div className="overflow-hidden position-relative">
                                        <img className="img-fluid" src="assets/mamunsir.jpg" alt="" />
                                        <div className="team-social">
                                            <a className="btn btn-square" href="https://www.facebook.com/nursadul.mamun?mibextid=ZbWKwL"><i className="fab fa-facebook-f"></i></a>
                                            <a className="btn btn-square" href="https://www.linkedin.com/in/nursadul-mamun-phd-85980752?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BZ14sX2WyQe2taYvGhKau3w%3D%3D"><i className="fab fa-linkedin-in"></i></a>
                                            <a className="btn btn-square" href="mailto:nursad.mamun@cuet.ac.bd"><i className="fa fa-envelope" aria-hidden="true"></i></a>
                                        </div>
                                    </div>
                                    <div className="p-4 text-center border border-5 border-light border-top-0">
                                        <h4 className="mb-3">Nursadul Mamun</h4>
                                        <p>Assistant Proffesor</p>
                                        <a
                                            className="fw-medium"
                                            onClick={() => redirectToFaculty("nursad.mamun@cuet.ac.bd")}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Read More
                                            <i className="fa fa-arrow-right ms-2"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row g-4 p-3">
                            <div className="col-md-6 col-lg-4 wow fadeInUp">
                                <div className="team-item">
                                    <div className="overflow-hidden position-relative">
                                        <img className="img-fluid" src="assets/njr.jpg" alt="" />
                                        <div className="team-social">
                                            <a className="btn btn-square" href="https://www.facebook.com/profile.php?id=100010136313210&mibextid=ZbWKwL"><i className="fab fa-facebook-f"></i></a>
                                            <a className="btn btn-square" href=""><i className="fab fa-linkedin-in"></i></a>
                                            <a className="btn btn-square" href=" mailto:taieba.athay@cuet.ac.bd"><i className="fa fa-envelope" aria-hidden="true"></i></a>
                                        </div>
                                    </div>
                                    <div className="p-4 text-center border border-5 border-light border-top-0">
                                        <h4 className="mb-3">Tayeba Taher</h4>
                                        <p>Assistant Proffesor</p>
                                        <a
                                            className="fw-medium"
                                            onClick={() => redirectToFaculty("taieba.athay@cuet.ac.bd")}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Read More
                                            <i className="fa fa-arrow-right ms-2"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-4 wow fadeInUp">
                                <div className="team-item">
                                    <div className="overflow-hidden position-relative">
                                        <img className="img-fluid" src="assets/njr.jpg" alt="" />
                                        <div className="team-social">
                                            <a className="btn btn-square" href="https://www.facebook.com/micro.promy?mibextid=ZbWKwL"><i className="fab fa-facebook-f"></i></a>
                                            <a className="btn btn-square" href="https://www.linkedin.com/in/khadija-akter-59a881176?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BtUfDn2N4RwiAxM8VNpPBuQ%3D%3D"><i className="fab fa-linkedin-in"></i></a>
                                            <a className="btn btn-square" href="mailto:khadija.ete@cuet.ac.bd"><i className="fa fa-envelope" aria-hidden="true"></i></a>
                                        </div>
                                    </div>
                                    <div className="p-4 text-center border border-5 border-light border-top-0">
                                        <h4 className="mb-3">Khadija Akther</h4>
                                        <p>Assistant Proffesor</p>
                                        <a
                                            className="fw-medium"
                                            onClick={() => redirectToFaculty("khadija.ete@cuet.ac.bd")}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Read More
                                            <i className="fa fa-arrow-right ms-2"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-4 wow fadeInUp">
                                <div className="team-item">
                                    <div className="overflow-hidden position-relative">
                                        <img className="img-fluid" src="assets/farhadsir.jpg" alt="" />
                                        <div className="team-social">
                                            <a className="btn btn-square" href="https://www.facebook.com/farhad.h.hridoy.7?mibextid=ZbWKwL"><i className="fab fa-facebook-f"></i></a>
                                            <a className="btn btn-square" href="https://www.linkedin.com/in/farhadete13?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BrP5Na4dXRme8p2iivVFjIA%3D%3D"><i className="fab fa-linkedin-in"></i></a>
                                            <a className="btn btn-square" href="mailto:farhad.hossain@cuet.ac.bd"><i className="fa fa-envelope" aria-hidden="true"></i></a>
                                        </div>
                                    </div>
                                    <div className="p-4 text-center border border-5 border-light border-top-0">
                                        <h4 className="mb-3">farhad Hossain</h4>
                                        <p>Assistant Proffesor</p>
                                        <a
                                            className="fw-medium"
                                            onClick={() => redirectToFaculty("farhad.hossain@cuet.ac.bd")}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Read More
                                            <i className="fa fa-arrow-right ms-2"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row g-4 p-3">
                            <div className="col-md-6 col-lg-4 wow fadeInUp">
                                <div className="team-item">
                                    <div className="overflow-hidden position-relative">
                                        <img className="img-fluid" src="assets/eftekharsir.jpg" alt="" />
                                        <div className="team-social">
                                            <a className="btn btn-square" href="https://www.facebook.com/eftekhar.hossain.12?mibextid=ZbWKwL"><i className="fab fa-facebook-f"></i></a>
                                            <a className="btn btn-square" href="https://www.linkedin.com/in/eftekhar-hossain-6b16681b5?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BjbaZ0HpaS3CBr4d5g1SpCg%3D%3D"><i className="fab fa-linkedin-in"></i></a>
                                            <a className="btn btn-square" href="mailto:eftekhar.13ete@gmail.com"><i className="fa fa-envelope" aria-hidden="true"></i></a>
                                        </div>
                                    </div>
                                    <div className="p-4 text-center border border-5 border-light border-top-0">
                                        <h4 className="mb-3">Eftekhar Hossain</h4>
                                        <p>Assistant Professor</p>
                                        <a
                                            className="fw-medium"
                                            onClick={() => redirectToFaculty("eftekhar.13ete@gmail.com")}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Read More
                                            <i className="fa fa-arrow-right ms-2"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-4 wow fadeInUp">
                                <div className="team-item">
                                    <div className="overflow-hidden position-relative">
                                        <img className="img-fluid" src="assets/Tumpama'am.jpg" alt="" />
                                        <div className="team-social">
                                            <a className="btn btn-square" href="https://www.facebook.com/priyanti.paul.5?mibextid=ZbWKwL"><i className="fab fa-facebook-f"></i></a>
                                            <a className="btn btn-square" href="https://www.linkedin.com/in/priyanti-paul-tumpa-2297a9197?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BePJzraK8QWyZUmq%2FLDoAtw%3D%3D"><i className="fab fa-linkedin-in"></i></a>
                                            <a className="btn btn-square" href=" mailto:priyanti.ete@cuet.ac.bd"><i className="fa fa-envelope" aria-hidden="true"></i></a>
                                        </div>
                                    </div>
                                    <div className="p-4 text-center border border-5 border-light border-top-0">
                                        <h4 className="mb-3">Priyanti Paul Tumpa</h4>
                                        <p>Lecturer</p>
                                        <a
                                            className="fw-medium"
                                            onClick={() => redirectToFaculty("priyanti.ete@cuet.ac.bd")}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Read More
                                            <i className="fa fa-arrow-right ms-2"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-4 wow fadeInUp">
                                <div className="team-item">
                                    <div className="overflow-hidden position-relative">
                                        <img className="img-fluid" src="assets/Arifsir.jpeg" alt="" />
                                        <div className="team-social">
                                            <a className="btn btn-square" href="https://www.facebook.com/arif.istiaq.22?mibextid=ZbWKwL"><i className="fab fa-facebook-f"></i></a>
                                            <a className="btn btn-square" href="https://www.linkedin.com/in/arifistiaq?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3ByzsiMCbTSIm1jhnRl30%2Fqg%3D%3D"><i className="fab fa-linkedin-in"></i></a>
                                            <a className="btn btn-square" href="mailto:arif.ete@cuet.ac.bd"><i className="fa fa-envelope" aria-hidden="true"></i></a>
                                        </div>
                                    </div>
                                    <div className="p-4 text-center border border-5 border-light border-top-0">
                                        <h4 className="mb-3">Arif Istiaque</h4>
                                        <p>Lecturer</p>
                                        <a
                                            className="fw-medium"
                                            onClick={() => redirectToFaculty("arif.ete@cuet.ac.bd")}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Read More
                                            <i className="fa fa-arrow-right ms-2"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Faculties;
