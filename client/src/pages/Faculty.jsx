import React, { useEffect, useState } from 'react'
import Header from './Header'
import Breadcrumb from './Breadcrumb'
import Footer from './Footer'
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Faculty() {
    const { email } = useParams();
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [desig, setDesig] = useState('');
    const [foi, setFoi] = useState('');
    const [quali, setQuali] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    const [publication, setPublication] = useState([]);

    useEffect(() => {
        const fetchFaculty = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/faculty/${email}`);
                setName(response.data.name);
                setNumber(response.data.number);
                setDesig(response.data.desig);
                setFoi(response.data.foi);
                setQuali(response.data.quali);
                setPublication(response.data.publications);
                setPhotoUrl(`http://localhost:3001/teacher-photo/${email}`);
            } catch (error) {
                console.error('Error fetching faculty data', error);
            }
        };
        fetchFaculty();
    }, [])

    let designation = '';
    switch (desig) {
        case '1':
            designation = 'Professor';
            break;
        case '2':
            designation = 'Associate Professor';
            break;
        case '3':
            designation = 'Assistant Professor';
            break;
        case '4':
            designation = 'Lecturer';
            break;
        default:
            // designation = 'Unknown Designation';
            break;
    }

    const systemFontStyle = {
        fontSize: "1rem",
        fontFamily: `system-ui,-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'`
    };

    return (
        <div>
            <Header />
            <Breadcrumb />
            <div className="container">
                <div className="row">
                    <div className="col-3">
                        {photoUrl ? (
                            <img src={photoUrl} className="img-fluid" />
                        ) : (
                            <div>Loading photo...</div>
                        )}
                    </div>
                    <div className="col-8">
                        <h3 className="text-start">{name}</h3>
                        <h5 className="fw-lighter mb-4">{designation}</h5>
                        <div className="row">
                            <div className="col-3 pe-0">
                                <p className="fw-medium pt-2">Field of Interest:</p>
                            </div>
                            <div className="col-9 ps-0">
                                <pre className="pt-2" style={systemFontStyle}>
                                    {foi}
                                </pre>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-3 pe-0">
                                <p className="fw-medium pt-2">Qualification:</p>
                            </div>
                            <div className="col-9 ps-0">
                                <pre className="pt-2" style={systemFontStyle}>
                                    {quali}
                                </pre>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-3 pe-0">
                                <p className="fw-medium pt-2">Contact Info:</p>
                            </div>
                            <div className="col-9 ps-0">
                                <p className="pt-2">
                                    <i className="fa fa-phone fa-flip-horizontal"></i> {number}<br />
                                    <i className="fa fa-at"></i> {email}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container mt-5">
                    <h4>Publications</h4>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th style={{ width: "5%" }}>SN</th>
                                <th style={{ width: "30%" }}>Title</th>
                                <th style={{ width: "30%" }}>Authors</th>
                                <th style={{ width: "25%" }}>Info</th>
                                <th style={{ width: "10%" }}>Year</th>
                            </tr>
                        </thead>
                        <tbody>
                            {publication.map((publication, idx) => (
                                <tr key={idx}>
                                    <td>{publication.sn}</td>
                                    <td>{publication.title}</td>
                                    <td>{publication.authors}</td>
                                    <td>{publication.info}</td>
                                    <td>{publication.year}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Footer />
        </div>

    )
}

export default Faculty
