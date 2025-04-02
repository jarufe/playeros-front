import React, { useState, useEffect } from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import Cookies from 'js-cookie';
//Componentes reutilizables, hooks, etc
import { useAuth } from "../hooks/useAuth";
//Elementos de Material UI
import { AppBar, Box, IconButton, Toolbar, Menu, MenuItem, ListItemText } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import Tooltip from "@mui/material/Tooltip";
import { ArrowBack } from "@mui/icons-material";
import SettingsIcon from "@mui/icons-material/Settings";
import HomeIcon from "@mui/icons-material/Home";
import VisibilityIcon from '@mui/icons-material/Visibility';

export const InvHeader = () => {

  const { logout } = useAuth();
  const navigate = useNavigate()
  const location = useLocation();
  const [anchorAdmin, setAnchorAdmin] = useState(null);
  const openAdmin = Boolean(anchorAdmin);
  const [anchorView, setAnchorView] = useState(null);
  const openView = Boolean(anchorView);
  const [funcionalidades, setFuncionalidades] = useState("");

  useEffect(() => {
      try {
        //Lee la cookie de funcionalidades para poder inspeccionar valores
        const funcCookie = Cookies.get('funcionalidades');
        setFuncionalidades(funcCookie?funcCookie:"");
      } catch (error) {
          console.error('Error estableciendo cabecera', error);
      }
  }, []);

  const handleClickAdmin = (event) => {
    setAnchorAdmin(event.currentTarget);
  };
  const handleCloseAdmin = () => {
    setAnchorAdmin(null);
  };
  const handleClickView = (event) => {
    setAnchorView(event.currentTarget);
  };
  const handleCloseView = () => {
    setAnchorView(null);
  };
  const handleLogout = () => {
    logout();
  };
  const handleCreateEquipment = () => {
    navigate('/inv/creaequipo');
  };

  //Función para saber si una funcionalidad está dentro de la lista de funcionalidades del usuario
  //La lista de funcionalidades está en una cookie que se carga al principio
  const verFuncionalidad = (func) => {
    return funcionalidades.includes(func);
  }

  return (
    <Box>
      <AppBar position="static">
        <Toolbar sx={{display: "flex", justifyContent: "space-between"}}>
          <Box>
            <Tooltip title="Inicio">
              <IconButton
                size="large"
                sx= {{color: "white"}}
                onClick={() => { navigate("/inventario") }}
              >
                <HomeIcon sx={{color:"white"}}/>
              </IconButton>
            </Tooltip>
            { location?.key !== "default" && <Tooltip title="Atrás">
              <IconButton
                size="large"
                sx={{color: "white"}}
                onClick={() => { navigate(-1) }}
              >
                <ArrowBack sx={{color: "white"}}/>
              </IconButton>
            </Tooltip>}
            { verFuncionalidad('/inv/creaequipo<JARUTAG>') || 
            verFuncionalidad('/inv/verequipos<JARUTAG>') ? 
              <Tooltip title="Administración">
                  <IconButton
                    onClick={handleClickAdmin}
                    size="large"
                    sx= {{color: "white"}}
                    aria-controls={openAdmin ? 'admin-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={openAdmin ? 'true' : undefined}
                  >
                      <SettingsIcon />
                  </IconButton>
              </Tooltip>
              : null
            }
            { verFuncionalidad('/inv/verequipospropios<JARUTAG>') ? 
              <Tooltip title="Vista">
                  <IconButton
                    onClick={handleClickView}
                    size="large"
                    sx= {{color: "white"}}
                    aria-controls={openView ? 'view-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={openView ? 'true' : undefined}
                  >
                      <VisibilityIcon />
                  </IconButton>
              </Tooltip>
              : null
            }
          </Box>
          <Box display={"flex"} sx= {{justifyContent: "right"}}>
            <Tooltip title="Logout">
                <IconButton
                    size="large"
                    sx= {{color: "white"}}
                    onClick={handleLogout}
                >
                    <LogoutIcon />
                </IconButton>
            </Tooltip>
          </Box>
          <Menu
            anchorEl={anchorAdmin}
            id="admin-menu"
            keepMounted
            open={openAdmin}
            onClose={handleCloseAdmin}
            onClick={handleCloseAdmin}
          >
            { verFuncionalidad('/inv/creaequipo<JARUTAG>') ? 
              <MenuItem>
              <ListItemText
                onClick={handleCreateEquipment}
              >
                Crear Equipo
              </ListItemText>
            </MenuItem>
            : null
            }
            { verFuncionalidad('/inv/verequipos<JARUTAG>') ? 
              <MenuItem>
              <ListItemText
                onClick={() => { navigate('/inv/verequipos') }}
              >
                Ver Equipos
              </ListItemText>
            </MenuItem>
            : null
            }
          </Menu>
          { verFuncionalidad('/inv/verequipospropios<JARUTAG>') ? 
            <Menu
              anchorEl={anchorView}
              id="view-menu"
              keepMounted
              open={openView}
              onClose={handleCloseView}
              onClick={handleCloseView}
            >
              { verFuncionalidad('/inv/verequipospropios<JARUTAG>') ? 
                <MenuItem>
                <ListItemText
                  onClick={() => { navigate('/inv/verequipospropios') }}
                >
                  Ver Equipos Propios
                </ListItemText>
              </MenuItem>
              : null
              }
            </Menu>
            : null
          }
        </Toolbar>
      </AppBar>
    </Box>
  )
}