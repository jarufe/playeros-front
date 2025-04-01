import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
//Componentes reutilizables, hooks, etc
import { useAuth } from "../hooks/useAuth";
import { getIdiomasProvinciaActiva } from '../services/apiUsuarioService.ts';
import { ComprobandoComponent } from './ComprobandoComponent.tsx';
//Elementos de Material UI
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export const InventarioComponent = () => {
    const [idiomas, setIdiomas] = useState([]);
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        };
      
    useEffect(() => {
        //Lo siguiente es solo para probar más consultas y el uso de cookies entre back y front
        try {
            //En el back, esta llamada va a recuperar los idiomas usando el valor de la provincia activa según la cookie "provincia_id"
            const data = getIdiomasProvinciaActiva(user);
            data?.then((data: []) => {
                setIdiomas(data);
                setIsLoading(false)
            });
            //Lee la cookie para ver que sigue existiendo
            //const provCookie = Cookies.get('provincia_id');
            return () => setIsLoading(true)
        } catch (error) {
            console.error('Error leyendo idiomas', error);
        }
    }, [user]);

    //Establece una cookie con el id del módulo actual
    Cookies.set('modulo_id', 'INVENTARIO', { path: '/' });

    if (isLoading) {
        return <ComprobandoComponent />;
    } else {
        return (
            <div>
                <Typography variant="h2" gutterBottom>
                    Gestión de Inventario
                </Typography>
                <div>
                    {idiomas?.map((idioma) => (
                        <small key={idioma}>{idioma} &nbsp;</small>
                    ))}
                </div>
                <p>&nbsp;</p>
                <Button onClick={handleLogout} variant="contained">Logout</Button>
            </div>
        );
    }
};
