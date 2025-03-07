import React from 'react';
import CuadroTexto from '../../../../components/CuadroTexto';

interface ServicioECProps {
    informe: any;
    setInforme: React.Dispatch<React.SetStateAction<any>>;
    storageKey?: string;
}

const ServicioEC: React.FC<ServicioECProps> = ({ informe, setInforme }) => {
    return (
        <>
            <div className="mb-4">
                <h4 className="text-lg font-bold mb-2">I Antecedentes </h4>
                <CuadroTexto
                    onContentChange={(content) =>
                        setInforme((prev: any) => ({
                            ...prev,
                            antecedentes: content,
                        }))
                    }
                    initialContent={informe.antecedentes}
                    storageKey="editor-draft-antecedentes-EC"
                />
            </div>

            <div className="mb-4">
                <h4 className="text-lg font-bold mb-2">
                    II Identificación de la probeta a ensayar
                </h4>

                <div className="ml-4 mb-2">
                    <h5 className="text-md font-semibold mb-1">
                        2.1 Materiales y características
                    </h5>
                    <CuadroTexto
                        onContentChange={(content) =>
                            setInforme((prev: any) => ({
                                ...prev,
                                materiales_caracteristicas: content,
                            }))
                        }
                        initialContent={
                            informe.materiales_caracteristicas || ''
                        }
                        storageKey="editor-draft-materiales-caracteristicas-EC"
                    />
                </div>

                <div className="ml-4 mb-2">
                    <h5 className="text-md font-semibold mb-1">
                        2.2 Fecha de ensayo
                    </h5>
                    <CuadroTexto
                        onContentChange={(content) =>
                            setInforme((prev: any) => ({
                                ...prev,
                                fecha_ensayo_detalle: content,
                            }))
                        }
                        initialContent={informe.fecha_ensayo_detalle || ''}
                        storageKey="editor-draft-fecha-ensayo-detalle-EC"
                    />
                </div>

                <div className="ml-4 mb-2">
                    <h5 className="text-md font-semibold mb-1">
                        2.3 Dimensiones
                    </h5>
                    <CuadroTexto
                        onContentChange={(content) =>
                            setInforme((prev: any) => ({
                                ...prev,
                                dimensiones: content,
                            }))
                        }
                        initialContent={informe.dimensiones || ''}
                        storageKey="editor-draft-dimensiones-EC"
                    />
                </div>
            </div>

            <div className="mb-4">
                <h4 className="text-lg font-bold mb-2">
                    III Características del ensayo
                </h4>

                <div className="ml-4 mb-2">
                    <h5 className="text-md font-semibold mb-1">
                        3.1 Normativa Utilizada
                    </h5>
                    <CuadroTexto
                        onContentChange={(content) =>
                            setInforme((prev: any) => ({
                                ...prev,
                                normativa_utilizada: content,
                            }))
                        }
                        initialContent={informe.normativa_utilizada || ''}
                        storageKey="editor-draft-normativa-utilizada-EC"
                    />
                </div>

                <div className="ml-4 mb-2">
                    <h5 className="text-md font-semibold mb-1">
                        3.2 Otros Datos
                    </h5>
                    <CuadroTexto
                        onContentChange={(content) =>
                            setInforme((prev: any) => ({
                                ...prev,
                                otros_datos: content,
                            }))
                        }
                        initialContent={informe.otros_datos || ''}
                        storageKey="editor-draft-otros-datos-EC"
                    />
                </div>

                <div className="ml-4 mb-2">
                    <h5 className="text-md font-semibold mb-1">
                        3.3 Aplicación de la carga y medición
                    </h5>
                    <CuadroTexto
                        onContentChange={(content) =>
                            setInforme((prev: any) => ({
                                ...prev,
                                aplicacion_carga: content,
                            }))
                        }
                        initialContent={informe.aplicacion_carga || ''}
                        storageKey="editor-draft-aplicacion-carga-EC"
                    />
                </div>
            </div>

            <div className="mb-4">
                <h4 className="text-lg font-bold mb-2">IV Resultados</h4>
                <CuadroTexto
                    onContentChange={(content) =>
                        setInforme((prev: any) => ({
                            ...prev,
                            resultados: content,
                        }))
                    }
                    initialContent={informe.resultados}
                    storageKey="editor-draft-resultados-EC"
                />
            </div>

            <div className="mb-4">
                <h4 className="text-lg font-bold mb-2">V Modos de falla</h4>
                <CuadroTexto
                    onContentChange={(content) =>
                        setInforme((prev: any) => ({
                            ...prev,
                            modos_falla: content,
                        }))
                    }
                    initialContent={informe.modos_falla || ''}
                    storageKey="editor-draft-modos-falla-EC"
                />
            </div>

            <div className="mb-4">
                <h4 className="text-lg font-bold mb-2">VI Conclusiones</h4>
                <CuadroTexto
                    onContentChange={(content) =>
                        setInforme((prev: any) => ({
                            ...prev,
                            conclusiones: content,
                        }))
                    }
                    initialContent={informe.conclusiones || ''}
                    storageKey="editor-draft-conclusiones-EC"
                />
            </div>

            <div className="mb-4">
                <h4 className="text-lg font-bold mb-2">VII Observaciones</h4>
                <CuadroTexto
                    onContentChange={(content) =>
                        setInforme((prev: any) => ({
                            ...prev,
                            observaciones: content,
                        }))
                    }
                    initialContent={informe.observaciones}
                    storageKey="editor-draft-observaciones-EC"
                />
            </div>
        </>
    );
};

export default ServicioEC;
