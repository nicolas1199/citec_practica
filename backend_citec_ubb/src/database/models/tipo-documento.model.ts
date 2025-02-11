import { ApiProperty } from "@nestjs/swagger";
import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";


@Table({
    tableName: 'Tipos de Documentos',
    timestamps: true,
})

export class TiposDocumentos extends Model<TiposDocumentos>{

    @ApiProperty({type:'integer',default:'1'})
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare num_tipo: number

    @ApiProperty({type:'string',default:'AA'})
    @Column({
        type:DataType.STRING(50),
        allowNull: false
    })
    declare nombre_tipo: string
}