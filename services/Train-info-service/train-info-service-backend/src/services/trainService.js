export const getTrains = async () => {
    return await axios.get(`${process.env.REACT_APP_API_URL}/api/trains`);
};

