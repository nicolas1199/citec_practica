import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useData } from './AuthDataContext';

const PrivateRoute: React.FC = () => {
    const { isAuthenticated, userType } = useData();

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    if (isAuthenticated && !userType) {
        // Si el usuario está autenticado pero no tiene un tipo de usuario asignado, redirigir al inicio de sesión
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export default PrivateRoute;
