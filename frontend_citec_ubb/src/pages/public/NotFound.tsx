import { Link } from 'react-router-dom';

function NotFound() {
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
                to="/"
                className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
            >
                Volver al Inicio
            </Link>
        </div>
    );
}

export default NotFound;
