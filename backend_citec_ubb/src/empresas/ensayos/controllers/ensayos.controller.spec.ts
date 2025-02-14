import { Test, TestingModule } from '@nestjs/testing';
import { EnsayosController } from './ensayos.controller';
import { EnsayosService } from '../services/ensayos.service';
import {
    CrearEnsayoDto,
    ActualizarEnsayoDto,
    ObtenerPorIdEnsayoDto,
    EliminarEnsayoDto,
    RetornoEnsayo,
} from '../dtos/ensayos.dto';

describe('EnsayosController', () => {
    let controller: EnsayosController;
    let service: EnsayosService;

    const mockEnsayo: RetornoEnsayo = {
        id: 1,
        nombre_ensayo: 'Ensayo de prueba',
        tipo_servicio_id: 2,
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [EnsayosController],
            providers: [
                {
                    provide: EnsayosService,
                    useValue: {
                        crear: jest.fn().mockResolvedValue(mockEnsayo),
                        actualizar: jest.fn().mockResolvedValue(mockEnsayo),
                        eliminar: jest.fn().mockResolvedValue(mockEnsayo),
                        obtenerTodos: jest.fn().mockResolvedValue([mockEnsayo]),
                        obtenerPorId: jest.fn().mockResolvedValue(mockEnsayo),
                    },
                },
            ],
        }).compile();

        controller = module.get<EnsayosController>(EnsayosController);
        service = module.get<EnsayosService>(EnsayosService);
    });

    it('debería estar definido', () => {
        expect(controller).toBeDefined();
    });

    it('debería crear un ensayo', async () => {
        const dto: CrearEnsayoDto = {
            nombre_ensayo: 'Ensayo de prueba',
            tipo_servicio_id: 2,
        };
        await expect(controller.crear(dto)).resolves.toEqual(mockEnsayo);
    });

    it('debería actualizar un ensayo', async () => {
        const dto: ActualizarEnsayoDto = { id: 1, nombre_ensayo: 'Nuevo Nombre', tipo_servicio_id: 2 };
        await expect(controller.actualizar(dto)).resolves.toEqual(mockEnsayo);
    });

    it('debería eliminar un ensayo', async () => {
        const id = 1;  // Solo el id
        await expect(controller.eliminar(id)).resolves.toEqual(mockEnsayo);
    });

    it('debería obtener todos los ensayos', async () => {
        await expect(controller.obtenerTodos()).resolves.toEqual([mockEnsayo]);
    });

    it('debería obtener un ensayo por ID', async () => {
        const dto: ObtenerPorIdEnsayoDto = { id: 1 };
        await expect(controller.obtenerPorId(dto)).resolves.toEqual(mockEnsayo);
    });
});

