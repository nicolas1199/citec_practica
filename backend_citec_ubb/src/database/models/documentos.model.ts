import { ApiProperty } from '@nestjs/swagger';
import {
    AutoIncrement,
    BelongsTo,
    Column,
    CreatedAt,
    DataType,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
    UpdatedAt,
} from 'sequelize-typescript';
import { AreasDocumentos } from './area-documento.model';
import { AREAS_DE_DOCUMENTO } from 'src/common/constants/area-documentos.constants';
import ValidezDocumentos from './validez-documento.model';
import { VALIDEZ_DE_DOCUMENTO } from 'src/common/constants/validez-de-documento.constants';

@Table({
    tableName: 'documentos',
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
        type: DataType.STRING(255),
        allowNull: false,
    })
    declare nombre: string;

    @ApiProperty({ type: 'string', default: 'CITEC UBB' })
    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    declare ejecutor: string;

    @ApiProperty({ type: 'string', default: 'S.A.' })
    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    declare cliente: string;

    @ApiProperty({ type: 'string', default: 'Chile' })
    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    declare direccion: string;

    @ApiProperty({ type: 'string', default: AREAS_DE_DOCUMENTO.OPCION_1 })
    @ForeignKey(() => AreasDocumentos)
    @Column({
        type: DataType.ENUM(...Object.values(AREAS_DE_DOCUMENTO)),
        allowNull: false,
    })
    declare area_documento: string;

    @BelongsTo(() => AreasDocumentos)
    declare area: AreasDocumentos;

    @ApiProperty({ type: 'string', default: '1/1/2025' })
    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    declare fecha_inicio: Date;

    @ApiProperty({ type: 'string', default: '1/1/2025' })
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

    @ApiProperty()
    @UpdatedAt
    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    declare updatedAt: Date;

    @ApiProperty({ type: 'string', default: VALIDEZ_DE_DOCUMENTO.OPCION_3 })
    @ForeignKey(() => ValidezDocumentos)
    @Column({
        type: DataType.ENUM(...Object.values(VALIDEZ_DE_DOCUMENTO)),
        allowNull: false,
    })
    declare validez_documento: string;

    @BelongsTo(() => ValidezDocumentos)
    declare validez: ValidezDocumentos;

    @ApiProperty({ type: 'string', nullable: true })
    @Column({
        type: DataType.STRING(255),
        allowNull: true,
    })
    declare pdf_path: string;

    @ApiProperty({ type: 'string', nullable: true })
    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    declare contenido_json: string;

    @ApiProperty({ type: 'string', nullable: true })
    @Column({
        type: DataType.STRING(50),
        allowNull: true,
    })
    declare tipo_servicio: string;

    @ApiProperty({ type: 'string', nullable: true })
    @Column({
        type: DataType.STRING(255),
        allowNull: true,
    })
    declare empresa_rut: string;
}
export default Documentos;
