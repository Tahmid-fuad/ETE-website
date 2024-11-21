import Footer from "./Footer"
import Header from "./Header"

function Error() {
    return (
        <div>
            <Header />
            <div className="container-xxl py-5 wow fadeInUp" >
                <div className="container text-center">
                    <div className="row justify-content-center">
                        <div className="col-lg-6">
                            <i className="bi bi-exclamation-triangle display-1 text-primary"></i>
                            <h1 className="display-1">404</h1>
                            <h1 className="mb-4">Page Not Found</h1>
                            <p className="mb-4">We’re sorry, the page you have looked for is not found!</p>
                            <a className="btn btn-primary py-3 px-5" href="/">Go Back To Home</a>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Error
