import { Link } from 'react-router-dom';
import { useData } from '../../components/AuthDataContext';

function NotFound() {
    const { token } = useData();
    const isAuthenticated = !!token;

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-blue-100 text-blue-900">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-2">
                Página no encontrada
            </h2>
            <p className="text-lg mb-6 text-center">
                Lo sentimos, la página que estás buscando no existe o ha sido
                movida.
            </p>
            <Link
                to={isAuthenticated ? '/dashboard' : '/'}
                className="px-4 py-2 bg-blue-900 text-white rounded-lg"
            >
                {isAuthenticated ? 'Ir al Dashboard' : 'Ir al Inicio'}
            </Link>
        </div>
    );
}

export default NotFound;
