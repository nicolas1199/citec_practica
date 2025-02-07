import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
    return {
        database: {
            url: process.env.DATABASE_URL,
        },
        jwt: {
            secret: process.env.JWT_SECRET,
        },
        desarrollador: {
            contraseña: process.env.DESARROLLADOR_PASS,
        },
        node: {
            env: process.env.NODE_ENV,
        },
    };
});
