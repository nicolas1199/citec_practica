export const ENDPOINTS = {
    USUARIOS: {
        CREAR: 'usuarios/crear',
        ACTUALIZAR: 'usuarios/actualizar',
        OBTENER_POR_ID: 'usuarios/obtener-por-id',
        OBTENER_TODOS: 'usuarios/obtener-todos',
        OBTENER_TODOS_ELIMINADOS: 'usuarios/obtener-todos-eliminados',
        ELIMINAR: 'usuarios/eliminar',
    },
    EMPRESAS: {
        CREAR: 'empresas/crear',
        ACTUALIZAR: 'empresas/actualizar',
        OBTENER_POR_ID: 'empresas/obtener-por-id',
        OBTENER_TODOS: 'empresas/obtener-todos',
        OBTENER_TODOS_ELIMINADOS: 'empresas/obtener-todos-eliminados',
        ELIMINAR: 'empresas/eliminar',
    },
    COMUNA: {
        OBTENER_TODOS: 'comunas/obtener-todos',
        OBTENER_POR_ID: 'comunas/obtener-por-id',
    },
    AUTENTICACION: {
        INICIAR: 'autenticacion/iniciar-sesion',
    },
    PROVINCIAS: {
        OBTENER_TODOS: 'provincias/obtener-todos',
        OBTENER_POR_ID: 'provincias/obtener-por-id',
    },
    REGIONES: {
        OBTENER_TODOS: 'regiones/obtener-todos',
        OBTENER_POR_ID: 'regiones/obtener-por-id',
    },
    GIROS: {
        OBTENER_TODOS: 'giros/obtener-todos',
        OBTENER_POR_ID: 'giros/obtener-por-id',
    },
    TIPOSUSUARIO: {
        OBTENER_TODOS: 'tipos/obtener-todos',
        OBTENER_POR_ID: 'tipos/obtener-por-id',
    },
    GRUPO_DE_SERVICIOS: {
        OBTENER_TODOS: 'grupo-de-servicios/obtener-todos',
        OBTENER_POR_ID: 'grupo-de-servicios/obtener-por-id',
    },
    SUB_SERVICIOS: {
        OBTENER_TODOS: 'sub-servicios/obtener-todos',
        OBTENER_POR_ID: 'sub-servicios/obtener-por-id',
    },
    ENSAYOS: {
        CREAR: 'ensayos/crear',
        ACTUALIZAR: 'ensayos/editar',
        OBTENER_POR_ID: 'ensayos/obtener-por-id',
        OBTENER_TODOS: 'ensayos/obtener-todos',
        OBTENER_TODOS_ELIMINADOS: 'ensayos/obtener-todos-eliminados',
        ELIMINAR: 'ensayos/eliminar',
    },
    PROPUESTAS_DE_SERVICIOS: {
        CREAR: 'propuestas-de-servicios/crear',
        ACTUALIZAR: 'propuestas-de-servicios/actualizar',
        OBTENER_POR_ID: 'propuestas-de-servicios/obtener-por-id',
        OBTENER_TODOS: 'propuestas-de-servicios/obtener-todos',
        OBTENER_TODOS_ELIMINADOS:
            'propuestas-de-servicios/obtener-todos-eliminados',
        ELIMINAR: 'propuestas-de-servicios/eliminar',
    },
    DOCUMENTOS: {
        CREAR: 'documentos/crear',
        ACTUALIZAR: 'documentos/actualizar',
        OBTENER_POR_ID: 'documentos/obtener-por-id',
        OBTENER_TODOS: 'documentos/obtener-todos',
        ELIMINAR: 'documentos/eliminar',
        GENERAR_PDF: 'documentos/generar-pdf',
        OBTENER_PDF_POR_ID: 'documentos/obtener-pdf',
    },
    AREAS_DOCUMENTOS: {
        OBTENER_TODOS: 'area-documentos/obtener-todos',
        OBTENER_POR_ID: 'area-documentos/obtener-por-id',
    },
} as const;

/**
 * Ejemplos de llamadas a la Api
 */
// axios.get(`${import.meta.env.VITE_BACKEND_URL}/${ENDPOINTS.USUARIOS.OBTENER_POR_ID}/id`)
// axios.post(`${import.meta.env.VITE_BACKEND_URL}/${ENDPOINTS.USUARIOS.CREAR}`,{})
// axios.put(`${import.meta.env.VITE_BACKEND_URL}/${ENDPOINTS.USUARIOS.ACTUALIZAR}`,{})
