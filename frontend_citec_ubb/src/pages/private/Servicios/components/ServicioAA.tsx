import React, { useState } from 'react';
import CuadroTexto from '../../../../components/CuadroTexto';

interface ServicioAAProps {
    informe: any;
    setInforme: React.Dispatch<React.SetStateAction<any>>;
    storageKey?: string;
}

const ServicioAA: React.FC<ServicioAAProps> = ({ informe, setInforme }) => {
    const [tipoServicio, setTipoServicio] = useState<string>('estructural');

    const handleTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTipoServicio(e.target.value);
    };

    return (
        <>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                    Tipo de Servicio AA
                </label>
                <select
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm sm:leading-5"
                    value={tipoServicio}
                    onChange={handleTipoChange}
                >
                    <option value="estructural">Estructural</option>
                    <option value="maquinaria">Maquinaria</option>
                </select>
            </div>

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
                    storageKey="editor-draft-antecedentes-AA"
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
                    storageKey="editor-draft-objetivo_ensayo-AA"
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
                    storageKey="editor-draft-identificacion_producto-AA"
                />
            </div>

            {tipoServicio === 'estructural' ? (
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
                            storageKey="editor-draft-metodos_equipos"
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
                            storageKey="editor-draft-condiciones_ensayo-AA"
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
                            storageKey="editor-draft-definiciones"
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
                            storageKey="editor-draft-resultados-AA"
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
                            storageKey="editor-draft-conclusiones"
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
                            storageKey="editor-draft-elementos_verificacion"
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
                            storageKey="editor-draft-observaciones-AA"
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
                            storageKey="editor-draft-procedencia_producto-maquinaria"
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
                            storageKey="editor-draft-norma_aplicada-maquinaria"
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
                            storageKey="editor-draft-metodologia_ensayo-maquinaria"
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
                            storageKey="editor-draft-condiciones_ensayo-maquinaria"
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
                            storageKey="editor-draft-fecha_ensayo-maquinaria"
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
                            storageKey="editor-draft-operador_equipamiento-maquinaria"
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
                            storageKey="editor-draft-resultados-maquinaria"
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
                            storageKey="editor-draft-comentarios-maquinaria"
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
                            storageKey="editor-draft-observaciones-maquinaria"
                        />
                    </div>
                </>
            )}
        </>
    );
};

export default ServicioAA;
