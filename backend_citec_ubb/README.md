# Backend CITEC UBB 🖥️

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">Un solido framework de <a href="http://nodejs.org" target="_blank">Node.js</a> para construir eficientes y escalables aplicaciones del lado del servidor.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->


## Descripcion del proyecto ⚙️

Las tecnologias usadas son:

- [NestJS](https://nestjs.com)
- [TypeScript](https://www.typescriptlang.org)
- [Node Js](http://nodejs.org)
- [Swagger](https://docs.nestjs.com/openapi/introduction)
- [Sequelize ORM](https://docs.nestjs.com/recipes/sql-sequelize)

### Error de logs ⚠️
- Si ocurre algun error relacionado a los logs o registros, se debe crear la carpeta logs, vacia y en la raiz del proyecto (mismo nivel src).

### Inicializar el Proyecto ⌨️

```bash
$ npm install
```

### Compilar y correr el proyecto

```bash
# Desarrollo
$ npm run start

# El mas usado. El que deben usar para desarrollo
$ npm run start:dev

# Para produccion
$ npm run start:prod
```

### Correr Los Test

```bash
# Test unitarios
$ npm run test

# Test end to end (punto a punto)
$ npm run test:e2e

# Test de cobertura
$ npm run test:cov
```

### Comandos basicos de nest

[Documentacion cli de NestJS](https://docs.nestjs.com/cli/usages)

- "--skip-git" Se salta git al momento de crear un proyecto

- "--flat" Para que no cree una carpeta adicional solo la que indicamos 

- "--no-spec" Para no crear los test

```bash
# Crear proyecto (Si el proyecto ya esta creado no es necesario)
$ nest new . --skip-git

# Crear controladores
$ nest g co nombre_del_controlador carpeta/subcarpeta --flat --no-spec

# Crear servicios
$ nest g s nombre_del_servicio carpeta/subcarpeta --flat --no-spec

# Crear modulos 
$ nest g mo nombre_del_modulo carpeta/subcarpeta --flat --no-spec
```

### Contacto 💼

- Autores - [Cesar Salazar](https://github.com/cezartdev) y [Joaquín Ávila](https://github.com/JoaquinIAD)
- Correos - cesar.salazar2201@alumnos.ubiobio.cl y joaquin.avila2201@alumnos.ubiobio.cl

