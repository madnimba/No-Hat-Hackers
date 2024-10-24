import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const TrainResults = ({ results, onBuyTicket }) => {

    const [selectedSeat, setSelectedSeat] = useState(null);
    const [fare, setFare] = useState(0);
    const [selectedCoach, setSelectedCoach] = useState({}); // Track the selected coach for each train

    // Function to handle seat selection
    const handleSeatClick = (seat, fare) => {
        setSelectedSeat(seat);
        setFare(fare);
    };

    // Function to handle coach selection for each train
    const handleCoachChange = (trainKey, coachId) => {
        setSelectedCoach({ ...selectedCoach, [trainKey]: coachId });
    };

    if (!results || results.length === 0) {
        return (
            <Typography variant="h6" align="center" color="textSecondary">
                No results found.
            </Typography>
        );
    }

    const groupedByTrain = results.reduce((acc, cur) => {
        const trainKey = `${cur.train_id}-${cur.train_name}`;
        if (!acc[trainKey]) {
            acc[trainKey] = [];
        }
        acc[trainKey].push(cur);
        return acc;
    }, {});

    return (
        <Box sx={{ padding: 2 }}>
            {Object.keys(groupedByTrain).map((trainKey) => {
                const trainData = groupedByTrain[trainKey];
                const train = trainData[0]; // All items have the same train info
                const uniqueCoaches = [...new Set(trainData.map(coach => coach.coach_id))]; // Get unique coaches for the train

                return (
                    <Paper elevation={3} sx={{ padding: 2, marginBottom: 3, maxWidth: '600px', margin: 'auto' }} key={trainKey}>
                        <Typography variant="h5" gutterBottom>
                            {train.train_name}
                        </Typography>

                        {/* Dropdown for selecting a coach */}
                        <FormControl fullWidth>
                            <InputLabel id={`select-coach-label-${trainKey}`}>Select Coach</InputLabel>
                            <Select
                                labelId={`select-coach-label-${trainKey}`}
                                value={selectedCoach[trainKey] || ''}
                                onChange={(e) => handleCoachChange(trainKey, e.target.value)}
                            >
                                {uniqueCoaches.map(coachId => (
                                    <MenuItem key={coachId} value={coachId}>
                                        {coachId}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Show seats for the selected coach */}
                        {selectedCoach[trainKey] && (
                            <Box sx={{ marginTop: 2 }}>
                                <Typography variant="h6">Coach: {selectedCoach[trainKey]}</Typography>
                                <Grid container spacing={1} sx={{ marginTop: 1 }}>
                                    {trainData
                                        .filter(coach => coach.coach_id === selectedCoach[trainKey])
                                        .map(seat => (
                                            <Grid item key={`${seat.train_id}-${seat.coach_id}-${seat.seat_id}`}>
                                                <Box
                                                    onClick={() => handleSeatClick(seat, seat.fare)}
                                                    sx={{
                                                        width: 30,
                                                        height: 30,
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        backgroundColor: seat.available
                                                            ? selectedSeat && selectedSeat.train_id === seat.train_id &&
                                                                selectedSeat.coach_id === seat.coach_id &&
                                                                selectedSeat.seat_id === seat.seat_id
                                                                ? 'blue'
                                                                : 'green'
                                                            : 'red',
                                                        color: 'white',
                                                        borderRadius: '4px',
                                                        cursor: seat.available ? 'pointer' : 'not-allowed',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    {seat.seat_id}
                                                </Box>
                                            </Grid>
                                        ))}
                                </Grid>
                            </Box>
                        )}

                        {selectedSeat && (
                            <Box sx={{ marginTop: 2 }}>
                                <Typography variant="h6">Selected Seat: {selectedSeat.seat_id}</Typography>
                                <Typography variant="h6">Fare: {fare} BDT</Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => onBuyTicket(selectedSeat, fare)}
                                >
                                    Buy This Ticket
                                </Button>
                            </Box>
                        )}
                    </Paper>
                );
            })}
        </Box>
    );
};

export default TrainResults;
