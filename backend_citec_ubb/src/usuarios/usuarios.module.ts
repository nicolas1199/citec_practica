import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsuariosController } from './controllers/usuarios.controller';
import { UsuariosService } from './services/usuarios.service';

import { EncriptarContraseñaMiddleware } from '../common/middlewares/encriptar-contraseña.middleware';

@Module({
    imports: [],
    controllers: [UsuariosController],
    providers: [UsuariosService],
})
export class UsuariosModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(EncriptarContraseñaMiddleware)
            .forRoutes('/usuarios/crear', '/usuarios/actualizar');
    }
}
//
