import React, { useState, useEffect } from 'react';
//import Cookies from 'js-cookie';
//Componentes reutilizables, hooks, etc
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { getModulos, getProvinciaActiva, getFuncionalidades } from '../services/apiUsuarioService.ts';
import { BasicoDto } from "../shared/EntityTypes.ts"
//Elementos de Material UI
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';


export const ModulosComponent = () => {
    const [modulos, setModulos] = useState<BasicoDto[]>([]);
    const [provincia, setProvincia] = useState("");
    const { logout } = useAuth();
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
      };
    // call this function to sign out logged in user
    const handleNavigate = (modulo) => {
        navigate(modulo.url);
    };

    useEffect(() => {
        fetchModulos();
        //Al recuperar la provincia activa, también se crea una cookie "provincia_id" para usar en el resto del programa
        fetchProvinciaActiva();
        //Al recuperar las funcionalidades a las que puede acceder un usuario, también se crea una cookie "funcionalidades" para usar en el resto del programa
        fetchFuncionalidades();
    }, []);

    const fetchModulos = async () => {
        try {
            const data = await getModulos(user);
            setModulos(data);
        } catch (error) {
            console.error('Error leyendo módulos del back', error);
        }
    };
    const fetchProvinciaActiva = async () => {
        try {
            //En el back, esta llamada va a recuperar la provincia activa de la BD, pero también va a crear una Cookie "provincia_id"
            const data = await getProvinciaActiva(user);
            setProvincia(data);
            //console.info("Provincia activa según BD: ", data);
            //Lee la cookie que habrá creado el back
            //const provCookie = Cookies.get('provincia_id');
            //console.info('Provincia activa según Cookie:', provCookie);        
        } catch (error) {
            console.error('Error leyendo y estableciendo provincia activa', error);
        }
    };    
    const fetchFuncionalidades = async () => {
        try {
            //En el back, esta llamada va a recuperar las funcionalidades de los perfiles del usuario, pero también va a crear una Cookie "funcionalidades"
            //El dato devuelto es una estructura Fun
            const data = await getFuncionalidades(user);
            //setFuncionalidades(data);
            //console.info("Funcionalidades según BD: ", data);
            //Lee la cookie que habrá creado el back
            //const funcCookie = Cookies.get('funcionalidades');
            //console.info('Funcionalidades según Cookie:', funcCookie);        
        } catch (error) {
            console.error('Error leyendo y estableciendo provincia activa', error);
        }
    };    

    const styles = {
        tituloModulo: {
          color: "black",
          textAlign: "left",
          textTransform: "none",
          marginTop: "10px",
          overflow: "hidden",
        },
    }
    
    return (
        <div>
            <Typography variant="h2" gutterBottom>
                Gestión de Módulos
            </Typography>
            <Box
                sx={{
                marginTop: "24px",
                display: "flex",
                flexGrow: 1,
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
                }}
            >
                {modulos.map((modulo: BasicoDto) => (
                    <Button 
                        key={modulo.id}
                        sx={{
                            backgroundColor: "#EEEDED",
                            width: "45%",
                            height: "120px",
                            padding: "30px",
                            marginBottom: "24px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                            }}
                        onClick={() => handleNavigate(modulo)}
                    >
                        <Typography sx={styles.tituloModulo}>
                            {modulo.descr}
                        </Typography>
                    </Button>
                ))}
            </Box>
            <small>Provincia: {provincia} &nbsp;</small>
            <br/>
            &nbsp;
            <div>
                <Button onClick={handleLogout} variant="contained">Logout</Button>
            </div>
        </div>
    );
};
