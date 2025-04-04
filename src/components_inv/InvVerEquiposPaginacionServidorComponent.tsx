import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
//Componentes reutilizables, hooks, etc
import { useAuth } from "../hooks/useAuth.jsx";
import { getEquipamientoProvinciaActivaPaging, getEquipamientoValidoProvinciaActivaPaging } from '../services/apiEquipamientoService.ts';
import { Page, EquipamientoDto } from "../shared/EntityTypes.ts"
import { InvCreaEquipoComponent } from "./InvCreaEquipoComponent.tsx";
import { InvDetalleEquipoComponent } from "./InvDetalleEquipoComponent.tsx";
import { isAdminOSuperusu } from '../services/apiUsuarioService.ts';
import { CheckedIcon, UnCheckedIcon } from '../shared/renderizado.tsx';
//Elementos de Material UI
import { 
    Box, 
    Container, 
    IconButton,
    Button,
    Typography,
    Tooltip,
    TextField,
} from "@mui/material"
import { Add } from "@mui/icons-material";
import { GridColDef, DataGrid, GridRowParams } from "@mui/x-data-grid"
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

//Definición del subconjunto del DTO de la entidad equipamiento que se va a usar en las columnas del DataGrid
interface EquipamientoDataGridColumns {
    id: string
    observaciones: string
    fentrega: string
    marca: string
    modelo: string
    nserie: string
    estado: string
    valido: boolean
}

//Este componente realiza una consulta con paginación a la BD. Es la BD la que devuelve el subconjunto correcto para la página a mostrar
//Hay otro componente con nombre similar pero sin indicativo de que la paginación es en el servidor
//Usar uno u otro según que la tabla vaya a contener un elevado número de resultados o no
export const InvVerEquiposPaginacionServidorComponent = () => {
    //Variables relacionadas con la autenticación de usuario y comprobación de permisos
    const { user } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [funcionalidades, setFuncionalidades] = useState("");
    //Comprobación del estado de carga de los datos para esperar a renderizar información
    const [isLoading, setIsLoading] = useState<boolean>(true)
    //Datos relacionados con la gestión del DataGrid: filas por cada página, número total de filas de la consulta y número de página actual
    const [totalRows, setTotalRows] = useState<number>(0)
    const [totalFilteredRows, setTotalFilteredRows] = useState<number>(0)
    //Estructura de datos que alimenta a las filas del DataGrid
    const [rows, setRows] = useState<EquipamientoDataGridColumns[]>([])
    //Misma estructura de datos pero para filtrar según lo escrito en un cuadro de texto de búsqueda
    const [filteredRows, setFilteredRows] = useState<EquipamientoDataGridColumns[]>([]);
    //Id del registro seleccionado en el DataGrid
    const [selectedId, setSelectedId] = useState("");
    //Variables para gestionar el renderizado de más información y la realización de filtrado por registros válidos o no válidos
    const [showForm, setShowForm] = useState(false);

    //Definición de filtros aplicables, con una interfaz para el tipado fuerte y la variable de estado
    interface Filters {
        showOnlyValid: boolean;
        searchText: string;
        pagination: {
            page: number;
            pageSize: number;
        };
    }
    const [filters, setFilters] = useState<Filters>({
        showOnlyValid: true,
        searchText: '',
        pagination: { page: 0, pageSize: 5 }
    });

     // Función única para cargar datos (reutilizable)
    const loadRegistros = async () => {
        try {
            //Ahora consulta los registros, leyendo todos o solo los válidos según el estado de un elemento en el formulario
            const response = filters.showOnlyValid
                ? getEquipamientoValidoProvinciaActivaPaging(user, filters.pagination.page, filters.pagination.pageSize)
                : getEquipamientoProvinciaActivaPaging(user, filters.pagination.page, filters.pagination.pageSize)
            response.then((response: Page<EquipamientoDto>) => {
                //Establece las filas de datos para el DataGrid a partir del resultado de la consulta
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
                        valido: equ.valido,
                    }),
                    ),
                );
                //Establece la subestructura de filtrado de datos, aplicando los filtros correspondientes
                setFilteredRows(
                    filters.searchText 
                    ? applyLocalFilters(response.data, filters.searchText) 
                    : response.data
                );
                setTotalRows(response.total>0?response.total:0)
                setTotalFilteredRows(filteredRows.length>0?filteredRows.length:0)
            });
        } catch (error) {
        console.error("Error cargando registros:", error);
        }
    };
    // Filtrado local (para el buscador)
    const applyLocalFilters = (data: any[], searchText: string) => {
        let filtrado = data.filter(registro => 
        Object.values(registro).some(
            val => val?.toString().toLowerCase().includes(searchText.toLowerCase())
        )
        );
        setTotalFilteredRows(filtrado.length>0?filtrado.length:0)
        return filtrado;
    };    

    //Comprobación de permisos y carga de datos para mostrar en la página
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
        //Carga la consulta
        loadRegistros();

        setIsLoading(false)
        return () => setIsLoading(true)
    }, [user, filters.showOnlyValid, filters.pagination]);

    // Efecto para filtrado local (no requiere llamar a API)
    useEffect(() => {
        if (filters.searchText) {
            setFilteredRows(applyLocalFilters(rows, filters.searchText));
        } else {
            setFilteredRows(rows);
            setTotalFilteredRows(totalRows>0?totalRows:0)
        }
    }, [filters.searchText, rows]);
    
    //Definición de las columnas del DataGrid
    //La columna boolean llamada 'valido' se renderiza con un icono verde o rojo según que el registro sea válido o no
    const columns: GridColDef[] = [
        { field: "observaciones", headerName: "Observaciones", flex: 1, minWidth: 175 },
        { field: "marca", headerName: "Marca", width: 150 },
        { field: "modelo", headerName: "Modelo", width: 150 },
        { field: "nserie", headerName: "n/s", width: 150 },
        { field: "fentrega", headerName: "F.Entrega", width: 150 },
        { field: "estado", headerName: "Estado", width: 150 },
        { field: "valido", headerName: "Válido", width: 75, 
            renderCell: (params) => (params.row.valido ? <CheckedIcon /> : <UnCheckedIcon />), 
        },
    ]

    //Cuando se hace clic en una fila del DataGrid, se muestra el componente para la modificación de datos
    //El componente se muestra como de modificación porque el parámetro id del registro seleccionado tiene el valor del id de la fila del DataGrid
    function handleClick(params: GridRowParams) {
        let equId = '' + params.id;
        setSelectedId(equId);
        setShowForm(true);
    }

    //Cuando se hace clic en el botón de añadir, se muestra el componente para la creación de datos
    //El componente se muestra como de creación porque el parámetro id del registro seleccionado está vacío
    const handleAdd = () => {
        setSelectedId(""); // Sin ID = formulario de creación
        setShowForm(true);
    };

    // Cerrar formulario y actualizar lista
    const handleFormClose = () => {
        setShowForm(false);
        loadRegistros(); // ¡Refrescamos los datos manteniendo los filtros actuales!
    };

    //Función para saber si una funcionalidad está dentro de la lista de funcionalidades del usuario
    //La lista de funcionalidades está en una cookie que se carga al principio
    const verFuncionalidad = (func: string) => {
        return funcionalidades.includes(func);
    }

    //Renderizado del componente
    return (
        <Box sx={{ height: "100%" }}>
            <Container>
                {!showForm && (
                    <Box>
                        {/* Título del componente */}
                        <Typography variant="h2" gutterBottom>
                            Ver Equipos
                        </Typography>
                        {/* Muestra el filtrado solo si es administrador */}
                        {isAdmin && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Typography variant="body1">Filtro:</Typography>
                            {/* Botón de papelera */}
                            <Tooltip 
                                title={filters.showOnlyValid ? "Mostrando solo registros válidos" : "Mostrando todos los registros"}
                                arrow
                            >
                                <IconButton
                                onClick={() => 
                                    setFilters(prev => ({
                                        ...prev,
                                        showOnlyValid: !prev.showOnlyValid
                                    }))
                                }
                                color="primary"
                                >
                                {!filters.showOnlyValid ? (
                                    <DeleteIcon color="error" />
                                ) : (
                                    <DeleteOutlineIcon />
                                )}
                                </IconButton>
                            </Tooltip>

                            {/* Campo de búsqueda */}
                            <TextField
                                label="Buscar en resultados"
                                variant="outlined"
                                size="small"
                                value={filters.searchText}
                                onChange={(e) => 
                                    setFilters(prev => ({
                                        ...prev,
                                        searchText: e.target.value
                                    }))
                                }
                                sx={{ flexGrow: 1, maxWidth: 400 }}
                            />
                            {/* Contador de registros */}
                            {filters.searchText && (
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {`Mostrando ${totalFilteredRows} registro(s) filtrado(s) en esta página`}
                                </Typography>
                            )}
                            </Box>
                        )}
                        {/* Tabla de datos consultados de la BD o filtrados desde el cuadro de texto de búsqueda */}
                        <DataGrid 
                            initialState={{ pagination: { rowCount: -1}}}
                            columns={columns}
                            loading={isLoading}
                            rows={filteredRows}
                            rowCount={totalRows}
                            paginationMode={"server"}
                            paginationModel={filters.pagination}
                            pageSizeOptions={[5, 25, 100]}
                            onPaginationModelChange={(model) => 
                                setFilters(prev => ({
                                    ...prev,
                                    pagination: model
                                }))
                            }
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
                            Añadir
                            </Button>
                        )}
                    </Box>
                )}
                {/* Formulario (modal/página) */}
                {showForm && ((
                        (isAdmin || verFuncionalidad('/inv/creaequipo<JARUTAG>')) && (
                        <InvCreaEquipoComponent
                        id={selectedId}
                        onClose={handleFormClose}
                        key={selectedId || "new"} // Forzar remontaje al cambiar entre edición/creación
                        />
                        )
                    ) || (
                        !(isAdmin || verFuncionalidad('/inv/creaequipo<JARUTAG>')) && (
                            <InvDetalleEquipoComponent
                            id={selectedId}
                            onClose={handleFormClose}
                            key={selectedId || "view"} // Forzar remontaje al cambiar entre edición/creación
                            />
                            )
                    ))
                }
            </Container>
        </Box>
    );
};
