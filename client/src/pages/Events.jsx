import axios from 'axios';
import React, { useEffect, useState } from 'react'

function Events() {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:3001/fetchEvent');
                setEvents(response.data);
            } catch (err) {
                setError('Failed to load events. Please try again later.');
            }
        };

        fetchEvents();
    }, []);

    const month = {
        '1': 'Jan',
        '2': 'Feb',
        '3': 'Mar',
        '4': 'Apr',
        '5': 'May',
        '6': 'Jun',
        '7': 'Jul',
        '8': 'Aug',
        '9': 'Sep',
        '10': 'Oct',
        '11': 'Nov',
        '12': 'Dec',
    };

    return (
        <div>
            <div className="ms-xxl-1 me-xxl-1 bg-white p-3 mb-xxl-2" style={{ height: "350px" }}>
                <div className="heading-sect">
                    <h3 className="m-0 p-0 fs-6 fw-semibold">Upcoming Events</h3>
                </div>
                <ul className="upcoming-event-list">
                    {error ? (
                        <li>{error}</li>
                    ) : (
                        events
                            .map((event) => (
                                <li key={event._id}>
                                    <span className="event-date">{event.eventDay} <br />
                                        {month[event.eventMonth]}</span><span> {event.eventName}</span>
                                </li>
                            ))
                    )}
                </ul>
            </div>
        </div>
    )
}

export default Events
{/* <li> </li>
                    <li><span className="event-date">7 <br />
                        Mar</span><span> Bangabandhu's speech</span> </li>
                    <li><span className="event-date">13 <br />
                        Mar</span><span> Important birthday</span> </li>
                    <li><span className="event-date">17 <br />
                        Mar</span><span> Bangabandhu's birthday</span> </li> */}