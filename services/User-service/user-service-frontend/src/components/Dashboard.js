import React from 'react';
import { Typography, Container, Box } from '@mui/material';

const Dashboard = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to the Dashboard!
        </Typography>
        <Typography>
          You can now interact with the train-information service.
        </Typography>
      </Box>
    </Container>
  );
};

export default Dashboard;
