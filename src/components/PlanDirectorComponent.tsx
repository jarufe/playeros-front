import React, { useEffect } from 'react';
import Cookies from 'js-cookie';
//Componentes reutilizables, hooks, etc
import { useAuth } from "../hooks/useAuth";
//Elementos de Material UI
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export const PlanDirectorComponent = () => {
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        };
       
    useEffect(() => {
        //Establece una cookie con el id del módulo actual
        Cookies.set('modulo_id', 'PLANDIRECTOR', { path: '/' });
    }, []);

    return (
        <div>
            <Typography variant="h2" gutterBottom>
                Gestión de Plan Director
            </Typography>
            <Button onClick={handleLogout} variant="contained">Logout</Button>
        </div>
    );
};
