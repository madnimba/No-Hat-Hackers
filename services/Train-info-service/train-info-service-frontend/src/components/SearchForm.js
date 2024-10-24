import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Grid, Paper, Typography, Box, MenuItem } from '@mui/material';

const SearchForm = ({ onResults }) => {
    const [formData, setFormData] = useState({
        from_station: '',
        to_station: '',
        booking_date: '',
        coach_type: ''
    });

    const coachTypes = ['Shovon', 'Snigdha', 'S-Chair' , 'AC-Berth']; // Example options for coach types

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get('http://train-info-backend:4000/api/trains/search', {
                params: formData
            });
            onResults(response.data);
        } catch (error) {
            console.error('Error fetching trains:', error);
        }
    };

    return (
        <Paper elevation={3} sx={{ padding: 4, marginTop: 5, maxWidth: 500, mx: 'auto' }}>
            <Typography variant="h6" gutterBottom align="center">
                Search Trains
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="From Station"
                            name="from_station"
                            value={formData.from_station}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="To Station"
                            name="to_station"
                            value={formData.to_station}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Booking Date"
                            type="date"
                            name="booking_date"
                            value={formData.booking_date}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            select
                            label="Coach Type"
                            name="coach_type"
                            value={formData.coach_type}
                            onChange={handleChange}
                            required
                        >
                            {coachTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                            <Button variant="contained" color="primary" type="submit">
                                Search Trains
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
};

export default SearchForm;
