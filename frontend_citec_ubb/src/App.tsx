import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import NotFound from './pages/public/NotFound';
import Login from './pages/public/Login';
import PrivateRoute from './components/PrivateRoute';
import { DataAuthProvider } from './components/AuthDataContext';
import Home from './pages/private/Home';
import CrearUsuario from './pages/private/Usuarios/components/CrearUsuario';
import TablaUsuario from '../src/components/TablaUsuario';
import EditarUsuario from './pages/private/Usuarios/components/EditarUsuario';
import EditarEmpresa from './pages/private/Empresas/components/EditarEmpresa';
import CrearEmpresa from './pages/private/Empresas/components/CrearEmpresa';
import TablaEmpresas from './components/TablaEmpresas';
import CrearOrdenTrabajo from './pages/private/Orden de trabajo/CrearOrdenTrabajo';
import EditarOrdenTrabajo from './pages/private/Orden de trabajo/EditarOrdenTrabajo';
import TablaOrdenTrabajo from './components/TablaOrdenTrabajo';
import CrearEnsayo from './pages/private/Servicios/CrearEnsayo';
import EditarEnsayo from './pages/private/Servicios/EditarEnsayo';
import TablaEnsayos from './components/TablaEnsayos';
import CrearPropuesta from './pages/private/Servicios/CrearPropuesta';
import TablaPropuestas from './components/TablaPropuestas';
import EditarPropuesta from './pages/private/Servicios/EditarPropuesta';
import CrearInformeEnsayo from './pages/private/Servicios/CrearInformeEnsayo';

const App: React.FC = () => {
    return (
        <DataAuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/">
                        <Route index element={<Login />} />
                        <Route path="/login" element={<Login />} />

                        <Route path="/dashboard" element={<PrivateRoute />}>
                            <Route element={<Layout />}>
                                <Route index element={<Home />} />

                                <Route path="empresas">
                                    <Route index element={<TablaEmpresas />} />
                                    <Route
                                        path="crear"
                                        element={<CrearEmpresa />}
                                    />
                                    <Route
                                        path="editar/:rut"
                                        element={<EditarEmpresa />}
                                    />
                                </Route>

                                <Route path="usuarios">
                                    <Route index element={<TablaUsuario />} />
                                    <Route
                                        path="crear"
                                        element={<CrearUsuario />}
                                    />
                                    <Route
                                        path="editar/:email"
                                        element={<EditarUsuario />}
                                    />
                                </Route>

                                <Route path="propuestas">
                                    <Route
                                        index
                                        element={<TablaPropuestas />}
                                    />
                                    <Route
                                        path="crear"
                                        element={<CrearPropuesta />}
                                    />
                                    <Route
                                        path="editar/:id"
                                        element={<EditarPropuesta />}
                                    />
                                </Route>
                                <Route path="ensayos">
                                    <Route index element={<TablaEnsayos />} />
                                    <Route
                                        path="crear"
                                        element={<CrearEnsayo />}
                                    />
                                    <Route
                                        path="editar/:id"
                                        element={<EditarEnsayo />}
                                    />
                                </Route>

                                <Route path="orden-trabajo">
                                    <Route
                                        index
                                        element={<TablaOrdenTrabajo />}
                                    />
                                    <Route
                                        path="crear"
                                        element={<CrearOrdenTrabajo />}
                                    />
                                    <Route
                                        path="editar/:numero_folio"
                                        element={<EditarOrdenTrabajo />}
                                    />
                                    <Route
                                        path="crear-informe"
                                        element={<CrearInformeEnsayo />}
                                    />
                                </Route>
                            </Route>
                        </Route>
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </DataAuthProvider>
    );
};

export default App;
