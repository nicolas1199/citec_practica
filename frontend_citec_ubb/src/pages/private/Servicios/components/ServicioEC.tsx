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
                            antecedentes_EC: content,
                        }))
                    }
                    initialContent={informe.antecedentes_EC}
                    storageKey="editor-draft-antecedentes-EC"
                />
            </div>
            <div className="mb-4">
                <h4 className="text-lg font-bold mb-2">II Observaciones</h4>
                <CuadroTexto
                    onContentChange={(content) =>
                        setInforme((prev: any) => ({
                            ...prev,
                            observaciones_EC: content,
                        }))
                    }
                    initialContent={informe.observaciones_EC}
                    storageKey="editor-draft-observaciones-EC"
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
                            identificacion_producto_EC: content,
                        }))
                    }
                    initialContent={informe.identificacion_producto_EC}
                    storageKey="editor-draft-identificacion_producto-EC"
                />
            </div>
            <div className="mb-4">
                <h4 className="text-lg font-bold mb-2">
                    IV Procedencia del producto
                </h4>
                <CuadroTexto
                    onContentChange={(content) =>
                        setInforme((prev: any) => ({
                            ...prev,
                            procedencia_producto: content,
                        }))
                    }
                    initialContent={informe.especificaciones_tecnicas}
                    storageKey="editor-draft-procedencia_producto"
                />
            </div>
            <div className="mb-4">
                <h4 className="text-lg font-bold mb-2">V Norma aplicada</h4>
                <CuadroTexto
                    onContentChange={(content) =>
                        setInforme((prev: any) => ({
                            ...prev,
                            norma_aplicada: content,
                        }))
                    }
                    initialContent={informe.materiales_metodos}
                    storageKey="editor-draft-norma_aplicada"
                />
            </div>
            <div className="mb-4">
                <h4 className="text-lg font-bold mb-2">
                    VI Metodologia de ensayo
                </h4>
                <CuadroTexto
                    onContentChange={(content) =>
                        setInforme((prev: any) => ({
                            ...prev,
                            metodologia_ensayo: content,
                        }))
                    }
                    initialContent={informe.metodologia_ensayo}
                    storageKey="editor-draft-metodologia_ensayo"
                />
            </div>
            <div className="mb-4">
                <h4 className="text-lg font-bold mb-2">
                    VII Condiciones de ensayo
                </h4>
                <CuadroTexto
                    onContentChange={(content) =>
                        setInforme((prev: any) => ({
                            ...prev,
                            condiciones_ensayo_AC: content,
                        }))
                    }
                    initialContent={informe.condiciones_ensayo_AC}
                    storageKey="editor-draft-condiciones_ensayo-EC"
                />
            </div>

            <div className="mb-4">
                <h4 className="text-lg font-bold mb-2">
                    VIII Fecha de ensayo{' '}
                </h4>
                <CuadroTexto
                    onContentChange={(content) =>
                        setInforme((prev: any) => ({
                            ...prev,
                            fecha_ensayo: content,
                        }))
                    }
                    initialContent={informe.fecha_ensayo}
                    storageKey="editor-draft-fecha_ensayo"
                />
            </div>

            <div className="mb-4">
                <h4 className="text-lg font-bold mb-2">
                    IX Operador, equipamiento experimental y materiales de
                    laboratorio
                </h4>
                <CuadroTexto
                    onContentChange={(content) =>
                        setInforme((prev: any) => ({
                            ...prev,
                            operador_equipamiento: content,
                        }))
                    }
                    initialContent={informe.operador_equipamiento}
                    storageKey="editor-draft-operador_equipamiento"
                />
            </div>

            <div className="mb-4">
                <h4 className="text-lg font-bold mb-2">X Resultados</h4>
                <CuadroTexto
                    onContentChange={(content) =>
                        setInforme((prev: any) => ({
                            ...prev,
                            resultados_EC: content,
                        }))
                    }
                    initialContent={informe.resultados_EC}
                    storageKey="editor-draft-resultados-EC"
                />
            </div>

            <div className="mb-4">
                <h4 className="text-lg font-bold mb-2">XI Comentarios</h4>
                <CuadroTexto
                    onContentChange={(content) =>
                        setInforme((prev: any) => ({
                            ...prev,
                            comentarios: content,
                        }))
                    }
                    initialContent={informe.comentarios}
                    storageKey="editor-draft-comentarios"
                />
            </div>

            <div className="mb-4">
                <h4 className="text-lg font-bold mb-2">XII Observaciones</h4>
                <CuadroTexto
                    onContentChange={(content) =>
                        setInforme((prev: any) => ({
                            ...prev,
                            observaciones_EC: content,
                        }))
                    }
                    initialContent={informe.observaciones_EC}
                    storageKey="editor-draft-observaciones-EC"
                />
            </div>
        </>
    );
};

export default ServicioEC;
