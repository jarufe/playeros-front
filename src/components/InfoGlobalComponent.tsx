import React, { useEffect } from 'react';
//Componentes reutilizables, hooks, etc
import { Link } from "react-router-dom"
//Elementos de Material UI
import Typography from '@mui/material/Typography';

export const InfoGlobalComponent = () => {
    useEffect(() => {
    }, []);

    return (
        <div>
            <Typography variant="h2" gutterBottom>
                Info Global
            </Typography>
            <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </div>
            <br/>
            <div>
                <small>Acceso a la parte privada <Link to="/login">aquí</Link></small>
            </div>
        </div>
    );
};
