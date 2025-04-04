import axios from 'axios';
import { Page, EquipamientoDto, BasicoDto } from '../shared/EntityTypes.ts';

const API_URL = 'http://localhost:8080/playeros-back/api/v1';

export const getEquipo = async (token: string, id: string) => {
    try {
        axios.defaults.withCredentials = true;
        const response = await axios.get<EquipamientoDto>(`${API_URL}/equipamiento/equipo?id=${id}`, 
            {
            headers: {
            'Authorization':'Bearer '+ token,
            }
          });
        return response.data;
    } catch (error) {
        console.error('Error leyendo del back un equipo del usuario y provincia activos:', error);
        throw error;
    }
};

export const getEquipamientoUsuarioActivo = async (token: string) => {
    try {
        axios.defaults.withCredentials = true;
        const response = await axios.get(`${API_URL}/equipamiento/propios`, 
            {
            headers: {
            'Authorization':'Bearer '+ token,
            }
          });
        return response.data;
    } catch (error) {
        console.error('Error leyendo del back el equipamiento de la provincia activa:', error);
        throw error;
    }
};

export const getEquipamientoUsuarioActivoPaging = async (token: string, page:number, size:number) => {
    try {
        axios.defaults.withCredentials = true;
        const response = await axios.get<Page<EquipamientoDto>>(`${API_URL}/equipamiento/propiospaging?page=${page}&size=${size}`, 
            {
            headers: {
            'Authorization':'Bearer '+ token,
            }
          });
        return response.data;
    } catch (error) {
        console.error('Error leyendo del back el equipamiento de la provincia activa:', error);
        throw error;
    }
};

export const getEquipamientoProvinciaActiva = async (token: string) => {
    try {
        axios.defaults.withCredentials = true;
        const response = await axios.get<EquipamientoDto[]>(`${API_URL}/equipamiento/provinciaactiva`, 
            {
            headers: {
            'Authorization':'Bearer '+ token,
            }
          });
        return response.data;
    } catch (error) {
        console.error('Error leyendo del back el equipamiento de la provincia activa:', error);
        throw error;
    }
};

export const getEquipamientoProvinciaActivaPaging = async (token: string, page: number, size: number) => {
    try {
        axios.defaults.withCredentials = true;
        const response = await axios.get<Page<EquipamientoDto>>(`${API_URL}/equipamiento/provinciaactivapaging?page=${page}&size=${size}`, 
            {
            headers: {
            'Authorization':'Bearer '+ token,
            }
          });
        return response.data;
    } catch (error) {
        console.error('Error leyendo del back el equipamiento de la provincia activa:', error);
        throw error;
    }
};

export const getEquipamientoValidoUsuarioActivo = async (token: string) => {
    try {
        axios.defaults.withCredentials = true;
        const response = await axios.get(`${API_URL}/equipamiento/propios/validos`, 
            {
            headers: {
            'Authorization':'Bearer '+ token,
            }
          });
        return response.data;
    } catch (error) {
        console.error('Error leyendo del back el equipamiento de la provincia activa:', error);
        throw error;
    }
};

export const getEquipamientoValidoUsuarioActivoPaging = async (token: string, page:number, size:number) => {
    try {
        axios.defaults.withCredentials = true;
        const response = await axios.get<Page<EquipamientoDto>>(`${API_URL}/equipamiento/propiospaging/validos?page=${page}&size=${size}`, 
            {
            headers: {
            'Authorization':'Bearer '+ token,
            }
          });
        return response.data;
    } catch (error) {
        console.error('Error leyendo del back el equipamiento de la provincia activa:', error);
        throw error;
    }
};

export const getEquipamientoValidoProvinciaActiva = async (token: string) => {
    try {
        axios.defaults.withCredentials = true;
        const response = await axios.get<EquipamientoDto[]>(`${API_URL}/equipamiento/provinciaactiva/validos`, 
            {
            headers: {
            'Authorization':'Bearer '+ token,
            }
          });
        return response.data;
    } catch (error) {
        console.error('Error leyendo del back el equipamiento de la provincia activa:', error);
        throw error;
    }
};

export const getEquipamientoValidoProvinciaActivaPaging = async (token: string, page: number, size: number) => {
    try {
        axios.defaults.withCredentials = true;
        const response = await axios.get<Page<EquipamientoDto>>(`${API_URL}/equipamiento/provinciaactivapaging/validos?page=${page}&size=${size}`, 
            {
            headers: {
            'Authorization':'Bearer '+ token,
            }
          });
        return response.data;
    } catch (error) {
        console.error('Error leyendo del back el equipamiento de la provincia activa:', error);
        throw error;
    }
};

export const addUpdateEquipo = async (token: string, equ: EquipamientoDto) => {
    try {
        axios.defaults.withCredentials = true;
        const response = await axios.post<EquipamientoDto>(`${API_URL}/equipamiento/addupdateequipo`, equ, 
            {
            headers: {
            'Authorization':'Bearer '+ token,
            }
          });
        return response.data;
    } catch (error) {
        console.error('Error durante la creación en el back de un equipo del usuario y provincia activos:', error);
        throw error;
    }
};

export const getTipos = async (token) => {
    try {
        axios.defaults.withCredentials = true;
        const response = await axios.get<BasicoDto[]>(`${API_URL}/equipamiento/tipos`, 
            {
            headers: {
            'Authorization':'Bearer '+ token,
            }
          });
        return response.data;
    } catch (error) {
        console.error('Error leyendo del back los tipos de equipos:', error);
        throw error;
    }
};

export const getEstados = async (token) => {
    try {
        axios.defaults.withCredentials = true;
        const response = await axios.get<BasicoDto[]>(`${API_URL}/equipamiento/estados`, 
            {
            headers: {
            'Authorization':'Bearer '+ token,
            }
          });
        return response.data;
    } catch (error) {
        console.error('Error leyendo del back los estados de equipos:', error);
        throw error;
    }
};
