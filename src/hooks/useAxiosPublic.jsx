import axios from "axios";

const axiosPublic = axios.create({
    baseURL: 'https://jalpaan-backend-server.onrender.com/'
})

const useAxiosPublic = () => {
    return axiosPublic;
};

export default useAxiosPublic;
