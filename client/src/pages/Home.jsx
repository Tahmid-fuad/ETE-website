import ReactOwlCarousel from "react-owl-carousel";
import Events from "./Events";
import Footer from "./Footer"
import Header from "./Header"
import Notice from "./Notice"
import Carousel from "./OwlCarousel"
import OwlCarousel from 'react-owl-carousel';
import { useSpring, animated } from "react-spring";
import axios from "axios";
import { useEffect, useState } from "react";

function Number({ n }) {
  const { number } = useSpring({
    from: { number: 0 },
    number: n,
    delay: 200,
    config: { mass: 1, tenion: 0, friction: 100 },
  });
  return <animated.div>{number.to((n) => n.toFixed(0))}</animated.div>;
}

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

function Home() {

  const [revents, setRevents] = useState([]);
  const [reventError, setReventError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchRevents = async () => {
    try {
      const response = await axios.get('http://localhost:3001/fetchrevents');
      setRevents(response.data);
      setLoading(false);
    } catch (err) {
      setReventError('Failed to load recent events. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevents();
  }, []);

  return (
    <div>
      <Header></Header>

      {/* Header start */}
      <div className="owl-carousel-item position-relative">
        <img className="img-fluid" src="/assets/new gate.jpg" alt="" />
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center"
          style={{ background: "rgba(53, 53, 53, .7)" }}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-lg-8 text-center">
                <h3 className="text-white text-uppercase mb-3 animated slideInDown">Welcome To</h3>
                <h1 className="display-3 text-white animated slideInDown mb-4">Depertment of Electronics and Telecommunication
                  Engineering</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* About start */}
      {/* <section id="About" className="about_section m-4">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="detail-box">
                <div className="heading_container">
                  <h2>
                    About Us
                  </h2>
                </div>
                <p>
                  Today, we are at the peak of the information technology age, and communication engineering plays a vital
                  role in today's rapidly changing world. In this prospect, CUET has launched Department of Electronics and
                  Telecommunication Engineering (ETE) in the year 2012. The vision of this department is to make great
                  contribution by producing efficient and resourceful engineers with research and development capabilities.
                </p>
                <a href="/about">
                  Read More
                </a>
              </div>
            </div>
            <div className="col-md-6 ">
              <div className="img-box">
                <img src="/assets/picture-1.jpg" alt="" />
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Carousel Start */}
      <div>
        <div className="section-title text-center">
          <h1 className="display-5 mt-5 mb-5">
            Recent Events
          </h1>
        </div>
        <div className="container-fluid p-0 pb-5">
          {loading ? (
            <div className="text-center">
              <p>Loading events...</p>
            </div>
          ) : (
            <OwlCarousel className="owl-theme header-carousel" {...options}>
              {reventError ? (
                <li>{reventError}</li>
              ) : (
                revents
                  .sort((a, b) => b._id.localeCompare(a._id))
                  .map((revent) => (
                    <div key={revent._id} className="card d-flex justify-content-center align-items-center text-center" style={{ marginBottom: "5rem" }}>
                      <img src={`http://localhost:3001/public/reventfile/${revent.file}`} className="card-img-top w-75" alt="..." style={{ maxHeight: '500px', objectFit: 'contain' }} />
                      <div className="card-body">
                        <p className="card-text">{revent.revent}</p>
                      </div>
                    </div>
                  ))
              )}
            </OwlCarousel>
          )}
        </div>
      </div>
      {/*  Carousel End  */}

      {/* Notice Start */}
      <div className="section-title text-center" id="Notice">
        <h1 className="display-5 mt-5">
          Notice Board
        </h1>
      </div>
      <div className="d-flex" id="Notice">
        <div className="container-xxl py-2 my-4">
          <div className="col-6 float-start">
            <Events />
          </div>
          <div className="col-6 float-start">
            <Notice />
          </div>
        </div>
      </div>
      {/* Notice End */}

      {/* Feature Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-5">
            <div className="col-md-6 col-lg-3 wow fadeIn">
              <div className="d-flex align-items-center justify-content-evenly mb-2">
                <div className="d-flex align-items-center justify-content-center bg-light" style={{ width: "60px", height: "60px" }}>
                  <i className="fa fa-chalkboard fa-2x text-primary"></i>
                </div>
                <h1 className="display-2 text-primary mb-0"><Number n={17} /></h1>
              </div>
              <h5 className="text-center">Total Teachers</h5>
            </div>
            <div className="col-md-6 col-lg-3 wow fadeIn">
              <div className="d-flex align-items-center justify-content-evenly mb-2">
                <div className="d-flex align-items-center justify-content-center bg-light" style={{ width: "60px", height: "60px" }}>
                  <i className="fa fa-users fa-2x text-primary"></i>
                </div>
                <h1 className="display-2 text-primary mb-0"><Number n={244} /></h1>
              </div>
              <h5 className="text-center">Total Students</h5>
            </div>
            <div className="col-md-6 col-lg-3 wow fadeIn">
              <div className="d-flex align-items-center justify-content-evenly mb-2">
                <div className="d-flex align-items-center justify-content-center bg-light" style={{ width: "60px", height: "60px" }}>
                  <i className="fa fa-microchip fa-2x text-primary"></i>
                </div>
                <h1 className="display-2 text-primary mb-0"><Number n={5} /></h1>
              </div>
              <h5 className="text-center">Total Labs</h5>
            </div>
            <div className="col-md-6 col-lg-3 wow fadeIn">
              <div className="d-flex align-items-center justify-content-evenly mb-2">
                <div className="d-flex align-items-center justify-content-center bg-light" style={{ width: "60px", height: "60px" }}>
                  <i className="fa fa-laptop fa-2x text-primary"></i>
                </div>
                <h1 className="display-2 text-primary mb-0"><Number n={60} /></h1>
              </div>
              <h5 className="text-center">Total Computer</h5>
            </div>
          </div>
        </div>
      </div>
      {/* Feature End */}

      {/* Faculty Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="section-title text-center">
            <h1 className="display-5 mb-5">
              <a href="/Faculties">Our Faculties</a>
            </h1>
          </div>
          <div className="row g-4 p-3">
            <div className="col-md-6 col-lg-4 wow fadeInUp">
              <div className="team-item">
                <div className="overflow-hidden position-relative">
                  <img className="img-fluid" src="assets/Azad sir.jpeg" alt="" />
                  <div className="team-social">
                    <a className="btn btn-square" href="https://www.facebook.com/Hiron.RUET?mibextid=ZbWKwL"><i className="fab fa-facebook-f"></i></a>
                    <a className="btn btn-square" href="https://www.linkedin.com/in/azad-hossain-026b05260?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3B2g1ud9zKT2WT6EVJf8eRjg%3D%3D"><i className="fab fa-linkedin-in"></i></a>
                    <a className="btn btn-square" href="mailto:azad@cuet.ac.bd"><i className="fa fa-envelope" aria-hidden="true"></i></a>
                  </div>
                </div>
                <div className="p-4 text-center border border-5 border-light border-top-0">
                  <h4 className="mb-3">Dr. Md. Azad Hossain</h4>
                  <p>Head of the Depertment</p>
                  <a className="fw-medium" href="/faculty/azad@cuet.ac.bd">Read More<i
                    className="fa fa-arrow-right ms-2"></i></a>
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
                  <a className="fw-medium" href="/faculty/jahed@cuet.ac.bd">Read More<i
                    className="fa fa-arrow-right ms-2"></i></a>
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
                  <a className="fw-medium" href="/faculty/saiful05eee@cuet.ac.bd">Read More<i
                    className="fa fa-arrow-right ms-2"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Faculty End */}

      {/* Carousel Start */}
      {/* <div className="section-title text-center">
        <h1 className="display-5 mt-5 mb-5">
          <a href="/photo">Photo Gallery</a>
        </h1>
      </div>
      <div className="container-fluid p-0 pb-5">
        <div className="owl-carousel header-carousel position-relative">
          <div className="owl-carousel-item position-relative">
            <img className="img-fluid" src="/assets/bg16-9.jpg" alt="" />
          </div>
          <div className="owl-carousel-item position-relative">
            <img className="img-fluid" src="/assets/bg16-9.jpg" alt="" />
          </div>
          <div className="owl-carousel-item position-relative">
            <img className="img-fluid" src="/assets/bg16-9.jpg" alt="" />
          </div>
        </div>
      </div> */}
      {/*  Carousel End  */}
      <Carousel />

      <Footer />


      {/* Back to Top */}
      <a href="#" className="btn btn-lg btn-primary btn-lg-square rounded-0 back-to-top"><i className="bi bi-arrow-up"></i></a>
      {/* JavaScript Libraries */}
      {/* <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js"></script>
  <script src="lib/wow/wow.min.js"></script>
  <script src="lib/easing/easing.min.js"></script>
  <script src="lib/waypoints/waypoints.min.js"></script>
  <script src="lib/counterup/counterup.min.js"></script>
  <script src="lib/owlcarousel/owl.carousel.min.js"></script>
  <script src="lib/isotope/isotope.pkgd.min.js"></script>
  <script src="lib/lightbox/js/lightbox.min.js"></script>

  {/* Template Javascript */}
      <script src="js/main.js"></script>
    </div >
  )
}

export default Home
