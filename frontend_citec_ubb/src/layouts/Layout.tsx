import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useData } from '../components/AuthDataContext';

function Layout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { userEmail, userName, userLastName, logout } = useData();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
    const toggleProfileMenu = () => {
        setProfileMenuOpen(!isProfileMenuOpen);
    };

    const [isEmpresasMenuOpen, setIsEmpresasMenuOpen] = useState(false);
    const toggleEmpresasMenu = () => {
        setIsEmpresasMenuOpen(!isEmpresasMenuOpen);
    };

    const [isUsuariosMenuOpen, setIsUsuariosMenuOpen] = useState(false);
    const toggleUsuariosMenu = () => {
        setIsUsuariosMenuOpen(!isUsuariosMenuOpen);
    };

    const [isServiciosMenuOpen, setIsServiciosMenuOpen] = useState(false);
    const toggleServiciosMenu = () => {
        setIsServiciosMenuOpen(!isServiciosMenuOpen);
    };

    const [isEnsayosMenuOpen, setIsEnsayosMenuOpen] = useState(false);
    const toggleEnsayosMenu = () => {
        setIsEnsayosMenuOpen(!isEnsayosMenuOpen);
    };

    const [isOrdenTrabajoMenuOpen, setIsOrdenTrabajoMenuOpen] = useState(false);
    const toggleOrdenTrabajoMenu = () => {
        setIsOrdenTrabajoMenuOpen(!isOrdenTrabajoMenuOpen);
    };

    return (
        <>
            <div className="flex">
                <nav className="fixed top-0 z-50 w-full border-b bg-blue-700 border-blue-700 ">
                    <div className="h-12">
                        <div className="flex items-center justify-between h-full">
                            <div className="flex items-center justify-start rtl:justify-end">
                                <button
                                    onClick={toggleSidebar}
                                    type="button"
                                    className="inline-flex items-center p-2 text-sm text-white rounded-lg sm:hidden hover:bg-blue-600 focus:outline-none"
                                >
                                    <span className="sr-only">
                                        Abre la barra lateral
                                    </span>
                                    <svg
                                        className="w-6 h-6"
                                        aria-hidden="true"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            clipRule="evenodd"
                                            fillRule="evenodd"
                                            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                                        ></path>
                                    </svg>
                                </button>

                                <Link
                                    to={'/dashboard'}
                                    className="flex ms-2 md:me-24"
                                >
                                    <img
                                        src="/escudo-ubb.png"
                                        className="h-8 me-3"
                                        alt="UBB logo"
                                    />
                                    <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-white">
                                        Citec UBB
                                    </span>
                                </Link>
                            </div>
                            <div className="flex items-center">
                                <div className="relative flex items-center ms-3">
                                    <div className="relative">
                                        <button
                                            onClick={toggleProfileMenu}
                                            type="button"
                                            className="flex text-sm rounded-full focus:ring-4 focus:ring-gray-300 mr-4"
                                            aria-expanded={isProfileMenuOpen}
                                        >
                                            <span className="sr-only">
                                                Open user menu
                                            </span>
                                            <svg
                                                className="w-6 h-6"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                                                    fill="#ffffff"
                                                />
                                                <path
                                                    d="M12.0002 14.5C6.99016 14.5 2.91016 17.86 2.91016 22C2.91016 22.28 3.13016 22.5 3.41016 22.5H20.5902C20.8702 22.5 21.0902 22.28 21.0902 22C21.0902 17.86 17.0102 14.5 12.0002 14.5Z"
                                                    fill="#ffffff"
                                                />
                                            </svg>
                                        </button>
                                        {isProfileMenuOpen && (
                                            <>
                                                <div
                                                    className="fixed inset-0"
                                                    onClick={() =>
                                                        setProfileMenuOpen(
                                                            false,
                                                        )
                                                    }
                                                />
                                                <div
                                                    className="absolute right-0 z-50 mt-2 w-48 text-base list-none divide-y rounded shadow bg-gray-700 divide-gray-600"
                                                    id="dropdown-user"
                                                >
                                                    <div
                                                        className="px-4 py-3"
                                                        role="none"
                                                    >
                                                        <p
                                                            className="text-sm text-white"
                                                            role="none"
                                                        >
                                                            {`${userName} ${userLastName}`}
                                                        </p>
                                                        <p
                                                            className="text-sm font-medium truncate text-gray-300"
                                                            role="none"
                                                        >
                                                            {userEmail}
                                                        </p>
                                                    </div>
                                                    <ul
                                                        className="py-1"
                                                        role="none"
                                                    >
                                                        <li>
                                                            <button
                                                                onClick={logout}
                                                                className="block px-4 py-2 text-sm text-white hover:bg-gray-600 w-full text-left"
                                                                role="menuitem"
                                                            >
                                                                Cerrar sesión
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                <aside
                    id="logo-sidebar"
                    className={`fixed top-0 left-0 z-40 w-52 h-screen pt-20 transition-transform transform ${
                        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } sm:translate-x-0 bg-blue-800`}
                    aria-label="Sidebar"
                >
                    <div className="h-full px-3 pb-4 overflow-y-auto bg-blue-800">
                        <ul className="space-y-2 font-medium">
                            <li>
                                <div>
                                    <button
                                        onClick={toggleUsuariosMenu}
                                        className="flex items-center justify-between p-2 text-white rounded-lg hover:bg-blue-700 group w-full"
                                    >
                                        <div className="flex items-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-7 h-7 transition duration-75 text-white group-hover:text-gray-300"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="#ffffff"
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path
                                                    stroke="none"
                                                    d="M0 0h24v24H0z"
                                                    fill="none"
                                                />
                                                <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                                                <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                                            </svg>
                                            <span className="ml-2">
                                                Usuario
                                            </span>
                                        </div>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`w-5 h-5 transition-transform ${
                                                isUsuariosMenuOpen
                                                    ? 'rotate-180'
                                                    : ''
                                            }`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </button>
                                    {isUsuariosMenuOpen && (
                                        <ul className="mt-1 space-y-2 pl-6">
                                            <li>
                                                <Link
                                                    to={
                                                        '/dashboard/usuarios/crear'
                                                    }
                                                    className="flex items-center p-2 text-white rounded-lg hover:bg-blue-700 group"
                                                >
                                                    Crear Usuario
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to={'/dashboard/usuarios'}
                                                    className="flex items-center p-2 text-white rounded-lg hover:bg-blue-700 group"
                                                >
                                                    Ver Usuarios
                                                </Link>
                                            </li>
                                        </ul>
                                    )}
                                </div>
                            </li>

                            <li>
                                <div>
                                    <button
                                        onClick={toggleEmpresasMenu}
                                        className="flex items-center justify-between p-2 text-white rounded-lg hover:bg-blue-700 group w-full"
                                    >
                                        <div className="flex items-center">
                                            <svg
                                                className="w-7 h-7 transition duration-75 text-white group-hover:text-gray-300"
                                                viewBox="0 0 16 16"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="currentcolor"
                                            >
                                                <path
                                                    d="M323.5-192h-9a1.5,1.5,0,0,0-1.5,1.5V-176h12v-14.5A1.5,1.5,0,0,0,323.5-192ZM318-177v-3h2v3Zm6,0h-3v-3.5a.5.5,0,0,0-.5-.5h-3a.5.5,0,0,0-.5.5v3.5h-3v-13.5a.5.5,0,0,1,.5-.5h9a.5.5,0,0,1,.5.5Zm-8-12h2v2h-2Zm4,0h2v2h-2Zm-4,4h2v2h-2Zm4,0h2v2h-2Z"
                                                    transform="translate(-313 192)"
                                                ></path>
                                            </svg>
                                            <span className="ml-2">
                                                Empresas
                                            </span>
                                        </div>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`w-5 h-5 transition-transform ${
                                                isEmpresasMenuOpen
                                                    ? 'rotate-180'
                                                    : ''
                                            }`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </button>
                                    {isEmpresasMenuOpen && (
                                        <ul className="mt-1 space-y-2 pl-6">
                                            <li>
                                                <Link
                                                    to={
                                                        '/dashboard/empresas/crear'
                                                    }
                                                    className="flex items-center p-2 text-white rounded-lg hover:bg-blue-700 group"
                                                >
                                                    Crear Empresa
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to={'/dashboard/empresas'}
                                                    className="flex items-center p-2 text-white rounded-lg hover:bg-blue-700 group"
                                                >
                                                    Ver Empresas
                                                </Link>
                                            </li>
                                        </ul>
                                    )}
                                </div>
                            </li>

                            <li>
                                <div>
                                    <button
                                        onClick={toggleServiciosMenu}
                                        className="flex items-center justify-between p-2 text-white rounded-lg hover:bg-blue-700 group w-full"
                                    >
                                        <div className="flex items-center">
                                            <svg
                                                className="w-7 h-7"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                stroke="#ffffff"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    strokeWidth="0"
                                                    d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H8C8.55228 23 9 22.5523 9 22C9 21.4477 8.55228 21 8 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V7C19 7.55228 19.4477 8 20 8C20.5523 8 21 7.55228 21 7V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM13.5067 11.3155C13.6011 10.0209 14.6813 9 16 9H17C18.3186 9 19.3988 10.0209 19.4933 11.3155C20.6616 10.75 22.0859 11.175 22.7452 12.317L23.2452 13.183C23.9045 14.325 23.5605 15.7709 22.4866 16.5C23.5605 17.2291 23.9045 18.675 23.2452 19.817L22.7452 20.683C22.0859 21.825 20.6616 22.25 19.4933 21.6845C19.3988 22.9791 18.3186 24 17 24H16C14.6813 24 13.6011 22.9791 13.5067 21.6845C12.3384 22.25 10.9141 21.825 10.2548 20.683L9.7548 19.817C9.09548 18.675 9.43952 17.2291 10.5134 16.5C9.43952 15.7709 9.09548 14.325 9.7548 13.183L10.2548 12.317C10.9141 11.175 12.3384 10.75 13.5067 11.3155ZM16 11C15.7238 11 15.5 11.2239 15.5 11.5V12.4678C15.5 12.8474 15.285 13.1943 14.945 13.3633C14.8128 13.429 14.6852 13.5029 14.5629 13.5844C14.2464 13.7952 13.8378 13.8083 13.5085 13.6181L12.6699 13.134C12.4307 12.9959 12.1249 13.0778 11.9868 13.317L11.4868 14.183C11.3488 14.4222 11.4307 14.728 11.6699 14.866L12.5088 15.3504C12.8375 15.5402 13.0304 15.8997 13.0069 16.2785C13.0023 16.3516 13 16.4255 13 16.5C13 16.5745 13.0023 16.6484 13.0069 16.7215C13.0304 17.1003 12.8375 17.4598 12.5088 17.6496L11.6699 18.134C11.4307 18.272 11.3488 18.5778 11.4868 18.817L11.9868 19.683C12.1249 19.9222 12.4307 20.0041 12.6699 19.866L13.5085 19.3819C13.8378 19.1917 14.2464 19.2048 14.5629 19.4156C14.6852 19.4971 14.8128 19.571 14.945 19.6367C15.285 19.8057 15.5 20.1526 15.5 20.5322V21.5C15.5 21.7761 15.7238 22 16 22H17C17.2761 22 17.5 21.7761 17.5 21.5V20.5323C17.5 20.1526 17.715 19.8057 18.055 19.6367C18.1872 19.571 18.3148 19.4971 18.4372 19.4156C18.7536 19.2048 19.1622 19.1917 19.4915 19.3819L20.3301 19.866C20.5693 20.0041 20.8751 19.9222 21.0131 19.683L21.5131 18.817C21.6512 18.5778 21.5693 18.272 21.3301 18.134L20.4912 17.6496C20.1625 17.4599 19.9696 17.1004 19.9931 16.7215C19.9977 16.6484 20 16.5745 20 16.5C20 16.4255 19.9977 16.3516 19.9931 16.2785C19.9696 15.8996 20.1625 15.5401 20.4912 15.3504L21.3301 14.866C21.5693 14.728 21.6512 14.4222 21.5131 14.183L21.0131 13.317C20.8751 13.0778 20.5693 12.9959 20.3301 13.134L19.4915 13.6181C19.1622 13.8083 18.7536 13.7952 18.4372 13.5844C18.3148 13.5029 18.1872 13.429 18.055 13.3633C17.715 13.1943 17.5 12.8474 17.5 12.4677V11.5C17.5 11.2239 17.2761 11 17 11H16ZM18.5 16.5C18.5 17.6046 17.6046 18.5 16.5 18.5C15.3954 18.5 14.5 17.6046 14.5 16.5C14.5 15.3954 15.3954 14.5 16.5 14.5C17.6046 14.5 18.5 15.3954 18.5 16.5Z"
                                                    fill="#ffffff"
                                                />
                                            </svg>
                                            <span className="ml-2">
                                                Servicios
                                            </span>
                                        </div>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`w-5 h-5 transition-transform ${
                                                isServiciosMenuOpen
                                                    ? 'rotate-180'
                                                    : ''
                                            }`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </button>
                                    {isServiciosMenuOpen && (
                                        <ul className="mt-1 space-y-2 pl-6">
                                            <li>
                                                <Link
                                                    to={
                                                        '/dashboard/propuestas/crear'
                                                    }
                                                    className="flex items-center p-2 text-white rounded-lg hover:bg-blue-700 group"
                                                >
                                                    Crear Servicio
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to={'/dashboard/propuestas'}
                                                    className="flex items-center p-2 text-white rounded-lg hover:bg-blue-700 group"
                                                >
                                                    Ver Servicios
                                                </Link>
                                            </li>

                                            <li>
                                                <Link
                                                    to={
                                                        '/dashboard/orden-trabajo/crear-informe'
                                                    }
                                                    className="flex items-center p-2 text-white rounded-lg hover:bg-blue-700 group"
                                                >
                                                    Crear Informe
                                                </Link>
                                            </li>
                                        </ul>
                                    )}
                                </div>
                            </li>
                            <li>
                                <div>
                                    <button
                                        onClick={toggleEnsayosMenu}
                                        className="flex items-center justify-between p-2 text-white rounded-lg hover:bg-blue-700 group w-full"
                                    >
                                        <div className="flex items-center">
                                            <svg
                                                className="w-7 h-7"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                stroke="#ffffff"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    strokeWidth="0"
                                                    d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H8C8.55228 23 9 22.5523 9 22C9 21.4477 8.55228 21 8 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V7C19 7.55228 19.4477 8 20 8C20.5523 8 21 7.55228 21 7V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM13.5067 11.3155C13.6011 10.0209 14.6813 9 16 9H17C18.3186 9 19.3988 10.0209 19.4933 11.3155C20.6616 10.75 22.0859 11.175 22.7452 12.317L23.2452 13.183C23.9045 14.325 23.5605 15.7709 22.4866 16.5C23.5605 17.2291 23.9045 18.675 23.2452 19.817L22.7452 20.683C22.0859 21.825 20.6616 22.25 19.4933 21.6845C19.3988 22.9791 18.3186 24 17 24H16C14.6813 24 13.6011 22.9791 13.5067 21.6845C12.3384 22.25 10.9141 21.825 10.2548 20.683L9.7548 19.817C9.09548 18.675 9.43952 17.2291 10.5134 16.5C9.43952 15.7709 9.09548 14.325 9.7548 13.183L10.2548 12.317C10.9141 11.175 12.3384 10.75 13.5067 11.3155ZM16 11C15.7238 11 15.5 11.2239 15.5 11.5V12.4678C15.5 12.8474 15.285 13.1943 14.945 13.3633C14.8128 13.429 14.6852 13.5029 14.5629 13.5844C14.2464 13.7952 13.8378 13.8083 13.5085 13.6181L12.6699 13.134C12.4307 12.9959 12.1249 13.0778 11.9868 13.317L11.4868 14.183C11.3488 14.4222 11.4307 14.728 11.6699 14.866L12.5088 15.3504C12.8375 15.5402 13.0304 15.8997 13.0069 16.2785C13.0023 16.3516 13 16.4255 13 16.5C13 16.5745 13.0023 16.6484 13.0069 16.7215C13.0304 17.1003 12.8375 17.4598 12.5088 17.6496L11.6699 18.134C11.4307 18.272 11.3488 18.5778 11.4868 18.817L11.9868 19.683C12.1249 19.9222 12.4307 20.0041 12.6699 19.866L13.5085 19.3819C13.8378 19.1917 14.2464 19.2048 14.5629 19.4156C14.6852 19.4971 14.8128 19.571 14.945 19.6367C15.285 19.8057 15.5 20.1526 15.5 20.5322V21.5C15.5 21.7761 15.7238 22 16 22H17C17.2761 22 17.5 21.7761 17.5 21.5V20.5323C17.5 20.1526 17.715 19.8057 18.055 19.6367C18.1872 19.571 18.3148 19.4971 18.4372 19.4156C18.7536 19.2048 19.1622 19.1917 19.4915 19.3819L20.3301 19.866C20.5693 20.0041 20.8751 19.9222 21.0131 19.683L21.5131 18.817C21.6512 18.5778 21.5693 18.272 21.3301 18.134L20.4912 17.6496C20.1625 17.4599 19.9696 17.1004 19.9931 16.7215C19.9977 16.6484 20 16.5745 20 16.5C20 16.4255 19.9977 16.3516 19.9931 16.2785C19.9696 15.8996 20.1625 15.5401 20.4912 15.3504L21.3301 14.866C21.5693 14.728 21.6512 14.4222 21.5131 14.183L21.0131 13.317C20.8751 13.0778 20.5693 12.9959 20.3301 13.134L19.4915 13.6181C19.1622 13.8083 18.7536 13.7952 18.4372 13.5844C18.3148 13.5029 18.1872 13.429 18.055 13.3633C17.715 13.1943 17.5 12.8474 17.5 12.4677V11.5C17.5 11.2239 17.2761 11 17 11H16ZM18.5 16.5C18.5 17.6046 17.6046 18.5 16.5 18.5C15.3954 18.5 14.5 17.6046 14.5 16.5C14.5 15.3954 15.3954 14.5 16.5 14.5C17.6046 14.5 18.5 15.3954 18.5 16.5Z"
                                                    fill="#ffffff"
                                                />
                                            </svg>
                                            <span className="ml-2">
                                                Ensayos
                                            </span>
                                        </div>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`w-5 h-5 transition-transform ${
                                                isEnsayosMenuOpen
                                                    ? 'rotate-180'
                                                    : ''
                                            }`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </button>
                                    {isEnsayosMenuOpen && (
                                        <ul className="mt-1 space-y-2 pl-6">
                                            <li>
                                                <Link
                                                    to={
                                                        '/dashboard/ensayos/crear'
                                                    }
                                                    className="flex items-center p-2 text-white rounded-lg hover:bg-blue-700 group"
                                                >
                                                    Crear Ensayo
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to={'/dashboard/ensayos'}
                                                    className="flex items-center p-2 text-white rounded-lg hover:bg-blue-700 group"
                                                >
                                                    Ver Ensayos
                                                </Link>
                                            </li>
                                        </ul>
                                    )}
                                </div>
                            </li>
                            <li>
                                <div>
                                    <button
                                        onClick={toggleOrdenTrabajoMenu}
                                        className="flex items-center justify-between p-2 text-white rounded-lg hover:bg-blue-700 group w-full"
                                    >
                                        <div className="flex items-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                width="40"
                                                height="40"
                                                strokeWidth="2"
                                            >
                                                <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                                                <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path>
                                                <path d="M14 11h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5"></path>
                                                <path d="M12 17v1m0 -8v1"></path>{' '}
                                            </svg>
                                            <span className="">
                                                Orden de trabajo
                                            </span>
                                        </div>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`w-5 h-5 transition-transform ${
                                                isOrdenTrabajoMenuOpen
                                                    ? 'rotate-180'
                                                    : ''
                                            }`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </button>
                                    {isOrdenTrabajoMenuOpen && (
                                        <ul className="mt-1 space-y-2 pl-6">
                                            <li>
                                                <Link
                                                    to={
                                                        '/dashboard/facturas/crear'
                                                    }
                                                    className="flex items-center p-2 text-white rounded-lg hover:bg-blue-700 group"
                                                >
                                                    Crear orden de trabajo
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to={'/dashboard/facturas'}
                                                    className="flex items-center p-2 text-white rounded-lg hover:bg-blue-700 group"
                                                >
                                                    Ver ordenes de trabajo
                                                </Link>
                                            </li>
                                        </ul>
                                    )}
                                </div>
                            </li>
                        </ul>
                    </div>
                </aside>

                <div className="sm:ml-52 mt-12 w-full">
                    <Outlet />
                </div>
            </div>
        </>
    );
}

export default Layout;
