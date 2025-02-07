import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    HasOne,
    CreatedAt,
    UpdatedAt,
} from 'sequelize-typescript';

import { Usuarios } from './usuarios.model';
import { TIPOS_DE_USUARIO } from '../../common/constants/tipos-usuarios.constants';

import { ApiProperty } from '@nestjs/swagger';

@Table({
    tableName: 'tipos',
    timestamps: true,
})
export class Tipos extends Model<Tipos> {
    @ApiProperty({ type: 'string', default: TIPOS_DE_USUARIO.OPCION_1 })
    @PrimaryKey
    @Column({
        type: DataType.ENUM(...Object.values(TIPOS_DE_USUARIO)),
        allowNull: false,
    })
    declare nombre: string;

    @HasOne(() => Usuarios)
    declare usuario: Usuarios; // Relación uno a uno

    @ApiProperty()
    @CreatedAt
    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    declare createdAt: Date;

    @ApiProperty()
    @UpdatedAt
    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    declare updatedAt: Date;
}

export default Tipos;
