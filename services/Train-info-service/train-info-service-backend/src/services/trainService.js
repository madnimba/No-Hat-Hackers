export const getTrains = async () => {
    return await axios.get('http://localhost:3000/api/trains');
};
