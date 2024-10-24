import React, { useEffect, useState } from 'react';
import { getTrains } from '../services/trainService';

const TrainList = () => {
    const [trains, setTrains] = useState([]);

    useEffect(() => {
        loadTrains();
    }, []);

    const loadTrains = async () => {
        const response = await getTrains();
        setTrains(response.data);
    };

    return (
        <div>
            <h1>Available Trains</h1>
            <ul>
                {trains.map(train => (
                    <li key={train._id}>
                        {train.name} - {train.route.join(' -> ')} - Seats: {train.availableSeats}/{train.totalSeats}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TrainList;
