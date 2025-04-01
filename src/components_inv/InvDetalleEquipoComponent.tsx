import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
//Componentes reutilizables, hooks, etc
import { useAuth } from "../hooks/useAuth.jsx";
import { getEquipo } from '../services/apiEquipamientoService.ts';
import { EquipamientoDto, useRequiredParams } from "../shared/EntityTypes.ts"
import { ComprobandoComponent } from "../components/ComprobandoComponent.tsx"
//Elementos de Material UI
import Typography from '@mui/material/Typography';
import {
    Container,
    Grid,
    TextField,
    TextFieldProps,
    Button,
} from "@mui/material"

export const InvDetalleEquipoComponent = ({ id, onClose }) => {

    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState(null);
    const [equ, setEqu] = useState<EquipamientoDto>();
    const navigate = useNavigate()
    const style_props: TextFieldProps = {
        variant: "outlined",
        disabled: true,
    };

    useEffect(() => {
        const response = getEquipo(user, id)
        response.then((response: EquipamientoDto) => {
            setEqu(response)
            setIsLoading(false)
        })
        .catch(error => {
            setError(error);
            setIsLoading(false);
            navigate(`/noautorizado`)
        });
        return () => setIsLoading(true)
    }, [user, id]);
    

    if (isLoading) {
        return (<ComprobandoComponent></ComprobandoComponent>);
    }

    return (
        <Container
        component="form"
        disableGutters
        sx={{
          marginY: "1em",
        }}
        >
            <Grid container spacing={2}>
                <Grid item xs={12} md={12} lg={12}>
                    <Typography variant="h2" gutterBottom>
                        Detalle de un Equipo
                    </Typography>
                </Grid>
                <Grid item xs={12} md={8} lg={12}>
                    <TextField
                        fullWidth
                        id="observaciones"
                        name="observaciones"
                        label="Observaciones"
                        {...style_props}
                        defaultValue={equ ? equ.observaciones : ""}
                    />
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                    <Button onClick={onClose} variant="contained">Cerrar</Button>
                </Grid>
            </Grid>
        </Container>
    );
};
