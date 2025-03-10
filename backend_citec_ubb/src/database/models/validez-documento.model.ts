import { ApiProperty } from '@nestjs/swagger';
import {
    Column,
    DataType,
    HasMany,
    Model,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';
import { VALIDEZ_DE_DOCUMENTO } from 'src/common/constants/validez-de-documento.constants';
import Documentos from './documentos.model';

@Table({
    tableName: 'validez_de_documentos',
    timestamps: true,
})
export class ValidezDocumentos extends Model<ValidezDocumentos> {
    @ApiProperty({ type: 'string', default: VALIDEZ_DE_DOCUMENTO.OPCION_3 })
    @PrimaryKey
    @Column({
        type: DataType.ENUM(...Object.values(VALIDEZ_DE_DOCUMENTO)),
        allowNull: false,
    })
    declare nombre: string;

    @ApiProperty({ type: 'string', default: 'Validez del documento' })
    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    declare descripcion: string;

    @HasMany(() => Documentos)
    declare documentos: Documentos[];
}

export default ValidezDocumentos;
