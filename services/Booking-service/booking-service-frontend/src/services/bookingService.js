import axios from 'axios';

export const getBookings = async () => {
    return await axios.get('http://localhost:3001/api/bookings');
};
