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
            <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </div>
            <Button onClick={handleLogout} variant="contained">Logout</Button>
        </div>
    );
};
