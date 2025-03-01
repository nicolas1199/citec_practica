import React from 'react';
import CuadroTexto from '../../../../components/CuadroTexto';

interface ServicioAAProps {
    informe: any;
    setInforme: React.Dispatch<React.SetStateAction<any>>;
    storageKey?: string;
}

const ServicioAA: React.FC<ServicioAAProps> = ({ informe, setInforme }) => {
    return (
        <>
            <div className="mb-4">
                <h4 className="text-lg font-bold mb-2">I Antecedentes </h4>
                <CuadroTexto
                    onContentChange={(content) =>
                        setInforme((prev: any) => ({
                            ...prev,
                            antecedentes_AC: content,
                        }))
                    }
                    initialContent={informe.antecedentes_AC}
                    storageKey="editor-draft-antecedentes-AC"
                />
            </div>
            <div className="mb-4">
                <h4 className="text-lg font-bold mb-2">II Observaciones</h4>
                <CuadroTexto
                    onContentChange={(content) =>
                        setInforme((prev: any) => ({
                            ...prev,
                            observaciones_AC: content,
                        }))
                    }
                    initialContent={informe.observaciones_AC}
                    storageKey="editor-draft-observaciones-AC"
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
                            identificacion_producto_AC: content,
                        }))
                    }
                    initialContent={informe.identificacion_producto_AC}
                    storageKey="editor-draft-identificacion_producto-AC"
                />
            </div>
            <div className="mb-4">
                <h4 className="text-lg font-bold mb-2">IV Metodos y equipos</h4>

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
                            condiciones_ensayo_AC: content,
                        }))
                    }
                    initialContent={informe.condiciones_ensayo_AC}
                    storageKey="editor-draft-condiciones_ensayo-AC"
                />
            </div>

            <div className="mb-4">
                <h4 className="text-lg font-bold mb-2">VI Definiciones</h4>

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
                <h4 className="text-lg font-bold mb-2">VII Resultados</h4>

                <CuadroTexto
                    onContentChange={(content) =>
                        setInforme((prev) => ({
                            ...prev,
                            resultados_AC: content,
                        }))
                    }
                    initialContent={informe.resultados_AC}
                    storageKey="editor-draft-resultados-AC"
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
                    IX Elementos de verificacion
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
                <h4 className="text-lg font-bold mb-2">X Observaciones</h4>

                <CuadroTexto
                    onContentChange={(content) =>
                        setInforme((prev) => ({
                            ...prev,
                            observaciones_AC: content,
                        }))
                    }
                    initialContent={informe.observaciones_AC}
                    storageKey="editor-draft-observaciones-AC"
                />
            </div>
        </>
    );
};

export default ServicioAA;
