import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {
    CrearDocumentoDto,
    EliminarDocumentoDto,
    obtenerDocumentoPorIdDto,
    ActualizarDocumentoDto,
} from '../dto/documento.dto';
import Documentos from 'src/database/models/documentos.model';
import { BaseServices } from 'src/common/base/base-services.class';
import { VALIDEZ_DE_DOCUMENTO } from 'src/common/constants/validez-de-documento.constants';
import { ValidezDocumentos } from 'src/database/models/validez-documento.model';
import { PdfGeneratorService } from '../../common/services/pdf-generator.service';
import { GenerarPdfDto } from '../dto/generar-pdf.dto';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class DocumentosService extends BaseServices {
    constructor(private readonly pdfGeneratorService: PdfGeneratorService) {
        super();
    }

    async crear(documento: CrearDocumentoDto): Promise<Documentos> {
        const existeDocumento = await Documentos.findOne({
            where: { nombre: documento.nombre },
        });
        if (existeDocumento) {
            throw new ConflictException([
                'Ya existe un documento con ese nombre',
            ]);
        }
        const documentoCreado = await Documentos.create({
            ...documento,
        });
        return documentoCreado;
    }

    async obtenerTodos(): Promise<Documentos[]> {
        const documentos = await Documentos.findAll();
        if (documentos.length === 0) {
            throw new NotFoundException([`No existen documentos`]);
        }
        return documentos;
    }

    async obtenerPorId(
        clavePrimaria: obtenerDocumentoPorIdDto,
    ): Promise<Documentos> {
        const documentos = await Documentos.findByPk(clavePrimaria.numero);
        if (!documentos) {
            throw new NotFoundException([`Documento no encontrado`]);
        }
        return documentos;
    }

    async actualizar(documento: ActualizarDocumentoDto): Promise<Documentos> {
        const documentoExistente = await Documentos.findByPk(documento.numero);
        const documentoExistenteNuevo = await Documentos.findOne({
            where: { nombre: documento.nuevo_nombre },
        });
        if (!documentoExistente) {
            throw new NotFoundException([
                `Documento n° ${documento.numero} no encontrado o no existe`,
            ]);
        }
        if (
            documentoExistenteNuevo &&
            documento.nombre === documento.nuevo_nombre
        ) {
            throw new ConflictException([
                `Ya existe un documento con el nombre "${documento.nuevo_nombre}"`,
            ]);
        }

        await Documentos.update(
            {
                nombre: documento.nuevo_nombre,
                direccion: documento.nueva_direccion,
                area_documento: documento.nueva_area_documento,
                fecha_inicio: documento.nueva_fecha_inicio,
                fecha_finalizacion: documento.nueva_fecha_finalizacion,
                validez_documento: documento.nueva_validez_documento,
            },
            {
                where: { numero: documento.numero },
            },
        );

        const documentoActualizado = await Documentos.findByPk(
            documento.numero,
        );

        return documentoActualizado;
    }
    async eliminar(clavePrimaria: EliminarDocumentoDto): Promise<Documentos> {
        const documento = await Documentos.findByPk(clavePrimaria.numero);

        if (!documento) {
            throw new NotFoundException([
                `No existe el documento n° ${clavePrimaria.numero}`,
            ]);
        }

        await Documentos.update(
            { validez_documento: VALIDEZ_DE_DOCUMENTO.OPCION_2 },
            { where: { numero: clavePrimaria.numero } },
        );

        const documentoEliminado = await Documentos.findByPk(
            clavePrimaria.numero,
        );

        return documentoEliminado;
    }

    /**
     * Genera un informe PDF basado en el contenido HTML y guarda la información en la base de datos
     * @param generarPdfDto Datos para la generación del PDF
     * @returns URL del archivo PDF generado y el documento creado
     */
    async generarPdf(
        generarPdfDto: GenerarPdfDto,
    ): Promise<{ filePath: string; fileName: string; documento?: Documentos }> {
        // Construir el HTML basado en el tipo de servicio y el contenido
        let htmlContent = '';

        switch (generarPdfDto.tipoServicio) {
            case 'EC':
                htmlContent = this.construirHtmlEC(generarPdfDto.contenido);
                break;
            case 'AA_MAQUINARIA':
                htmlContent = this.construirHtmlAAMaquinaria(
                    generarPdfDto.contenido,
                );
                break;
            case 'AA_ESTRUCTURAL':
                htmlContent = this.construirHtmlAAEstructural(
                    generarPdfDto.contenido,
                );
                break;
            default:
                htmlContent = this.construirHtmlGenerico(
                    generarPdfDto.contenido,
                );
                break;
        }

        // Aplicar estilos al HTML
        const htmlCompleto = this.pdfGeneratorService.applyDefaultStyles(
            htmlContent,
            generarPdfDto.titulo,
        );

        // Generar el PDF
        const pdfBuffer = await this.pdfGeneratorService.generatePdfFromHtml(
            htmlCompleto,
            {
                title: generarPdfDto.titulo,
                margin: {
                    top: '2cm',
                    right: '2cm',
                    bottom: '2.5cm',
                    left: '2cm',
                },
            },
        );

        // Crear o actualizar el documento en la base de datos
        let documento: Documentos | null = null;
        let customFileName: string;

        // Si tenemos datos suficientes, guardamos en la DB
        if (generarPdfDto.documentoData) {
            try {
                const {
                    nombre,
                    ejecutor,
                    cliente,
                    direccion,
                    area_documento,
                    fecha_inicio,
                    fecha_finalizacion,
                    empresa_rut,
                } = generarPdfDto.documentoData;

                // Si hay un documentoId, actualizamos el documento existente
                if (generarPdfDto.documentoId) {
                    documento = await Documentos.findByPk(
                        generarPdfDto.documentoId,
                    );
                    if (documento) {
                        documento.pdf_path = 'pendiente'; // Lo actualizaremos después
                        documento.contenido_json = JSON.stringify(
                            generarPdfDto.contenido,
                        );
                        documento.tipo_servicio = generarPdfDto.tipoServicio;
                        await documento.save();
                    }
                } else {
                    // Verificar que el valor de validez_documento existe en la tabla
                    const validezValida = await ValidezDocumentos.findByPk(
                        VALIDEZ_DE_DOCUMENTO.OPCION_3,
                    );
                    if (!validezValida) {
                        // Si no existe, crear el registro en la tabla validez_de_documentos
                        await ValidezDocumentos.create({
                            nombre: VALIDEZ_DE_DOCUMENTO.OPCION_3,
                            descripcion: 'Documento válido',
                        });
                        console.log(
                            `Creado valor de validez: ${VALIDEZ_DE_DOCUMENTO.OPCION_3}`,
                        );
                    }

                    // Sino, creamos uno nuevo
                    documento = await Documentos.create({
                        nombre: nombre || generarPdfDto.titulo,
                        ejecutor: ejecutor || 'CITEC UBB',
                        cliente: cliente || '',
                        direccion: direccion || '',
                        area_documento: area_documento || 'AA', // Valor predeterminado
                        fecha_inicio: fecha_inicio
                            ? new Date(fecha_inicio)
                            : new Date(),
                        fecha_finalizacion: fecha_finalizacion
                            ? new Date(fecha_finalizacion)
                            : new Date(),
                        validez_documento: VALIDEZ_DE_DOCUMENTO.OPCION_3, // Válido por defecto
                        pdf_path: 'pendiente', // Lo actualizaremos después
                        contenido_json: JSON.stringify(generarPdfDto.contenido),
                        tipo_servicio: generarPdfDto.tipoServicio,
                        empresa_rut: empresa_rut || null,
                    });
                }

                // Generar el nombre personalizado para el archivo PDF
                if (documento) {
                    // Obtener el número de informe
                    const numInforme = documento.numero?.toString() || 'SIN';

                    // Obtener el nombre del cliente (limpiar caracteres especiales y espacios)
                    const clienteNombre = (cliente || 'Cliente')
                        .replace(/[^a-zA-Z0-9]/g, '_')
                        .substring(0, 15);

                    // Obtener nombre corto del ensayo según el tipo de servicio
                    let tipoEnsayoCorto;
                    switch (generarPdfDto.tipoServicio) {
                        case 'AA_MAQUINARIA':
                            tipoEnsayoCorto = 'AA_MAQ';
                            break;
                        case 'AA_ESTRUCTURAL':
                            tipoEnsayoCorto = 'AA_EST';
                            break;
                        case 'EC':
                            tipoEnsayoCorto = 'EC';
                            break;
                        default:
                            tipoEnsayoCorto = 'DOC';
                    }

                    // Crear nombre del archivo con el formato solicitado
                    customFileName = `${numInforme}-${clienteNombre}-${tipoEnsayoCorto}.pdf`;

                    // Guardar la ruta del archivo en el documento
                    documento.pdf_path = customFileName;
                    await documento.save();
                }
            } catch (error) {
                console.error('Error al guardar el documento:', error);
                // No lanzamos excepción para permitir generar el PDF aunque falle el guardado en DB
            }
        }

        // Guardar el PDF temporalmente con el nombre personalizado si existe,
        // o con un nombre generado automáticamente si no
        const filePath = customFileName
            ? await this.pdfGeneratorService.savePdfToFile(
                  pdfBuffer,
                  customFileName,
              )
            : await this.pdfGeneratorService.savePdfToFile(pdfBuffer);

        const fileName = path.basename(filePath);

        return {
            filePath,
            fileName,
            documento,
        };
    }

    /**
     * Descarga un PDF ya generado
     * @param fileName Nombre del archivo a descargar
     * @returns Buffer del archivo
     */
    async obtenerPdf(fileName: string): Promise<Buffer> {
        const filePath = path.join(process.cwd(), 'uploads', 'temp', fileName);
        try {
            return await fs.promises.readFile(filePath);
        } catch (error) {
            throw new NotFoundException('El archivo PDF no fue encontrado');
        }
    }

    /**
     * Construye HTML para informes de Ensayo de Compresión
     */
    private construirHtmlEC(contenido: Record<string, string>): string {
        return `
      <div class="seccion">
        <h2>I. Antecedentes</h2>
        ${contenido.antecedentes || ''}
      </div>

      <div class="seccion">
        <h2>II. Identificación de la probeta a ensayar</h2>
        
        <h3>2.1 Materiales y características</h3>
        ${contenido.materiales_caracteristicas || ''}
        
        <h3>2.2 Fecha de ensayo</h3>
        ${contenido.fecha_ensayo_detalle || ''}
        
        <h3>2.3 Dimensiones</h3>
        ${contenido.dimensiones || ''}
      </div>

      <div class="seccion">
        <h2>III. Características del ensayo</h2>
        
        <h3>3.1 Normativa Utilizada</h3>
        ${contenido.normativa_utilizada || ''}
        
        <h3>3.2 Otros Datos</h3>
        ${contenido.otros_datos || ''}
        
        <h3>3.3 Aplicación de la carga y medición</h3>
        ${contenido.aplicacion_carga || ''}
      </div>

      <div class="seccion">
        <h2>IV. Resultados</h2>
        ${contenido.resultados || ''}
      </div>

      <div class="seccion">
        <h2>V. Modos de falla</h2>
        ${contenido.modos_falla || ''}
      </div>

      <div class="seccion">
        <h2>VI. Conclusiones</h2>
        ${contenido.conclusiones || ''}
      </div>

      <div class="seccion">
        <h2>VII. Observaciones</h2>
        ${contenido.observaciones || ''}
      </div>
    `;
    }

    /**
     * Construye HTML para informes de Análisis Acústico - Maquinaria
     */
    private construirHtmlAAMaquinaria(
        contenido: Record<string, string>,
    ): string {
        return `
      <div class="seccion">
        <h2>I. Antecedentes</h2>
        ${contenido.antecedentes || ''}
      </div>
      
      <div class="seccion">
        <h2>II. Objetivo del ensayo</h2>
        ${contenido.objetivo_ensayo || ''}
      </div>
      
      <div class="seccion">
        <h2>III. Identificación del producto sometido a ensayo</h2>
        ${contenido.identificacion_producto || ''}
      </div>
      
      <div class="seccion">
        <h2>IV. Procedencia del producto</h2>
        ${contenido.procedencia_producto || ''}
      </div>
      
      <div class="seccion">
        <h2>V. Norma aplicada</h2>
        ${contenido.norma_aplicada || ''}
      </div>
      
      <div class="seccion">
        <h2>VI. Metodología de ensayo</h2>
        ${contenido.metodologia_ensayo || ''}
      </div>
      
      <div class="seccion">
        <h2>VII. Condiciones de ensayo</h2>
        ${contenido.condiciones_ensayo || ''}
      </div>
      
      <div class="seccion">
        <h2>VIII. Fecha de ensayo</h2>
        ${contenido.fecha_ensayo || ''}
      </div>
      
      <div class="seccion">
        <h2>IX. Operador, equipamiento experimental y materiales de laboratorio</h2>
        ${contenido.operador_equipamiento || ''}
      </div>
      
      <div class="seccion">
        <h2>X. Resultados</h2>
        ${contenido.resultados || ''}
      </div>
      
      <div class="seccion">
        <h2>XI. Comentarios</h2>
        ${contenido.comentarios || ''}
      </div>
      
      <div class="seccion">
        <h2>XII. Observaciones</h2>
        ${contenido.observaciones || ''}
      </div>
    `;
    }

    /**
     * Construye HTML para informes de Análisis Acústico - Estructural
     */
    private construirHtmlAAEstructural(
        contenido: Record<string, string>,
    ): string {
        return `
      <div class="seccion">
        <h2>I. Antecedentes</h2>
        ${contenido.antecedentes || ''}
      </div>
      
      <div class="seccion">
        <h2>II. Objetivo del ensayo</h2>
        ${contenido.objetivo_ensayo || ''}
      </div>
      
      <div class="seccion">
        <h2>III. Identificación del producto sometido a ensayo</h2>
        ${contenido.identificacion_producto || ''}
      </div>
      
      <div class="seccion">
        <h2>IV. Métodos y equipos</h2>
        ${contenido.metodos_equipos || ''}
      </div>
      
      <div class="seccion">
        <h2>V. Condiciones de ensayo</h2>
        ${contenido.condiciones_ensayo || ''}
      </div>
      
      <div class="seccion">
        <h2>VI. Definiciones</h2>
        ${contenido.definiciones || ''}
      </div>
      
      <div class="seccion">
        <h2>VII. Resultados</h2>
        ${contenido.resultados || ''}
      </div>
      
      <div class="seccion">
        <h2>VIII. Conclusiones y observaciones</h2>
        ${contenido.conclusiones || ''}
      </div>
      
      <div class="seccion">
        <h2>IX. Elementos de verificación</h2>
        ${contenido.elementos_verificacion || ''}
      </div>
      
      <div class="seccion">
        <h2>X. Observaciones</h2>
        ${contenido.observaciones || ''}
      </div>
    `;
    }

    /**
     * Construye HTML para informes genéricos
     */
    private construirHtmlGenerico(contenido: Record<string, string>): string {
        let html = '';

        // Generar HTML dinámicamente basado en las claves disponibles en el contenido
        for (const [clave, valor] of Object.entries(contenido)) {
            if (valor) {
                // Convertir clave a título más legible
                const titulo = clave
                    .split('_')
                    .map(
                        (palabra) =>
                            palabra.charAt(0).toUpperCase() + palabra.slice(1),
                    )
                    .join(' ');

                html += `
          <div class="seccion">
            <h2>${titulo}</h2>
            ${valor}
          </div>
        `;
            }
        }

        return html;
    }
}
