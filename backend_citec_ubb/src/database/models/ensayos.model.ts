import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
    CreatedAt,
    UpdatedAt,
    BeforeCreate,
} from 'sequelize-typescript';

import { ApiProperty } from '@nestjs/swagger';
import { Transaction } from 'sequelize';

@Table({
    tableName: 'ensayos',
    timestamps: true,
})
export class Ensayos extends Model<Ensayos> {
    @ApiProperty({ type: 'number', default: 1 })
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare id: number;

    @ApiProperty({ type: 'string' })
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare nombre_ensayo: string;  // ✅ Agregado al modelo

    @ApiProperty({ type: 'number' })
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare tipo_servicio_id: number;  // ✅ Agregado al modelo

    @ApiProperty({ type: 'number', default: 2024 })
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare año: number;

    @ApiProperty({ type: 'string', format: 'date' })
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

    @BeforeCreate
    static async asignarID(instance: Ensayos, options: any) {
        const añoActual = instance.año;
        await Ensayos.sequelize?.transaction(
            async (t: Transaction) => {
                const ultimoId = ((await Ensayos.max('id', {
                    where: { año: añoActual },
                    transaction: t,
                })) || 0) as number;
                instance.id = ultimoId + 1;
            },
        );
    }
}

export default Ensayos;
