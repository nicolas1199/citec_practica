import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from 'react';
import axios from 'axios';

interface DataAuthContextType {
    regiones: any[] | null;
    provincias: any[] | null;
    comunas: any[] | null;
    giros: any[] | null;
    categorias: any[] | null;

    token: string | null;
    isAuthenticated: boolean;
    userType: string | null;
    userEmail: string | null;
    userName: string | null;
    userLastName: string | null;
    login: (
        token: string,
        userType: string,
        userEmail: string,
        userName: string,
        userLastName: string,
    ) => void;
    logout: () => void;
}

const DataAuthContext = createContext<DataAuthContextType | undefined>(
    undefined,
);

export const DataAuthProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [regiones, setRegiones] = useState<any[] | null>(null);
    const [provincias, setProvincias] = useState<any[] | null>(null);
    const [comunas, setComunas] = useState<any[] | null>(null);
    const [giros, setGiros] = useState<any[] | null>(null);
    const [categorias, setCategorias] = useState<any[] | null>(null);

    const [token, setToken] = useState<string | null>(() => {
        return sessionStorage.getItem('token');
    });
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        return !!sessionStorage.getItem('token');
    });
    const [userType, setUserType] = useState<string | null>(() => {
        return sessionStorage.getItem('userType');
    });
    const [userEmail, setUserEmail] = useState<string | null>(() => {
        return sessionStorage.getItem('userEmail');
    });
    const [userName, setUserName] = useState<string | null>(() => {
        return sessionStorage.getItem('userName');
    });
    const [userLastName, setUserLastName] = useState<string | null>(() => {
        return sessionStorage.getItem('userLastName');
    });

    const fetchGlobalData = async () => {
        try {
            const [
                regionesRes,
                provinciasRes,
                comunasRes,
                girosRes,
                categoriasRes,
            ] = await Promise.all([
                axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/${import.meta.env.VITE_API_KEY}/region/get-all`,
                ),
                axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/${import.meta.env.VITE_API_KEY}/province/get-all`,
                ),
                axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/${import.meta.env.VITE_API_KEY}/commune/get-all`,
                ),
                axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/${import.meta.env.VITE_API_KEY}/business-line/get-all`,
                ),
                axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/${import.meta.env.VITE_API_KEY}/category/get-all`,
                ),
            ]);

            const regionesData = regionesRes.data.response;
            const provinciasData = provinciasRes.data.response;
            const comunasData = comunasRes.data.response;
            const girosData = girosRes.data.response;
            const categoriasData = categoriasRes.data.response;

            setRegiones(regionesData);
            setProvincias(provinciasData);
            setComunas(comunasData);
            setGiros(girosData);
            setCategorias(categoriasData);

            // Almacena los datos en sessionStorage
            sessionStorage.setItem('regiones', JSON.stringify(regionesData));
            sessionStorage.setItem(
                'provincias',
                JSON.stringify(provinciasData),
            );
            sessionStorage.setItem('comunas', JSON.stringify(comunasData));
            sessionStorage.setItem('giros', JSON.stringify(girosData));
            sessionStorage.setItem(
                'categorias',
                JSON.stringify(categoriasData),
            );
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const login = (
        token: string,
        userType: string,
        userEmail: string,
        userName: string,
        userLastName: string,
    ) => {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('userType', userType);
        sessionStorage.setItem('userEmail', userEmail);
        sessionStorage.setItem('userName', userName);
        sessionStorage.setItem('userLastName', userLastName);
        setToken(token);
        setIsAuthenticated(true);
        setUserType(userType);
        setUserEmail(userEmail);
        setUserName(userName);
        setUserLastName(userLastName);
        fetchGlobalData();
    };

    const logout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userType');
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('userName');
        sessionStorage.removeItem('userLastName');
        setToken(null);
        setIsAuthenticated(false);
        setUserType(null);
        setUserEmail(null);
        setUserName(null);
        setUserLastName(null);
    };

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const userType = sessionStorage.getItem('userType');
        const userEmail = sessionStorage.getItem('userEmail');
        const userName = sessionStorage.getItem('userName');
        const userLastName = sessionStorage.getItem('userLastName');
        if (token) {
            setToken(token);
            setIsAuthenticated(true);
            setUserType(userType);
            setUserEmail(userEmail);
            setUserName(userName);
            setUserLastName(userLastName);
        }
    }, []);

    // Cargar datos desde sessionStorage cuando se monta el componente
    useEffect(() => {
        const regionesData = sessionStorage.getItem('regiones');
        const provinciasData = sessionStorage.getItem('provincias');
        const comunasData = sessionStorage.getItem('comunas');
        const girosData = sessionStorage.getItem('giros');
        const categoriasData = sessionStorage.getItem('categorias');

        if (regionesData) setRegiones(JSON.parse(regionesData));
        if (provinciasData) setProvincias(JSON.parse(provinciasData));
        if (comunasData) setComunas(JSON.parse(comunasData));
        if (girosData) setGiros(JSON.parse(girosData));
        if (categoriasData) setCategorias(JSON.parse(categoriasData));
    }, []);

    return (
        <DataAuthContext.Provider
            value={{
                regiones,
                provincias,
                comunas,
                giros,
                categorias,
                token,
                isAuthenticated,
                userType,
                userEmail,
                userName,
                userLastName,
                login,
                logout,
            }}
        >
            {children}
        </DataAuthContext.Provider>
    );
};

export const useData = (): DataAuthContextType => {
    const context = useContext(DataAuthContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};