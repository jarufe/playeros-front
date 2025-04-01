import axios from 'axios';
import { BasicoDto, FuncionalidadDto } from '../shared/EntityTypes.ts';

const API_URL = 'http://localhost:8080/playeros-back/api/v1';

export const getModulos = async (token) => {
    try {
        axios.defaults.withCredentials = true;
        const response = await axios.get<BasicoDto[]>(`${API_URL}/usuario/modulos`, 
            {
            headers: {
            'Authorization':'Bearer '+ token,
            }
          });
        return response.data;
    } catch (error) {
        console.error('Error leyendo del back los módulos:', error);
        throw error;
    }
};

export const getFuncionalidades = async (token) => {
    try {
        axios.defaults.withCredentials = true;
        const response = await axios.get<FuncionalidadDto[]>(`${API_URL}/usuario/funcionalidades`, 
            {
            headers: {
            'Authorization':'Bearer '+ token,
            }
          });
        return response.data;
    } catch (error) {
        console.error('Error leyendo del back las funcionalidades:', error);
        throw error;
    }
};

export const getProvinciaActiva = async (token) => {
    try {
        axios.defaults.withCredentials = true;
        const response = await axios.get(`${API_URL}/usuario/provincias/activa`, 
            {
            headers: {
            'Authorization':'Bearer '+ token,
            }
          });
        return response.data;
    } catch (error) {
        console.error('Error leyendo del back la provincia activa:', error);
        throw error;
    }
};

export const getIdiomasProvinciaActiva = async (token) => {
    try {
        axios.defaults.withCredentials = true;
        const response = await axios.get(`${API_URL}/usuario/idiomas/provinciaactiva`, 
            {
            headers: {
            'Authorization':'Bearer '+ token,
            }
          });
        return response.data;
    } catch (error) {
        console.error('Error leyendo del back los idiomas de la provincia activa:', error);
        throw error;
    }
};

export const getUsuariosBasicosProvinciaActiva = async (token) => {
    try {
        axios.defaults.withCredentials = true;
        const response = await axios.get<BasicoDto[]>(`${API_URL}/usuario/usuariosbasicos/provinciaactiva`, 
            {
            headers: {
            'Authorization':'Bearer '+ token,
            }
          });
        return response.data;
    } catch (error) {
        console.error('Error leyendo del back los usuarios de la provincia activa:', error);
        throw error;
    }
};

export const isFuncionalidadAutorizada = (token, funcionalidad) => {
    try {
        console.info("Funcionalidad: ", {funcionalidad});
        axios.defaults.withCredentials = true;
        let promise = axios.get(`${API_URL}/usuario/funcionalidades/autorizada`, 
            {
                params: { funcionalidad: funcionalidad },
                headers: {
                'Authorization':'Bearer '+ token,
                }
        }).then(function (response) {
            return response.data;
        });
        return promise;
    } catch (error) {
        console.error('Error leyendo del back si la funcionalidad está autorizada:', error);
        throw error;
    }
};

export const isAdminOSuperusu = (token) => {
    try {
        axios.defaults.withCredentials = true;
        let promise = axios.get(`${API_URL}/usuario/esadminosuperusu`, 
            {
                headers: {
                'Authorization':'Bearer '+ token,
                }
        }).then(function (response) {
            return response.data;
        });
        return promise;
    } catch (error) {
        console.error('Error leyendo del back si es un usuario especial:', error);
        throw error;
    }
};
