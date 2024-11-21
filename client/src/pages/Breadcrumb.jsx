import { useEffect, useState } from "react";

function Breadcrumb() {
  const [breadcrumbText, setBreadcrumbText] = useState('Home');

  useEffect(() => {
    const currentPath = window.location.pathname;

    if (currentPath.startsWith('/faculty/')) {
      setBreadcrumbText('Faculty');
    } else {
      switch (currentPath) {
        case '/photo':
          setBreadcrumbText('Our Photos');
          break;
        case '/faculties':
          setBreadcrumbText('Our Faculties');
          break;
        case '/About':
          setBreadcrumbText('About');
          break;
        case '/contact':
          setBreadcrumbText('Contact');
          break;
          case '/Notices':
            setBreadcrumbText('Notices');
            break;
        default:
          setBreadcrumbText('Home');
      }
    }

  }, []);
  return (
    <div>
      <div className="container-fluid page-header py-1 mb-3" style={{ height: "10rem" }}>
        <div className="container py-2">
          <h1 className="display-3 text-white mb-3 animated slideInDown">{breadcrumbText}</h1>
          <nav aria-label="breadcrumb animated slideInDown">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a className="text-white" href="/">Home</a></li>
              {/* <!-- <li className="breadcrumb-item"><a className="text-white" href="#">Pages</a></li> --> */}
              <li className="breadcrumb-item text-white active" aria-current="page">{breadcrumbText}</li>
            </ol>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Breadcrumb
