import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
//Componentes reutilizables, hooks, etc
import { useAuth } from "../hooks/useAuth.jsx";
import { getEquipo, addUpdateEquipo, getTipos, getEstados } from '../services/apiEquipamientoService.ts';
import { getUsuariosBasicosProvinciaActiva } from '../services/apiUsuarioService.ts';
import { EquipamientoDto, BasicoDto } from "../shared/EntityTypes.ts"
import { ComprobandoComponent } from "../components/ComprobandoComponent.tsx"
import { CheckedIcon, UnCheckedIcon } from '../shared/renderizado.tsx';
//Elementos de Material UI
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTime } from "luxon";
import {
  Container,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  TextFieldProps,
  Checkbox,
  Button,
  Typography,
  SelectChangeEvent,
} from "@mui/material"

//Definición de las propiedades que se le pueden pasar al componente
interface InvCreaEquipoComponentProps {
  id?: string;
  onClose?: () => void; //Prop opcional
}

export const InvCreaEquipoComponent = ({ id, onClose }: InvCreaEquipoComponentProps) => {
  const { user } = useAuth();
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState<EquipamientoDto>({
    id: id || "",
    provinciaId: "",
    usuarioId: "",
    observaciones: "",
    fentrega: "",
    fdevolucion: "",
    marca: "",
    modelo: "",
    nserie: "",
    nlargo: "",
    ncorto: "",
    imei: "",
    icc: "",
    pin: "",
    puk: "",
    datos: false,
    voz: false,
    cargador: false,
    raton: false,
    maletin: false,
    auriculares: false,
    idmId: "",
    tipo: "",
    estado: "",
    valido: true,
  });
  const [equTipos, setEquTipos] = useState<BasicoDto[]>([]);
  const [equEstados, setEquEstados] = useState<BasicoDto[]>([]);
  const [usuarios, setUsuarios] = useState<BasicoDto[]>([]);

  const style_props: TextFieldProps = {
    variant: "outlined",
    disabled: false,
  };

  useEffect(() => {
    //Carga datos para listas desplegables
    //Tipos de equipos
    const tipos = getTipos(user)
    tipos.then((tipos: BasicoDto[]) => {
      setEquTipos(tipos)
      if (tipos.length > 0) {
        setFormData((prevData) => ({ ...prevData, tipo: tipos[0].id }));
      }
    })
    .catch(error => {
        setError(error);
        setIsLoading(false);
        console.error("Error al obtener los tipos de equipamiento", error);
        navigate(`/noautorizado`)
    });
    //Estados
    const estados = getEstados(user)
    estados.then((estados: BasicoDto[]) => {
      setEquEstados(estados)
      if (estados.length > 0) {
        setFormData((prevData) => ({ ...prevData, estado: estados[0].id }));
      }
    })
    .catch(error => {
        setError(error);
        setIsLoading(false);
        console.error("Error al obtener los estados de equipamiento", error);
        navigate(`/noautorizado`)
      });
    //Usuarios
    const usuarios = getUsuariosBasicosProvinciaActiva(user)
    usuarios.then((usuarios: BasicoDto[]) => {
      setUsuarios(usuarios)
      if (usuarios.length > 0) {
        setFormData((prevData) => ({ ...prevData, usuarioId: usuarios[0].id }));
      }
    })
    .catch(error => {
        setError(error);
        setIsLoading(false);
        console.error("Error al obtener los usuarios de la provincia activa", error);
        navigate(`/noautorizado`)
    });
    // Si es edición, cargar equipo existente
    if (id) {
      const response = getEquipo(user, id)
      response.then((response: EquipamientoDto) => {
          setFormData(response)
          setIsLoading(false)
      })
      .catch(error => {
          setError(error);
          setIsLoading(false);
          navigate(`/noautorizado`)
      });
      return () => setIsLoading(true)
    } else {
      setIsLoading(false)
    }
  }, [user, id]);
  
  // Manejador para todos los campos excepto las fechas y las listas desplegables
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Manejador para las listas desplegables
  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormData(prev => { 
      const newData = {
        ...prev,
        [name as string]: value
      };
      //Vaciar los campos dependientes del tipo de equipo cuando se cambia el tipo
      if (name === 'tipo') {
        newData.nlargo = '';
        newData.ncorto = '';
        newData.imei = '';
        newData.icc = '';
        newData.pin = '';
        newData.puk = '';
        newData.datos = false;
        newData.voz = false;
        newData.cargador = false;
        newData.raton = false;
        newData.maletin = false;
        newData.auriculares = false;        
      }
      return newData;
    });
  };

  // Manejador para fechas
  const handleDateChange = (name, date) => {
    setFormData({
      ...formData,
      [name]: DateTime.fromISO(date).toFormat("yyyy-MM-dd")
    });
  };

  //Si viene desde el componente InvVerEquiposComponent, se ejecuta su función de cerrado
  //En caso contrario, se navega a la página principal del módulo
  const handleClose = () => {
    if (onClose) {
      onClose(); //Si viene de InvVerEquiposComponent
    } else {
      navigate('/inventario'); //Fallback por defecto
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      try {
        let esNuevo = (formData.id==''?true:false);
        if (formData) {
          const response = await addUpdateEquipo(user, formData);
              if (response) {
                  alert("Equipamiento guardado correctamente");            
                  //Si estamos en creación (el id era vacío), limpiamos los datos de los campos para poder seguir creando
                  if (esNuevo) {
                    setFormData({
                        id: "",
                        provinciaId: "",
                        usuarioId: usuarios.length > 0 ? usuarios[0].id : "",
                        observaciones: "",
                        fentrega: "",
                        fdevolucion: "",
                        marca: "",
                        modelo: "",
                        nserie: "",
                        nlargo: "",
                        ncorto: "",
                        imei: "",
                        icc: "",
                        pin: "",
                        puk: "",
                        datos: false,
                        voz: false,
                        cargador: false,
                        raton: false,
                        maletin: false,
                        auriculares: false,
                        idmId: "",
                        tipo: equTipos.length > 0 ? equTipos[0].descr : "",
                        estado: equEstados.length > 0 ? equEstados[0].descr : "",
                        valido: true,
                    });
                  }
                  //handleClose(); // Cerrar el formulario después de guardar
                } else {
                  alert("Hubo un error al guardar el equipamiento");
              }
        }
      } catch (error) {
        console.error("Error al guardar el equipamiento", error);
        alert("Hubo un error al guardar el equipamiento");
      }
    };

  //En el renderizado de detalles específicos, muestra una cabecera
  const cabeceraDetalles = () => {
    return (
      <Grid item xs={12} md={12} lg={12}>
        <Typography variant="subtitle1" gutterBottom>
          Detalles específicos
        </Typography>
      </Grid>
    );
  };
  // Renderizar campos condicionales
  const renderConditionalFields = () => {
    switch (formData.tipo) {
      case "Teléfono móvil":
      case "Modem USB":
          return (
          <Grid container spacing={2}>
            {cabeceraDetalles()}
            <Grid item xs={12} md={3} lg={3}>
              &nbsp;
              <TextField
                fullWidth
                label="IMEI"
                name="imei"
                value={formData.imei}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        );
      case "Teléfono fijo":
        return (
          <Grid container spacing={2}>
            {cabeceraDetalles()}
            <Grid item xs={12} md={3} lg={3}>
              <TextField
                fullWidth
                label="Número Largo"
                name="nlargo"
                value={formData.nlargo}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={3} lg={3}>
              <TextField
                fullWidth
                label="Número Corto"
                name="ncorto"
                value={formData.ncorto}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        );
      case "Tarjeta SIM":
        return (
          <Grid container spacing={2}>
            {cabeceraDetalles()}
            <Grid item xs={12} md={4} lg={4}>
              <TextField
                fullWidth
                label="Número Largo"
                name="nlargo"
                value={formData.nlargo}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={4} lg={4}>
              <TextField
                fullWidth
                label="Número Corto"
                name="ncorto"
                value={formData.ncorto}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={4} lg={4}>
              <TextField
                fullWidth
                label="ICC"
                name="icc"
                value={formData.icc}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={3} lg={3}>
              <TextField
                fullWidth
                label="PIN"
                name="pin"
                value={formData.pin}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={3} lg={3}>
              <TextField
                fullWidth
                label="PUK"
                name="puk"
                value={formData.puk}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={3} lg={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="datos"
                    checked={formData.datos}
                    onChange={handleChange}
                  />
                }
                label="Datos"
              />
            </Grid>
            <Grid item xs={12} md={3} lg={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="voz"
                    checked={formData.voz}
                    onChange={handleChange}
                  />
                }
                label="Voz"
              />
            </Grid>
          </Grid>
        );
      case "Ordenador portátil":
      case "Tablet/Ultraportátil":
      case "Ordenador de sobremesa":
          return (
          <Grid container spacing={2}>
            {cabeceraDetalles()}
            <Grid item xs={12} md={3} lg={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="raton"
                    checked={formData.raton}
                    onChange={handleChange}
                  />
                }
                label="Ratón"
              />
            </Grid>
            <Grid item xs={12} md={3} lg={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="auriculares"
                    checked={formData.auriculares}
                    onChange={handleChange}
                  />
                }
                label="Auriculares"
              />
            </Grid>
            <Grid item xs={12} md={3} lg={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="cargador"
                    checked={formData.cargador}
                    onChange={handleChange}
                  />
                }
                label="Cargador"
              />
            </Grid>
            <Grid item xs={12} md={3} lg={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="maletin"
                    checked={formData.maletin}
                    onChange={handleChange}
                  />
                }
                label="Maletín"
              />
            </Grid>
          </Grid>
        );
      default:
        return (
          <Grid container spacing={2}>
          </Grid>
        );
    }
  };

  if (isLoading) {
    return (<ComprobandoComponent></ComprobandoComponent>);
  }

    return (
        <Container
        component="form"
        onSubmit={handleSubmit}
        disableGutters
        sx={{
          marginY: "1em",
        }}
        >
            <Typography variant="h2" gutterBottom>
                Creación/Modificación de un Equipo
            </Typography>
            <Grid container spacing={2}>
              {/* Línea 1: Observaciones */}
              <Grid item xs={12} md={12} lg={12}>
                <TextField
                  fullWidth
                  id="observaciones"
                  name="observaciones"
                  required
                  label="Descripción"
                  {...style_props}
                  value={formData.observaciones ? formData.observaciones : ""}
                  onChange={handleChange}
                />
              </Grid>
              {/* Línea 2: Marca, Modelo, NSerie, idmId */}
              <Grid item xs={12} md={3} lg={3}>
                <TextField
                  fullWidth
                  id="marca"
                  name="marca"
                  required
                  label="Marca"
                  {...style_props}
                  value={formData.marca ? formData.marca : ""}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={3} lg={3}>
                <TextField
                  fullWidth
                  id="modelo"
                  name="modelo"
                  required
                  label="Modelo"
                  {...style_props}
                  value={formData.modelo ? formData.modelo : ""}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={3} lg={3}>
                <TextField
                  fullWidth
                  id="nserie"
                  name="nserie"
                  label="n/s"
                  {...style_props}
                  value={formData.nserie ? formData.nserie : ""}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={3} lg={3}>
                <TextField
                  fullWidth
                  id="idmId"
                  name="idmId"
                  label="Id de IDM"
                  {...style_props}
                  value={formData.idmId ? formData.idmId : ""}
                  onChange={handleChange}
                />
              </Grid>
              {/* Línea 3: Listas desplegables */}
              <Grid item xs={12} md={4} lg={4}>
                <InputLabel id="labelTipo">Tipo</InputLabel>
                <Select 
                  fullWidth
                  labelId="labelTipo"
                  id="tipo"
                  name="tipo" 
                  label="Tipo"
                  value={formData.tipo} 
                  onChange={handleSelectChange}
                >
                  {equTipos.map((type) => (
                  <MenuItem key={type.id} value={type.descr}>{type.descr}</MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12} md={4} lg={4}>
                <InputLabel id="labelEstado">Estado</InputLabel>
                <Select 
                  fullWidth
                  labelId="labelEstado"
                  id="estado"
                  name="estado" 
                  label="Estado"
                  value={formData.estado} 
                  onChange={handleSelectChange}
                >
                  {equEstados.map((type) => (
                  <MenuItem key={type.id} value={type.descr}>{type.descr}</MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12} md={4} lg={4}>
                <InputLabel id="labelUsuario">Usuario</InputLabel>
                <Select 
                  fullWidth
                  labelId="labelUsuario"
                  id="usuarioId"
                  name="usuarioId" 
                  label="Usuario"
                  value={formData.usuarioId} 
                  onChange={handleSelectChange}
                >
                  {usuarios.map((type) => (
                  <MenuItem key={type.id} value={type.id}>{type.descr}</MenuItem>
                  ))}
                </Select>
              </Grid>
              {/* Línea 4: Fechas */}
              <Grid item xs={12} md={4} lg={4}>
                <DatePicker
                  name="fentrega"
                  label="Fecha de entrega"
                  value={formData.fentrega ? DateTime.fromISO(formData.fentrega) : null}
                  onChange={(date) => handleDateChange("fentrega", date)}
                  format="dd/MM/yyyy"
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} md={4} lg={4}>
                <DatePicker
                  name="fdevolucion"
                  label="Fecha de devolución"
                  value={formData.fdevolucion ? DateTime.fromISO(formData.fdevolucion) : null}
                  onChange={(date) => handleDateChange("fdevolucion", date)}
                  format="dd/MM/yyyy"
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              {/* Campos condicionales */}
              {formData.tipo && (
                <Grid item xs={12} md={12} lg={12}>
                  {renderConditionalFields()}
                </Grid>
              )}
            </Grid>
            <p>&nbsp;</p>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4} lg={4}>
                <Button onClick={handleClose} variant="contained">Cerrar</Button>
                &nbsp;
                <Button type="submit" variant="contained">Guardar</Button>
              </Grid>
              <Grid item xs={12} md={8} lg={8}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="valido"
                      checked={formData.valido}
                      onChange={handleChange}
                      icon={<UnCheckedIcon />}
                      checkedIcon={<CheckedIcon />}
                    />
                  }
                  label="Válido"
                />
              </Grid>
            </Grid>
        </Container>
    );
};
