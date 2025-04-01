import React, { useState, useEffect } from 'react';
import { useAuth } from "./hooks/useAuth";
import { NoAutorizadoComponent } from './components/NoAutorizadoComponent.tsx';
import { ComprobandoComponent } from './components/ComprobandoComponent.tsx';
import { isFuncionalidadAutorizada } from './services/apiUsuarioService.ts';

let useComprobando = (user, path) => {
  let [isLoading, setIsLoading] = useState(true);
  let [isAuth, setIsAuth] = useState(false);
  useEffect(() => {
    if (!user) {
      setIsAuth(false);
    } else {
      isFuncionalidadAutorizada(user, path).then(function(isAutorizada) {
        if (isAutorizada) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      })
      .finally(() => setIsLoading(false));
    }
  }, [user, path]);
  return [isAuth, isLoading];
};

export const PrivateRoute = ({ children, path }) => {
  const { user } = useAuth();
  let [isAuth, isLoading] = useComprobando(user, path);
  if (!isAuth) {
    children = <NoAutorizadoComponent />;
  }
  if (isLoading) {
    children = <ComprobandoComponent />;
  }
  return children;
};