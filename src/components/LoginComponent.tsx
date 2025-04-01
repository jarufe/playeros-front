import React, { useState, useEffect } from 'react';
//Componentes reutilizables, hooks, etc
import { Link } from "react-router-dom"
import { loginServ } from '../services/apiAuthService.ts';
import { useAuth } from "../hooks/useAuth";
//Elementos de Material UI
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export const LoginComponent = () => {
    const [formData, setFormData] = useState({
        ldapOrDni:"",
        contrasena:"",
        });
    const { login } = useAuth();
    const [loginError, setLoginError] = useState(false);
    const [usuError, setUsuError] = useState(false)
    const [pasError, setPasError] = useState(false)

    useEffect(() => {
    }, []);

    const handleChangeText = (e) => {
        setFormData({...formData, [e.target.name]:e.target.value});
        setLoginError(false);
        setUsuError(false);
        setPasError(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let esError = false;  //Variable dentro de la función para poder controlar el flujo. Las variables useState son para renderizar la pantalla al tiempo que cambian
        if (formData.ldapOrDni === '') {
            setUsuError(true);
            esError = true;
        }
        if (formData.contrasena === '') {
            setPasError(true);
            esError = true;
        }
        if (!esError) {
            //Proceso de login
            try {
                //Realiza el login en el back
                const data = await loginServ(formData);
                //Gestiona el login con useAuth para guardar datos del login y usarlo en el PrivateRoute
                await login( data.accessToken);
            } catch (error) {
                console.error('Error haciendo login', error);
                setLoginError(true);
                setFormData({
                    ldapOrDni:"",
                    contrasena:"",
                    });
            }
        }
    };

    return (
        <Box
            component="form"
            sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
        >
            <Typography variant="h2" gutterBottom>
                Punto de entrada al sistema
            </Typography>
            <div>
                <TextField
                    required
                    name="ldapOrDni"
                    label="Usuario"
                    value={formData.ldapOrDni}
                    onChange={handleChangeText}
                    error={usuError}
                />
                <br/>
                <TextField
                    name="contrasena"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    value={formData.contrasena}
                    onChange={handleChangeText}
                    error={pasError}
                />
                <br/>
                <Button type="submit" variant="contained">Login</Button>
                <br/>
            </div>
            <div>
                <small>¿No tienes cuenta? <Link to="/registro">Date de alta aquí</Link></small>
                <br/>
                <small>Acceso a la parte pública <Link to="/infoglobal">aquí</Link></small>
            </div>
            <div>
                <br/>
                <Typography variant="h4" color="red" gutterBottom>
                    {loginError ? (<div>Error haciendo login.</div>) : <div>&nbsp;</div>}
                </Typography>
            </div>
        </Box>
    );
};
