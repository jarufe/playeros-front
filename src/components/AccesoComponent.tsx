import React, { useEffect } from 'react';
import Cookies from 'js-cookie';
//Componentes reutilizables, hooks, etc
import { useAuth } from "../hooks/useAuth";
//Elementos de Material UI
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export const AccesoComponent = () => {
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        };
       
    useEffect(() => {
        Cookies.set('modulo_id', 'ACCESO', { path: '/' });
    }, []);

    return (
        <div>
            <Typography variant="h2" gutterBottom>
                Gestión de Accesos
            </Typography>
            <Button onClick={handleLogout} variant="contained">Logout</Button>
        </div>
    );
};
