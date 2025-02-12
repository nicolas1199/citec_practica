import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';

import { ApiProperty } from '@nestjs/swagger';
import { Empresas } from './empresas.model';

@Table({
    tableName: 'encargados_empresas',
    timestamps: true,
})
export class EncargadosEmpresas extends Model<EncargadosEmpresas> {
    @ApiProperty({ type: 'number', default: '1' })
    @PrimaryKey
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: true,
    })
    declare id: number;

    @ApiProperty({ type: 'string', default: 'Juan Perez' })
    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    declare nombre: string;

    @ApiProperty({ type: 'string', default: '11.111.111-1' })
    @ForeignKey(() => Empresas)
    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    declare rutEmpresa: string;

    @BelongsTo(() => Empresas)
    declare empresa: Empresas;
}

export default EncargadosEmpresas;
