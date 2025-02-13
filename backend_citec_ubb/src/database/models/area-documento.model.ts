import { ApiProperty } from "@nestjs/swagger";
import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";


@Table({
    tableName: 'Area de Documentos',
    timestamps: true,
})

export class AreasDocumentos extends Model<AreasDocumentos> {

    @ApiProperty({ type: 'integer', default: '1' })
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare num_area: number

    @ApiProperty({ type: 'string', default: 'AA' })
    @Column({
        type: DataType.STRING(50),
        allowNull: false
    })
    declare cod_area: string
}
export default AreasDocumentos;