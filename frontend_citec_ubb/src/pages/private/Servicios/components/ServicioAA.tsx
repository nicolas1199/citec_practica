import React from 'react';
import CuadroTexto from '../../../../components/CuadroTexto';

interface ServicioAAProps {
    informe: any;
    setInforme: React.Dispatch<React.SetStateAction<any>>;
    tipoAA: 'maquinaria' | 'estructural';
    storageKey?: string;
}

const ServicioAA: React.FC<ServicioAAProps> = ({
    informe,
    setInforme,
    tipoAA,
}) => {
    const getStorageKey = (baseKey: string) =>
        `editor-draft-${baseKey}-${tipoAA}`;

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
                    storageKey={getStorageKey('antecedentes')}
                />
            </div>
            <div className="mb-4">
                <h4 className="text-lg font-bold mb-2">
                    II Objetivo del ensayo
                </h4>
                <CuadroTexto
                    onContentChange={(content) =>
                        setInforme((prev: any) => ({
                            ...prev,
                            objetivo_ensayo: content,
                        }))
                    }
                    initialContent={informe.objetivo_ensayo}
                    storageKey={getStorageKey('objetivo_ensayo')}
                />
            </div>
            <div className="mb-4">
                <h4 className="text-lg font-bold mb-2">
                    III Identificación del producto sometido a ensayo
                </h4>
                <CuadroTexto
                    onContentChange={(content) =>
                        setInforme((prev: any) => ({
                            ...prev,
                            identificacion_producto: content,
                        }))
                    }
                    initialContent={informe.identificacion_producto}
                    storageKey={getStorageKey('identificacion_producto')}
                />
            </div>

            {tipoAA === 'estructural' ? (
                // Secciones específicas para Estructural
                <>
                    <div className="mb-4">
                        <h4 className="text-lg font-bold mb-2">
                            IV Métodos y equipos
                        </h4>
                        <CuadroTexto
                            onContentChange={(content) =>
                                setInforme((prev) => ({
                                    ...prev,
                                    metodos_equipos: content,
                                }))
                            }
                            initialContent={informe.metodos_equipos}
                            storageKey={getStorageKey('metodos_equipos')}
                        />
                    </div>
                    <div className="mb-4">
                        <h4 className="text-lg font-bold mb-2">
                            V Condiciones de ensayo
                        </h4>
                        <CuadroTexto
                            onContentChange={(content) =>
                                setInforme((prev) => ({
                                    ...prev,
                                    condiciones_ensayo: content,
                                }))
                            }
                            initialContent={informe.condiciones_ensayo}
                            storageKey={getStorageKey('condiciones_ensayo')}
                        />
                    </div>
                    <div className="mb-4">
                        <h4 className="text-lg font-bold mb-2">
                            VI Definiciones
                        </h4>
                        <CuadroTexto
                            onContentChange={(content) =>
                                setInforme((prev) => ({
                                    ...prev,
                                    definiciones: content,
                                }))
                            }
                            initialContent={informe.definiciones}
                            storageKey={getStorageKey('definiciones')}
                        />
                    </div>
                    <div className="mb-4">
                        <h4 className="text-lg font-bold mb-2">
                            VII Resultados
                        </h4>
                        <CuadroTexto
                            onContentChange={(content) =>
                                setInforme((prev) => ({
                                    ...prev,
                                    resultados: content,
                                }))
                            }
                            initialContent={informe.resultados}
                            storageKey={getStorageKey('resultados')}
                        />
                    </div>
                    <div className="mb-4">
                        <h4 className="text-lg font-bold mb-2">
                            VIII Conclusiones y observaciones
                        </h4>
                        <CuadroTexto
                            onContentChange={(content) =>
                                setInforme((prev) => ({
                                    ...prev,
                                    conclusiones: content,
                                }))
                            }
                            initialContent={informe.conclusiones}
                            storageKey={getStorageKey('conclusiones')}
                        />
                    </div>
                    <div className="mb-4">
                        <h4 className="text-lg font-bold mb-2">
                            IX Elementos de verificación
                        </h4>
                        <CuadroTexto
                            onContentChange={(content) =>
                                setInforme((prev) => ({
                                    ...prev,
                                    elementos_verificacion: content,
                                }))
                            }
                            initialContent={informe.elementos_verificacion}
                            storageKey={getStorageKey('elementos_verificacion')}
                        />
                    </div>
                    <div className="mb-4">
                        <h4 className="text-lg font-bold mb-2">
                            X Observaciones
                        </h4>
                        <CuadroTexto
                            onContentChange={(content) =>
                                setInforme((prev) => ({
                                    ...prev,
                                    observaciones: content,
                                }))
                            }
                            initialContent={informe.observaciones}
                            storageKey={getStorageKey('observaciones')}
                        />
                    </div>
                </>
            ) : (
                // Secciones específicas para Maquinaria
                <>
                    <div className="mb-4">
                        <h4 className="text-lg font-bold mb-2">
                            IV Procedencia del producto
                        </h4>
                        <CuadroTexto
                            onContentChange={(content) =>
                                setInforme((prev) => ({
                                    ...prev,
                                    procedencia_producto: content,
                                }))
                            }
                            initialContent={informe.procedencia_producto}
                            storageKey={getStorageKey('procedencia_producto')}
                        />
                    </div>
                    <div className="mb-4">
                        <h4 className="text-lg font-bold mb-2">
                            V Norma aplicada
                        </h4>
                        <CuadroTexto
                            onContentChange={(content) =>
                                setInforme((prev) => ({
                                    ...prev,
                                    norma_aplicada: content,
                                }))
                            }
                            initialContent={informe.norma_aplicada}
                            storageKey={getStorageKey('norma_aplicada')}
                        />
                    </div>
                    <div className="mb-4">
                        <h4 className="text-lg font-bold mb-2">
                            VI Metodología de ensayo
                        </h4>
                        <CuadroTexto
                            onContentChange={(content) =>
                                setInforme((prev) => ({
                                    ...prev,
                                    metodologia_ensayo: content,
                                }))
                            }
                            initialContent={informe.metodologia_ensayo}
                            storageKey={getStorageKey('metodologia_ensayo')}
                        />
                    </div>
                    <div className="mb-4">
                        <h4 className="text-lg font-bold mb-2">
                            VII Condiciones de ensayo
                        </h4>
                        <CuadroTexto
                            onContentChange={(content) =>
                                setInforme((prev) => ({
                                    ...prev,
                                    condiciones_ensayo: content,
                                }))
                            }
                            initialContent={informe.condiciones_ensayo}
                            storageKey={getStorageKey('condiciones_ensayo')}
                        />
                    </div>
                    <div className="mb-4">
                        <h4 className="text-lg font-bold mb-2">
                            VIII Fecha de ensayo
                        </h4>
                        <CuadroTexto
                            onContentChange={(content) =>
                                setInforme((prev) => ({
                                    ...prev,
                                    fecha_ensayo: content,
                                }))
                            }
                            initialContent={informe.fecha_ensayo}
                            storageKey={getStorageKey('fecha_ensayo')}
                        />
                    </div>
                    <div className="mb-4">
                        <h4 className="text-lg font-bold mb-2">
                            IX Operador, equipamiento experimental y materiales
                            de laboratorio
                        </h4>
                        <CuadroTexto
                            onContentChange={(content) =>
                                setInforme((prev) => ({
                                    ...prev,
                                    operador_equipamiento: content,
                                }))
                            }
                            initialContent={informe.operador_equipamiento}
                            storageKey={getStorageKey('operador_equipamiento')}
                        />
                    </div>
                    <div className="mb-4">
                        <h4 className="text-lg font-bold mb-2">X Resultados</h4>
                        <CuadroTexto
                            onContentChange={(content) =>
                                setInforme((prev) => ({
                                    ...prev,
                                    resultados: content,
                                }))
                            }
                            initialContent={informe.resultados}
                            storageKey={getStorageKey('resultados')}
                        />
                    </div>
                    <div className="mb-4">
                        <h4 className="text-lg font-bold mb-2">
                            XI Comentarios
                        </h4>
                        <CuadroTexto
                            onContentChange={(content) =>
                                setInforme((prev) => ({
                                    ...prev,
                                    comentarios: content,
                                }))
                            }
                            initialContent={informe.comentarios}
                            storageKey={getStorageKey('comentarios')}
                        />
                    </div>
                    <div className="mb-4">
                        <h4 className="text-lg font-bold mb-2">
                            XII Observaciones
                        </h4>
                        <CuadroTexto
                            onContentChange={(content) =>
                                setInforme((prev) => ({
                                    ...prev,
                                    observaciones: content,
                                }))
                            }
                            initialContent={informe.observaciones}
                            storageKey={getStorageKey('observaciones')}
                        />
                    </div>
                </>
            )}
        </>
    );
};

export default ServicioAA;
