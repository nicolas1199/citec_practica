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
    HasMany,
} from 'sequelize-typescript';

import { ApiProperty } from '@nestjs/swagger';
import { Regiones } from './regiones.model';
import { Comunas } from './comunas.model';

@Table({
    tableName: 'provincias',
    timestamps: true,
})
export class Provincias extends Model<Provincias> {
    @ApiProperty({ type: 'number', default: 1101 })
    @PrimaryKey
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare id: number;

    @ApiProperty({ type: 'string', default: 'CONCEPCIÓN' })
    @Column({
        type: DataType.STRING(30),
        allowNull: false,
    })
    declare nombre: string;

    @ApiProperty({ type: 'number', default: 1 })
    @ForeignKey(() => Regiones)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare id_regiones: number;

    @BelongsTo(() => Regiones)
    declare region: Regiones;

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

    @HasMany(() => Comunas)
    declare comuna: Comunas[];
}

export default Provincias;
