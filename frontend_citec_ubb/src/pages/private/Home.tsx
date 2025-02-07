import React from 'react';

const Home: React.FC = () => {
    return (
        <div className="flex flex-col items-center ">
            {/* Nuestro centro */}
            <header className="bg-primary text-center w-full h-screen mb-3">
                <div className="w-full h-full bg-[url('../Edificio-CITEC.jpg')] bg-cover bg-center">
                    <div className="w-full h-full flex flex-col justify-center items-center text-white break-words bg-black bg-opacity-55">
                        <h1 className="sm:text-6xl font-bold mb-8">
                            Bienvenidos a CITECUBB
                        </h1>
                        <p className="sm:text-2xl text-center font-bold mb-6">
                            Centro de Investigación en Tecnologías de la
                            Construcción.
                        </p>
                        <p className="sm:text-xl text-center break-words">
                            Dedicados a aportar investigación y desarrollo en
                            áreas de la ciencias y tecnologías de la
                            construcción.
                        </p>
                    </div>
                </div>
            </header>
            {/* Main Content */}
            <main className="w-full flex flex-col items-center space-y-10">
                {/* Highlights */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    <div className="bg-white p-6 shadow-md rounded-lg text-center">
                        <h3 className="text-xl font-semibold text-primary">
                            Investigación de Materiales
                        </h3>
                        <p className="text-gray-600 mt-2">
                            Realizamos pruebas exhaustivas en materiales de
                            construcción para verificar su resistencia y
                            durabilidad.
                        </p>
                    </div>
                    <div className="bg-white p-6 shadow-md rounded-lg text-center">
                        <h3 className="text-xl font-semibold text-primary">
                            Validación de Normativas
                        </h3>
                        <p className="text-gray-600 mt-2">
                            Colaboramos con instituciones nacionales e
                            internacionales para validar normativas de
                            construcción.
                        </p>
                    </div>
                    <div className="bg-white p-6 shadow-md rounded-lg text-center">
                        <h3 className="text-xl font-semibold text-primary">
                            Innovación y Desarrollo
                        </h3>
                        <p className="text-gray-600 mt-2">
                            Impulsamos la innovación en el área de materiales
                            sostenibles y procesos de construcción.
                        </p>
                    </div>
                </section>

                {/* News Section */}
                <section className="w-full bg-white p-8 shadow-md rounded-lg">
                    <h2 className="text-2xl font-semibold mb-4 text-center">
                        Noticias y Actualizaciones
                    </h2>
                    <div className="flex flex-col space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                            <h3 className="text-lg font-medium text-primary">
                                Nuevo Convenio con la Industria
                            </h3>
                            <p className="text-gray-700 mt-1">
                                CITEC UBB ha firmado un convenio con empresas
                                líderes en la industria de la construcción para
                                fomentar la investigación y desarrollo en
                                materiales sostenibles.
                            </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                            <h3 className="text-lg font-medium text-primary">
                                Nuevos Protocolos de Prueba
                            </h3>
                            <p className="text-gray-700 mt-1">
                                Se han actualizado los protocolos de prueba para
                                la validación de resistencia de materiales en
                                condiciones extremas.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="w-full bg-primary py-4 text-center mt-10">
                <p className="text-sm">
                    © {new Date().getFullYear()} CITEC UBB - Universidad del
                    Bío-Bío. Todos los derechos reservados.
                </p>
            </footer>
        </div>
    );
};

export default Home;
