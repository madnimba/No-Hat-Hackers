export const getTrains = async () => {
    return await axios.get('http://train-info-backend:4000/api/trains');
};
