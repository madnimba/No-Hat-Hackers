import React, { useState } from 'react';
import SearchForm from './components/SearchForm';
import TrainResults from './components/TrainResults';
import axios from 'axios';

const App = () => {
    const [results, setResults] = useState([]);

    const handleSearchResults = (results) => {

        setResults(results);

    }

    const handleBuyTicket = async (selectedSeat, fare) => {
        const bookingData = {
            user_id: 123, // Hardcoded for now, replace with actual user ID
            train_id: selectedSeat.train_id,
            coach_id: selectedSeat.coach_id,
            seat_id: selectedSeat.seat_id,
            date: selectedSeat.date, // Pass the booking date
            fare,
        };
        console.log(bookingData);
        try {
            // Inter-service communication with Booking Service
            await axios.post('http://localhost:4000/api/bookings', bookingData);
            alert('Ticket booked successfully!');
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
