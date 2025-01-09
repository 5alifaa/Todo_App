<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

## Top Level Structure
Here’s a clear **file architecture** to follow for your **NestJS** project, ensuring modularity, scalability, and maintainability.

---

## **Top-Level Structure**
```
src/
├── modules/                # Feature-based modules
│   ├── auth/               # Authentication module
│   ├── users/              # User management module
│   ├── tasks/              # Task management module
│   ├── tags/               # Tag management module
│   └── prisma/             # Prisma integration
├── common/                 # Shared utilities and functionality
│   ├── decorators/         # Custom decorators
│   ├── pipes/              # Custom pipes for validation/transformation
│   ├── filters/            # Global exception filters
│   └── interceptors/       # Response interceptors
├── config/                 # Application configuration
│   ├── config.module.ts
│   ├── config.service.ts
│   └── constants.ts
├── app.module.ts           # Root module
├── main.ts                 # Application entry point
└── environment/            # Environment-specific configuration (optional)
    ├── development.env
    ├── production.env
```

---

## **Detailed Breakdown**

### **1. Modules**
Each feature (e.g., auth, tasks, tags) is encapsulated in its own module. This makes the application modular and scalable.

#### Example: **Tasks Module**
```
src/modules/tasks/
├── tasks.controller.ts     # Handles HTTP routes for tasks
├── tasks.service.ts        # Business logic for tasks
├── tasks.module.ts         # Module setup for tasks
├── dto/                    # Data Transfer Objects for validation
│   ├── create-task.dto.ts
│   └── update-task.dto.ts
└── entities/               # Task entity or model
    └── task.entity.ts
```

---

### **2. Common**
The `common` directory contains reusable utilities used across multiple modules.

#### Example: **Common Directory**
```
src/common/
├── decorators/
│   ├── get-user.decorator.ts  # Custom decorator to extract user from request
├── pipes/
│   ├── validation.pipe.ts     # Global validation logic for DTOs
├── filters/
│   ├── http-exception.filter.ts # Global exception handling
└── interceptors/
    ├── transform.interceptor.ts # Modifies API response structures
```

---

### **3. Prisma**
The Prisma module is responsible for database interactions.

#### Example: **Prisma Module**
```
src/modules/prisma/
├── prisma.module.ts         # Exports Prisma service for DI
├── prisma.service.ts        # Configures PrismaClient for database access
├── schema.prisma            # Prisma schema file
```

---

### **4. Config**
Centralized configuration for environment variables and constants.

#### Example: **Config Directory**
```
src/config/
├── config.module.ts         # Module to handle app configuration
├── config.service.ts        # Service to access configuration values
└── constants.ts             # Constants like JWT secrets and token expiry
```

---

### **5. Environment**
Stores environment-specific configurations.

#### Example: **Environment Directory**
```
src/environment/
├── development.env
├── production.env
```

---

## **File-Level Overview**

### **Core Files**
1. **`main.ts`**:
   - Application entry point where the server is initialized.
   ```typescript
   import { NestFactory } from '@nestjs/core';
   import { AppModule } from './app.module';

   async function bootstrap() {
     const app = await NestFactory.create(AppModule);
     app.enableCors(); // Enable CORS
     await app.listen(3000);
   }
   bootstrap();
   ```

2. **`app.module.ts`**:
   - Root module that imports other feature modules.
   ```typescript
   import { Module } from '@nestjs/common';
   import { AuthModule } from './modules/auth/auth.module';
   import { UsersModule } from './modules/users/users.module';
   import { TasksModule } from './modules/tasks/tasks.module';
   import { TagsModule } from './modules/tags/tags.module';

   @Module({
     imports: [AuthModule, UsersModule, TasksModule, TagsModule],
   })
   export class AppModule {}
   ```

---

## **How to Start**

1. **Set Up the Project**
   - Create a new NestJS project:
     ```bash
     nest new todo-app
     ```

2. **Add Modules**
   - Generate feature modules using the CLI:
     ```bash
     nest g module modules/auth
     nest g module modules/users
     nest g module modules/tasks
     nest g module modules/tags
     ```

3. **Add Services and Controllers**
   - Use the CLI to generate services and controllers:
     ```bash
     nest g service modules/auth
     nest g controller modules/auth
     ```

4. **Add Prisma**
   - Install Prisma:
     ```bash
     npm install @prisma/client
     npm install -D prisma
     ```
   - Initialize Prisma:
     ```bash
     npx prisma init
     ```

5. **Add Shared Utilities**
   - Create common utilities like custom decorators, pipes, and filters in the `common` folder.

---

This structure will help you stay organized as your project grows. Let me know if you need help setting up any specific part! 🚀