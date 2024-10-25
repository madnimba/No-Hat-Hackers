import React from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';

const Dashboard = () => {
    const location = useLocation();
    
    // Extract userID from URL query parameters
    const params = new URLSearchParams(location.search);
    const userID = params.get('userId');
    
    // Function to navigate to Train Info service with userID
    const goToTrainInfo = () => {
        window.location.href = `http://localhost:3000?userID=${userID}`;
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>
                    Welcome to your Dashboard!
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Your user ID is: {userID}
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={goToTrainInfo} 
                    sx={{ mt: 3 }}
                >
                    Go to Train Info
                </Button>
            </Box>
        </Container>
    );
};

export default Dashboard;