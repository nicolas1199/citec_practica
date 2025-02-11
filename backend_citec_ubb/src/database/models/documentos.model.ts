import { ApiProperty } from "@nestjs/swagger";
import { AutoIncrement, BelongsTo, Column, CreatedAt, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { TiposDocumentos } from "./tipo-documento.model";
import { TIPOS_DE_DOCUMENTO } from "src/common/constants/tipos-documentos.constants";


@Table({
    tableName: 'Documentos',
    timestamps: true,
})

export class Documentos extends Model<Documentos> {

    @ApiProperty({ type: 'number', default: 1 })
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare numero: number;

    @ApiProperty({ type: 'string', default: 'INFORME' })
    @Column({
        type: DataType.STRING(50),
        allowNull: false,
    })
    declare nombre: string;

    @ApiProperty({ type: 'string', default: 'CITEC UBB' })
    @Column({
        type: DataType.STRING(50),
        allowNull: false,
    })
    declare ejecutor: string;
    
    @ApiProperty({type: 'string', default: 'S.A.'})
    @Column({
        type: DataType.STRING(100),
        allowNull: false
    })
    declare cliente: string

    @ApiProperty({type: 'string', default: '...'})
    @Column({
        type: DataType.STRING(100),
        allowNull: false
    })
    declare direccion: string

    @ApiProperty({ type: 'string', default: TIPOS_DE_DOCUMENTO.OPCION_1 })
    @ForeignKey(()=> TiposDocumentos)
    @Column({
        type: DataType.ENUM(...Object.values(TIPOS_DE_DOCUMENTO)),
        allowNull: false,
    })
    declare tipo_documento: string;

    @BelongsTo(()=> TiposDocumentos)
    declare tipo: string


    @ApiProperty({
        type:'string',
        format:'date',
        default: '2025-12-31 12:00:00'})
    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    declare fecha_inicio: Date;

    @ApiProperty({
        type:'string',
        format:'date',
        default: '2025-12-31 12:00:00'})
    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    declare fecha_finalizacion: Date;

    @ApiProperty()
    @CreatedAt
    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    declare fecha_emision: Date;

}
export default Documentos