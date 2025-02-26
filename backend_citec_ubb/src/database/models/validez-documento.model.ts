import { ApiProperty } from "@nestjs/swagger";
import { Column, CreatedAt, DataType, HasOne, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";
import { VALIDEZ_DE_DOCUMENTO } from "src/common/constants/validez-de-documento.constants";
import DocumentosModel from "./documentos.model";


@Table({
    tableName: 'validez_de_documentos',
    timestamps: true,
})

export class ValidezDocumentos extends Model<ValidezDocumentos> {

    @ApiProperty({ type: 'string', default: VALIDEZ_DE_DOCUMENTO.OPCION_3 })
    @PrimaryKey
    @Column({
        type: DataType.ENUM(...Object.values(VALIDEZ_DE_DOCUMENTO)),
        allowNull: false
    })
    declare nombre_v: string;

    @HasOne(() => DocumentosModel)
    declare documento: DocumentosModel;

}
export default ValidezDocumentos;