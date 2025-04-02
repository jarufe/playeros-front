import { Routes, Route } from "react-router-dom";

//import './App.css';
import { LoginComponent } from './components/LoginComponent.tsx';
import { NoAutorizadoComponent } from './components/NoAutorizadoComponent.tsx';
import { RegisterComponent } from './components/RegisterComponent.tsx';
import { InfoGlobalComponent } from './components/InfoGlobalComponent.tsx';
import { ModulosComponent } from './components/ModulosComponent.tsx';
import { AccesoComponent } from './components/AccesoComponent.tsx';
import { ProductividadComponent } from './components/ProductividadComponent.tsx';
import { PlanDirectorComponent } from './components/PlanDirectorComponent.tsx';
import { InventarioComponent } from './components/InventarioComponent.tsx';
import { PrivateRoute } from './PrivateRoute';
import { AuthProvider } from "./hooks/useAuth.jsx";
import { AccCreaModuloComponent } from './components_acc/AccCreaModuloComponent.tsx';
import { GpdCreaPersonaComponent } from './components_gpd/GpdCreaPersonaComponent.tsx';
import { InvLayout } from './components_inv/InvLayout.tsx';
import { InvCreaEquipoComponent } from './components_inv/InvCreaEquipoComponent.tsx';
import { InvVerEquiposPropiosComponent } from './components_inv/InvVerEquiposPropiosComponent.tsx';
import { InvVerEquiposComponent } from './components_inv/InvVerEquiposComponent.tsx';
import { InvDetalleEquipoComponent } from './components_inv/InvDetalleEquipoComponent.tsx';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon"

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale={"es-ES"}>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<LoginComponent />} />
              <Route path="/login" element={<LoginComponent />} />
              <Route path="/noautorizado" element={<NoAutorizadoComponent />} />
              <Route path="/registro" element={<RegisterComponent />} />
              <Route path="/infoglobal" element={<InfoGlobalComponent />} />
              <Route path="/modulos" element={<PrivateRoute path="/modulos"><ModulosComponent /></PrivateRoute>}/>
              <Route path="/acceso" element={<PrivateRoute path="/acceso"><AccesoComponent /></PrivateRoute>}/>
              <Route path="/productividad" element={<PrivateRoute path="/productividad"><ProductividadComponent /></PrivateRoute>}/>
              <Route path="/plandirector" element={<PrivateRoute path="/plandirector"><PlanDirectorComponent /></PrivateRoute>}/>
              <Route path="/acc/creamodulo" element={<PrivateRoute path="/acc/creamodulo"><AccCreaModuloComponent /></PrivateRoute>}/>
              <Route path="/gpd/creapersona" element={<PrivateRoute path="/gpd/creapersona"><GpdCreaPersonaComponent /></PrivateRoute>}/>
              <Route path='/' element={<InvLayout/>} >
                <Route path="/inventario" element={<PrivateRoute path="/inventario"><InventarioComponent /></PrivateRoute>}/>
                <Route path="/inv/creaequipo" element={<PrivateRoute path="/inv/creaequipo"><InvCreaEquipoComponent /></PrivateRoute>}/>
                <Route path="/inv/verequipospropios" element={<PrivateRoute path="/inv/verequipospropios"><InvVerEquiposPropiosComponent /></PrivateRoute>}/>
                <Route path="/inv/verequipos" element={<PrivateRoute path="/inv/verequipos"><InvVerEquiposComponent /></PrivateRoute>}/>
                <Route path="/inv/detalleequipo" element={<PrivateRoute path="/inv/detalleequipo"><InvDetalleEquipoComponent /></PrivateRoute>}/>
              </Route>
            </Routes>
          </AuthProvider>
        </LocalizationProvider>
      </header>
    </div>
  );
}

export default App;