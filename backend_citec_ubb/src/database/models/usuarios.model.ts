import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    BelongsTo,
    ForeignKey,
    CreatedAt,
    UpdatedAt,
} from 'sequelize-typescript';

import { Tipos } from './tipos.model';
import { ESTADOS } from '../../common/constants/estados.constants';

import { ApiProperty } from '@nestjs/swagger';
import { TIPOS_DE_USUARIO } from '../../common/constants/tipos-usuarios.constants';

@Table({
    tableName: 'usuarios',
    timestamps: true,
})
export class Usuarios extends Model<Usuarios> {
    @ApiProperty({ type: 'string', format: 'email' })
    @PrimaryKey
    @Column({
        type: DataType.STRING(70),
        allowNull: false,
    })
    declare email: string;

    @ApiProperty({ type: 'string', default: 'Juan' })
    @Column({
        type: DataType.STRING(50),
        allowNull: false,
    })
    declare nombre: string;

    @ApiProperty({ type: 'string', default: 'Perez' })
    @Column({
        type: DataType.STRING(50),
        allowNull: false,
    })
    declare apellido: string;

    @ApiProperty({
        type: 'string',
        format: 'password',
        default: '$_i;3%z2hpNJM!C4X',
    })
    @Column({
        type: DataType.STRING(250),
        allowNull: false,
    })
    declare contraseña: string;

    @ApiProperty({ type: 'string', default: ESTADOS.OPCION_1 })
    @Column({
        type: DataType.ENUM(ESTADOS.OPCION_1, ESTADOS.OPCION_2),
        allowNull: false,
        defaultValue: ESTADOS.OPCION_1,
    })
    declare estado: string;

    @ApiProperty({ type: 'string', default: TIPOS_DE_USUARIO.OPCION_1 })
    @ForeignKey(() => Tipos)
    @Column({
        type: DataType.ENUM(...Object.values(TIPOS_DE_USUARIO)),
        allowNull: false,
    })
    declare nombre_tipos: string;

    @BelongsTo(() => Tipos)
    declare tipo: Tipos; // Relación uno a uno

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

export default Usuarios;
