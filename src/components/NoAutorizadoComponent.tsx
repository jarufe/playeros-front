import React from 'react';
//Componentes reutilizables, hooks, etc
import { Link } from "react-router-dom"
//Elementos de Material UI
import Typography from '@mui/material/Typography';

export const NoAutorizadoComponent = () => {

    return (
        <div>
            <Typography variant="h2" gutterBottom>
                Acceso no autorizado
            </Typography>
            <div>
                Tu perfil de usuario no te permite acceder a esta funcionalidad.
            </div>
            <br/>
            <div>
                <small>Puedes probar con otro usuario, haciendo login <Link to="/login">aquí</Link></small>
            </div>
        </div>
    );
};
