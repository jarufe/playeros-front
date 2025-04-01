import axios from 'axios';

const API_URL = 'http://localhost:8080/playeros-back/api/v1';

export const loginServ = async (datos) => {
    try {
        axios.defaults.withCredentials = true;
        const response = await axios.post(`${API_URL}/auth/login`, datos);
        //Devuelve la respuesta llegada desde el servidor (token)
        console.log('Respuesta recibida:', response.data);        
        return response.data;
    } catch (error) {
        console.error('Error haciendo login en la aplicación:', error);
        throw error;
    }
};

export const registerServ = async (datos) => {
    try {
        axios.defaults.withCredentials = true;
        const response = await axios.post(`${API_URL}/auth/register`, datos);
        return response.data;
    } catch (error) {
        console.error('Error registrando usuario en la aplicación:', error);
        throw error;
    }
};
