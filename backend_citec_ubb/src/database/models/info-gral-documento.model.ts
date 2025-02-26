import { ApiProperty } from "@nestjs/swagger";
import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table, UpdatedAt, CreatedAt } from "sequelize-typescript";
import { AreasDocumentosModel } from "./area-documento.model";
import { AREAS_DE_DOCUMENTO } from "src/common/constants/area-documentos.constants";
import ValidezDocumentos from "./validez-documento.model";
import { VALIDEZ_DE_DOCUMENTO } from "src/common/constants/validez-de-documento.constants";
import Empresas from "./empresas.model";
import DocumentosModel from "./documentos.model";


@Table({
    tableName: 'info_gral_de_documentos',
    timestamps: true,
})

export class InfoGralDocumentosModel extends Model<InfoGralDocumentosModel> {

    @ApiProperty({ type: 'number', default: 1 })
    @PrimaryKey
    @ForeignKey(() => DocumentosModel)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare numero: number

    @BelongsTo(() => DocumentosModel)
    declare num_doc: DocumentosModel

    @ApiProperty({ type: 'string', default: 'INFORME' })
    @Column({
        type: DataType.STRING(50),
        allowNull: false,
    })
    declare nombre: string;

    @BelongsTo(() => DocumentosModel)
    declare nom_doc: DocumentosModel

    @ApiProperty({ type: 'string', default: '11.111.111-1' })
    @ForeignKey(() => Empresas)
    @Column({
        type: DataType.STRING(15),
        allowNull: false
    })
    declare rut_cliente: string;

    @BelongsTo(() => Empresas)
    declare empresa_cliente: Empresas

    @ApiProperty({ type: 'string', default: AREAS_DE_DOCUMENTO.OPCION_1 })
    @ForeignKey(() => AreasDocumentosModel)
    @Column({
        type: DataType.ENUM(...Object.values(AREAS_DE_DOCUMENTO)),
        allowNull: false,
    })
    declare area: string;

    @BelongsTo(() => AreasDocumentosModel)
    declare area_documento: AreasDocumentosModel;

    @ApiProperty({ type: 'string', default: VALIDEZ_DE_DOCUMENTO.OPCION_3 })
    @ForeignKey(() => ValidezDocumentos)
    @Column({
        type: DataType.ENUM(...Object.values(VALIDEZ_DE_DOCUMENTO)),
        allowNull: false,
    })
    declare validez: string;

    @BelongsTo(() => ValidezDocumentos)
    declare validez_documento: ValidezDocumentos;


}
export default InfoGralDocumentosModel