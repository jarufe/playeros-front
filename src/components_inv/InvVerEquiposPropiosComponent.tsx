import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import Cookies from 'js-cookie';
//Componentes reutilizables, hooks, etc
import { useAuth } from "../hooks/useAuth.jsx";
import { getEquipamientoUsuarioActivoPaging } from '../services/apiEquipamientoService.ts';
import { Page, EquipamientoDto } from "../shared/EntityTypes.ts"
import { InvDetalleEquipoComponent } from "./InvDetalleEquipoComponent.tsx";
import { isAdminOSuperusu } from '../services/apiUsuarioService.ts';
//Elementos de Material UI
import { Box, Container, Typography } from "@mui/material"
import { GridColDef, DataGrid, GridRowParams } from "@mui/x-data-grid"

interface EquipamientoDataGridColumns {
    id: string
    observaciones: string
    fentrega: string
    marca: string
    modelo: string
    nserie: string
    estado: string
}

export const InvVerEquiposPropiosComponent = () => {
    const { user } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [funcionalidades, setFuncionalidades] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [rowsPerPage, setRowsPerPage] = useState<number>(5)
    const [totalRows, setTotalRows] = useState<number>(0)
    const [page, setPage] = useState<number>(0)
    const navigate = useNavigate()
    const [rows, setRows] = useState<EquipamientoDataGridColumns[]>([])
    const [selectedEquipoId, setSelectedEquipoId] = useState("");
    const [showForm, setShowForm] = useState(false);

    function handleClick(params: GridRowParams) {
        let equId = '' + params.id;
        setSelectedEquipoId(equId);
        setShowForm(true);
    }

    // Cerrar formulario y actualizar lista
    const handleFormClose = () => {
        setShowForm(false);
    };

    //Función para saber si una funcionalidad está dentro de la lista de funcionalidades del usuario
    //La lista de funcionalidades está en una cookie que se carga al principio
    const verFuncionalidad = (func) => {
        return funcionalidades.includes(func);
    }

    useEffect(() => {
        //Pide al back saber si es un usuario especial para habilitar funciones
        isAdminOSuperusu(user).then(function(isEspecial) {
            if (isEspecial) {
              setIsAdmin(true);
            } else {
              setIsAdmin(false);
            }
          });  
        //Lee la cookie de funcionalidades para poder inspeccionar valores
        const funcCookie = Cookies.get('funcionalidades');
        setFuncionalidades(funcCookie?funcCookie:"");
        //Ahora lee los datos de equipos
        const response = getEquipamientoUsuarioActivoPaging(user, page, rowsPerPage)
        response.then((response: Page<EquipamientoDto>) => {
            setRows(
            response?.data.map(
            (equ: EquipamientoDto): EquipamientoDataGridColumns => ({
                id: equ.id,
                observaciones: equ.observaciones,
                fentrega: equ.fentrega,
                marca: equ.marca,
                modelo: equ.modelo,
                nserie: equ.nserie,
                estado: equ.estado,
            }),
            ),
        )
        setTotalRows(response.total>0?response.total:0)
        setIsLoading(false)
        })
        return () => setIsLoading(true)
    }, [user, page, rowsPerPage]);

    const columns: GridColDef[] = [
        { field: "observaciones", headerName: "Observaciones", flex: 1, minWidth: 175 },
        { field: "marca", headerName: "Marca", width: 150 },
        { field: "modelo", headerName: "Modelo", width: 150 },
        { field: "nserie", headerName: "n/s", width: 150 },
        { field: "fentrega", headerName: "F.Entrega", width: 150 },
        { field: "estado", headerName: "Estado", width: 150 },
    ]

    return (
        <Box sx={{ height: "100%" }}>
            <Container>
                <Typography variant="h2" gutterBottom>
                    Ver Equipos Propios
                </Typography>
                <DataGrid
                    initialState={{ pagination: { rowCount: -1}}}
                    columns={columns}
                    loading={isLoading}
                    rows={rows}
                    rowCount={totalRows}
                    paginationMode={"server"}
                    paginationModel={{ page: page, pageSize: rowsPerPage }}
                    pageSizeOptions={[5, 10, 25]}
                    onPaginationModelChange={(model) => {
                        setPage(model.page)
                        setRowsPerPage(model.pageSize)
                    }}
                    onRowClick={handleClick}
                />
                {/* Formulario (modal/página) */}
                {showForm && ((
                        (isAdmin || verFuncionalidad('/inv/detalleequipo<JARUTAG>')) && (
                        <InvDetalleEquipoComponent
                        id={selectedEquipoId}
                        onClose={handleFormClose}
                        key={selectedEquipoId || "new"} // Forzar remontaje al cambiar entre edición/creación
                        />
                        )
                    ))
                }
            </Container>
        </Box>
    );
};
