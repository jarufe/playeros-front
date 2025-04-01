import React, { useState } from 'react';
//Componentes reutilizables, hooks, etc
import { Link } from "react-router-dom"
import { registerServ } from '../services/apiAuthService.ts';
//Elementos de Material UI
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

export const RegisterComponent = () => {
    const [formData, setFormData] = useState({
        dni:"",
        ldap:"",
        email:"",
        contrasena:"",
        contrasena2:"",
        nombre:"",
        apellido:""
        });
    const [registerError, setRegisterError] = useState(false);
    const [registerOk, setRegisterOk] = useState(false);
    const [dniError, setDniError] = useState(false)
    const [ldapError, setLdapError] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [nombreError, setNombreError] = useState(false)
    const [apellidoError, setApellidoError] = useState(false)
    const [pasError, setPasError] = useState(false)

    const handleChangeText = (e) => {
        setFormData({...formData, [e.target.name]:e.target.value});
        setRegisterError(false);
        setRegisterOk(false);
        setDniError(false);
        setLdapError(false);
        setEmailError(false);
        setNombreError(false);
        setApellidoError(false);
        setPasError(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let esError = false;  //Variable dentro de la función para poder controlar el flujo. Las variables useState son para renderizar la pantalla al tiempo que cambian
        if (formData.dni === '') {
            setDniError(true);
            esError = true;
        }
        if (formData.ldap === '') {
            setLdapError(true);
            esError = true;
        }
        if (formData.contrasena === '' || formData.contrasena2 === '' || formData.contrasena !== formData.contrasena2) {
            setPasError(true);
            esError = true;
        }
        if (formData.email === '') {
            setEmailError(true);
            esError = true;
        }
        if (formData.nombre === '') {
            setNombreError(true);
            esError = true;
        }
        if (formData.apellido === '') {
            setApellidoError(true);
            esError = true;
        }
        if (!esError) {
            console.info("Proceder al registro en el Back");
            //Proceso de registro
            try {
                //Realiza el registro en el back
                const data = await registerServ(formData);
                //Muestra resultado
                console.info("Resultado del registro.", data);
                setFormData({
                    dni:"",
                    ldap:"",
                    email:"",
                    contrasena:"",
                    contrasena2:"",
                    nombre:"",
                    apellido:""
                });
                setRegisterError(false);
                setRegisterOk(true);
            } catch (error) {
                console.error('Error durante el registro', error);
                setRegisterError(true);
                setRegisterOk(false);
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
                Registro de usuario
            </Typography>
            <Stack spacing={2} direction="row" sx={{marginBottom: 4}}>
                <TextField
                    required
                    type="text"
                    name="dni"
                    label="DNI"
                    value={formData.dni}
                    onChange={handleChangeText}
                    error={dniError}
                />
                <TextField
                    required
                    type="text"
                    name="ldap"
                    label="LDAP"
                    value={formData.ldap}
                    onChange={handleChangeText}
                    error={ldapError}
                />
                <TextField
                    required
                    type="email"
                    name="email"
                    label="email"
                    value={formData.email}
                    onChange={handleChangeText}
                    error={emailError}
                />
            </Stack>
            <Stack spacing={2} direction="row" sx={{marginBottom: 4}}>
                <TextField
                    required
                    type="text"
                    name="nombre"
                    label="Nombre"
                    value={formData.nombre}
                    onChange={handleChangeText}
                    error={nombreError}
                />
                <TextField
                    required
                    type="text"
                    name="apellido"
                    label="Apellidos"
                    value={formData.apellido}
                    onChange={handleChangeText}
                    error={apellidoError}
                />
            </Stack>
            <Stack spacing={2} direction="row" sx={{marginBottom: 4}}>
                <TextField
                    required
                    type="password"
                    name="contrasena"
                    label="Password"
                    autoComplete="current-password"
                    value={formData.contrasena}
                    onChange={handleChangeText}
                    error={pasError}
                />
                <TextField
                    required
                    type="password"
                    name="contrasena2"
                    label="Repita Password"
                    autoComplete="current-password"
                    value={formData.contrasena2}
                    onChange={handleChangeText}
                    error={pasError}
                />
            </Stack>
            <div>
                <br/>
                <Button type="submit" variant="contained">Registrarse</Button>
                <br/>
            </div>
            <div>
                <small>Acceso a la parte pública <Link to="/infoglobal">aquí</Link></small>
                <br/>
                <small>¿Ya estás registrado?. Haz login <Link to="/login">aquí</Link></small>
            </div>
            <div>
                <br/>
                <Typography variant="h4" color="red" gutterBottom>
                    {registerError ? (<div>Error registrando al usuario.</div>) : <div>&nbsp;</div>}
                </Typography>
                <br/>
                <Typography variant="h4" gutterBottom>
                    {registerOk ? (<div>Registro de usuario correcto.</div>) : <div>&nbsp;</div>}
                </Typography>
            </div>
        </Box>
    );
};
