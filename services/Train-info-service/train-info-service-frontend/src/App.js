import React, { useState, useEffect } from 'react';
import SearchForm from './components/SearchForm';
import TrainResults from './components/TrainResults';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const App = () => {
    const [results, setResults] = useState([]);
    const [userID, setUserID] = useState(null);

    // Extract the userID from the URL query parameter when the component mounts
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const userIdFromUrl = params.get('userID');
        setUserID(userIdFromUrl);
    }, [location]);

    const handleSearchResults = (results) => {

        setResults(results);

    }

    const handleBuyTicket = async (selectedSeat, fare) => {
        const bookingData = {
            user_id: userID, // Hardcoded for now, replace with actual user ID
            train_id: selectedSeat.train_id,
            coach_id: selectedSeat.coach_id,
            seat_id: selectedSeat.seat_id,
            date: selectedSeat.date, // Pass the booking date
            fare,
        };
        console.log(bookingData);
        try {
            // Inter-service communication with Booking Service
            const response = await axios.post('http://localhost:4001/api/bookings', bookingData);
            // alert('Ticket booked successfully!');
            const { userid, redirectUrl } = response.data;
            // Redirect to OTP service page with the email query parameter
            window.location.href = `${redirectUrl}?id=${userid}`;
        } catch (error) {
            console.error('Error booking the ticket:', error);
        }
    };

    return (
        <div className="App">
            <h1>Search for Trains</h1>
            <SearchForm onResults={handleSearchResults} />
            <TrainResults results={results} onBuyTicket={handleBuyTicket} />
        </div>
    );
}

export default App;
