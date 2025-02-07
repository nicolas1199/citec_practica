import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    CreatedAt,
    UpdatedAt,
    AutoIncrement,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

@Table({
    tableName: 'logs',
    timestamps: true,
})
export class Logs extends Model<Logs> {
    @ApiProperty({ type: 'number', default: 1 })
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare codigo: number;

    @ApiProperty({ type: 'string', default: '127.0.0.1' })
    @Column({
        type: DataType.STRING(20),
        allowNull: false,
    })
    declare ip: string;

    @ApiProperty({ type: 'string', default: '/api/usuarios/crear' })
    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    declare ruta: string;

    @ApiProperty({
        type: 'string',
        format: 'date',
        default: '2024-12-31 12:00:00',
    })
    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    declare fecha: Date;

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

export default Logs;
