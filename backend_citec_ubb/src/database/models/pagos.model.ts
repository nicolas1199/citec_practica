import { ApiProperty } from '@nestjs/swagger';
import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    CreatedAt,
    UpdatedAt,
    AutoIncrement,
    HasMany,
    BelongsToMany,
} from 'sequelize-typescript';

import { TIPOS_DE_PAGO } from '../../common/constants/tipos-de-pagos.constants';
import { OrdenesDeTrabajos } from './ordenes-de-trabajos.model';
import { OrdenesDeTrabajosPagos } from './ordenes_de_trabajo_pagos.model';

@Table({
    tableName: 'pagos',
    timestamps: true,
    indexes: [
        {
            fields: ['numero', 'tipo'],
            unique: true,
        },
    ],
})
export class Pagos extends Model<Pagos> {
    @ApiProperty({ type: 'number', default: 1 })
    @AutoIncrement
    @PrimaryKey
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare id: number;

    @ApiProperty({ type: 'number', default: 1 })
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare numero: number;

    @ApiProperty({ type: 'string', default: 'Estanqueidad al aire - NCH 892' })
    @Column({
        type: DataType.ENUM(
            TIPOS_DE_PAGO.OPCION_1,
            TIPOS_DE_PAGO.OPCION_2,
            TIPOS_DE_PAGO.OPCION_3,
        ),
        allowNull: false,
    })
    declare tipo: string;

    @ApiProperty({ type: 'string', default: '1_comprobante.pdf' })
    @Column({
        type: DataType.STRING(200),
        allowNull: false,
        unique: true,
    })
    declare imagen: string;

    @BelongsToMany(() => OrdenesDeTrabajos, () => OrdenesDeTrabajosPagos)
    declare ordenes_de_trabajo: OrdenesDeTrabajos[];

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

export default Pagos;
