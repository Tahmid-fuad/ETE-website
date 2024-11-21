function Footer() {
  return (
    <div>
      {/* Back to Top */}
      <a href="#" className="btn btn-lg btn-primary btn-lg-square rounded-0 back-to-top"><i className="bi bi-arrow-up"></i></a>
      {/* Footer Start */}
      <div className="container-fluid bg-dark text-light footer pt-5 wow fadeIn">
        <div className="container py-5">
          <div className="row g-5">
            <div className="col-lg-4 col-md-6">
              <h4 className="text-light mb-4">Address</h4>
              <p className="mb-2"><i className="fa fa-map-marker-alt me-3"></i>Academic Building 3, CUET, Pahartoli, Raozan,
                Chittagong - 4349, Bangladesh</p>
              <p className="mb-2"><i className="fa fa-phone-alt me-3"></i>+8801783756981</p>
              <p className="mb-2"><i className="fa fa-envelope me-3"></i>azad@cuet.ac.bd</p>
              <div className="d-flex pt-2">
                <a className="btn btn-outline-light btn-social" href=""><i className="fa-brands fa-x-twitter"></i></a>
                <a className="btn btn-outline-light btn-social" href="https://www.facebook.com/cuetete2012"><i className="fab fa-facebook-f"></i></a>
                <a className="btn btn-outline-light btn-social" href="https://www.youtube.com/@cuetete4770"><i className="fab fa-youtube"></i></a>
                <a className="btn btn-outline-light btn-social" href=""><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <h4 className="text-light mb-4">Quick Links</h4>
              <a className="btn btn-link" href="/About">About Us</a>
              <a className="btn btn-link" href="/contact">Contact Us</a>
              <a className="btn btn-link" href="/faculties">Our Faculties</a>
              <a className="btn btn-link" href="https://cuet.ac.bd">CUET Website</a>
            </div>
            <div className="col-lg-4 col-md-6">
              <h4 className="text-light mb-4">Our Location</h4>
              {/* <p>Dolor amet sit justo amet elitr clita ipsum elitr est.</p> */}
              {/* <div className="position-relative mx-auto" style="max-width: 400px;">
                        <input className="form-control border-0 w-100 py-3 ps-4 pe-5" type="text" placeholder="Your email">
                        <button type="button" className="btn btn-primary py-2 position-absolute top-0 end-0 mt-2 me-2">SignUp</button>
                    </div> */}
              <div className="">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3687.07766970986!2d91.97401980000001!3d22.463715399999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30ad2fcca555dc4d%3A0x9476f7bf1bbeddb3!2sDepartment%20of%20Electronics%20%26%20Telecommunication%20Engineering!5e0!3m2!1sen!2sbd!4v1708974023568!5m2!1sen!2sbd"
                  width="400" height="250" style={{ border: "0" }} allowFullScreen="" loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"></iframe>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="copyright">
            <div className="row">
              <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                &copy; All Right Reserved.
              </div>
              <div className="col-md-6 text-center text-md-end">
                Developed By Nusrat and Tahmid
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer End */}
    </div>
  )
}

export default Footer
