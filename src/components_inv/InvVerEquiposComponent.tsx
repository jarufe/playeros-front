import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import Cookies from 'js-cookie';
//Componentes reutilizables, hooks, etc
import { useAuth } from "../hooks/useAuth";
import { getEquipamientoProvinciaActivaPaging, getEquipamientoValidoProvinciaActivaPaging } from '../services/apiEquipamientoService.ts';
import { Page, EquipamientoDto } from "../shared/EntityTypes.ts"
import { InvCreaEquipoComponent } from "./InvCreaEquipoComponent.tsx";
import { InvDetalleEquipoComponent } from "./InvDetalleEquipoComponent.tsx";
import { isAdminOSuperusu } from '../services/apiUsuarioService.ts';
//Elementos de Material UI
import { 
    Box, 
    Container, 
    IconButton,
    Button,
    Typography,
    ToolTip
} from "@mui/material"
import { Edit, Add } from "@mui/icons-material";
import { GridColDef, DataGrid, GridRowParams } from "@mui/x-data-grid"
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

interface EquipamientoDataGridColumns {
    id: string
    observaciones: string
    fentrega: string
    marca: string
    modelo: string
    nserie: string
    estado: string
    usuarioId: string
}

export const InvVerEquiposComponent = () => {
    const { user } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [funcionalidades, setFuncionalidades] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [rowsPerPage, setRowsPerPage] = useState<number>(5)
    const [totalRows, setTotalRows] = useState<number>(0)
    const [page, setPage] = useState<number>(0)
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
      });
    const navigate = useNavigate()
    const [rows, setRows] = useState<EquipamientoDataGridColumns[]>([])
    const [selectedEquipoId, setSelectedEquipoId] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [showOnlyValid, setShowOnlyValid] = useState<boolean>(false);  
    
    useEffect(() => {
        setIsLoading(true);
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
        //Ahora consulta los equipos
        const response = showOnlyValid
            ? getEquipamientoValidoProvinciaActivaPaging(user, page, rowsPerPage)
            : getEquipamientoProvinciaActivaPaging(user, page, rowsPerPage)
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
                usuarioId: equ.usuarioId,
            }),
            ),
        )
        setTotalRows(response.total>0?response.total:0)
        setIsLoading(false)
        })
        return () => setIsLoading(true)
    }, [user, page, rowsPerPage, showOnlyValid]);

    const columns: GridColDef[] = [
        { field: "observaciones", headerName: "Observaciones", flex: 1, minWidth: 175 },
        { field: "marca", headerName: "Marca", width: 150 },
        { field: "modelo", headerName: "Modelo", width: 150 },
        { field: "nserie", headerName: "n/s", width: 150 },
        { field: "fentrega", headerName: "F.Entrega", width: 150 },
        { field: "estado", headerName: "Estado", width: 150 },
        { field: "usuarioId", headerName: "Usuario", width: 150 },
    ]

    function handleClick(params: GridRowParams) {
        //void navigate(`/inv/detalleequipo/${params.id}`)
        let equId = '' + params.id;
        setSelectedEquipoId(equId);
        setShowForm(true);
    }

    // Manejar creación
    const handleAdd = () => {
        setSelectedEquipoId(""); // Sin ID = formulario de creación
        setShowForm(true);
    };

    // Cerrar formulario y actualizar lista
    const handleFormClose = () => {
        setShowForm(false);
        // Recargar lista después de guardar
        //axios.get("getEquipos").then((res) => setEquipos(res.data));
    };

    //Función para saber si una funcionalidad está dentro de la lista de funcionalidades del usuario
    //La lista de funcionalidades está en una cookie que se carga al principio
    const verFuncionalidad = (func) => {
        return funcionalidades.includes(func);
    }

    return (
        <Box sx={{ height: "100%" }}>
            <Container>
                <Typography variant="h2" gutterBottom>
                    Ver Equipos
                </Typography>
                {isAdmin && (
                        <Tooltip 
                          title={showOnlyValid ? "Mostrando solo equipos válidos" : "Mostrando todos los equipos"}
                          arrow
                        >
                          <IconButton
                            onClick={() => setShowOnlyValid(!showOnlyValid)}
                            color="primary"
                            sx={{ mb: 2 }}
                          >
                            {showOnlyValid ? (
                              <DeleteIcon color="error" />
                            ) : (
                              <DeleteOutlineIcon />
                            )}
                          </IconButton>
                        </Tooltip>
                      )}
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
                {/* Botón de añadir (solo para admin) */}
                {(isAdmin || verFuncionalidad('/inv/creaequipo<JARUTAG>')) && (
                    <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={handleAdd}
                    sx={{ mt: 3 }}
                    >
                    Añadir Equipo
                    </Button>
                )}
                {/* Formulario (modal/página) */}
                {showForm && ((
                        (isAdmin || verFuncionalidad('/inv/creaequipo<JARUTAG>')) && (
                        <InvCreaEquipoComponent
                        id={selectedEquipoId}
                        onClose={handleFormClose}
                        key={selectedEquipoId || "new"} // Forzar remontaje al cambiar entre edición/creación
                        />
                        )
                    ) || (
                        !(isAdmin || verFuncionalidad('/inv/creaequipo<JARUTAG>')) && (
                            <InvDetalleEquipoComponent
                            id={selectedEquipoId}
                            onClose={handleFormClose}
                            key={selectedEquipoId || "view"} // Forzar remontaje al cambiar entre edición/creación
                            />
                            )
                    ))
                }
            </Container>
        </Box>
    );
};
