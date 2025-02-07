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
    Sequelize,
} from 'sequelize-typescript';

import { ApiProperty } from '@nestjs/swagger';

import { Empresas } from './empresas.model';

@Table({
    tableName: 'contactos',
    timestamps: true,
})
export class Contactos extends Model<Contactos> {
    @ApiProperty({ type: 'string', default: 'correo@gmail.com' })
    @PrimaryKey
    @Column({
        type: DataType.STRING(70),
        allowNull: false,
    })
    declare email: string;

    @ApiProperty({ type: 'string', default: 'Juan Perez' })
    @Column({
        type: DataType.STRING(50),
        allowNull: false,
    })
    declare nombre: string;

    @ApiProperty({ type: 'string', default: 'Gerente de ventas' })
    @Column({
        type: DataType.STRING(50),
        allowNull: false,
    })
    declare cargo: string;

    @ApiProperty({ type: 'string', format: '11.111.111-1' })
    @ForeignKey(() => Empresas)
    @Column({
        type: DataType.STRING(15),
        allowNull: false,
    })
    declare rut_empresas: string;

    @BelongsTo(() => Empresas)
    declare empresa: Empresas;

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

export default Contactos;
