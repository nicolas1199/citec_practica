import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";
import { AREAS_DE_DOCUMENTO } from "src/common/constants/area-documentos.constants";


@Table({
    tableName: 'area_de_documentos',
    timestamps: true,
})

export class AreasDocumentos extends Model<AreasDocumentos> {

    @ApiProperty({ type: 'string', default: AREAS_DE_DOCUMENTO.OPCION_1 })
    @PrimaryKey
    @Column({
        type: DataType.ENUM(...Object.values(AREAS_DE_DOCUMENTO)),
        allowNull: false
    })
    declare cod_area: string
}
export default AreasDocumentos;