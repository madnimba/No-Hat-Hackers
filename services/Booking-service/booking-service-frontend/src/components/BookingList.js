import React, { useEffect, useState } from 'react';
import { getBookings } from '../services/bookingService';

const BookingList = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        const response = await getBookings();
        setBookings(response.data);
    };

    return (
        <div>
            <h1>Bookings</h1>
            <ul>
                {bookings.map(booking => (
                    <li key={booking.id}>
                        Booking ID: {booking.id}, Train: {booking.train_id}, Seat: {booking.seat_number}, Status: {booking.status}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BookingList;
