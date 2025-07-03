<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# 📘 Documentação Técnica do Back-end (NestJS)

## 📑 Table of Contents

1. Introdução Geral
2. Estrutura do Projeto
3. Inicialização e Configuração
4. Módulo Principal (App)
5. Módulo de Usuários
   - DTOs
   - Controller
   - Service
   - Module
6. Módulo de Autenticação
   - Controller
   - Service
   - Guards
   - Strategies
7. Observações Gerais

---

## 1️⃣ Introdução Geral

Este projeto é o back-end de um aplicativo mobile de gerenciamento de tarefas, desenvolvido com:

- **NestJS** (framework Node.js)
- **PostgreSQL** para persistência
- **JWT** para autenticação

---

## 2️⃣ Estrutura do Projeto

```
src/
├── app.controller.ts
├── app.module.ts
├── app.service.ts
├── main.ts
├── users/
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── users.module.ts
│   └── dto/
│       ├── create-user.dto.ts
│       ├── login-user.dto.ts
│       └── update-user.dto.ts
├── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── jwt-auth.guard.ts
│   ├── jwt.strategy.ts
│   └── local.strategy.ts
```

---

## 3️⃣ Inicialização e Configuração

1. **Instalar dependências**

   ```bash
   npm install
   ```

2. \*\*Criar arquivo \*\*\`\`

   ```env
   DATABASE_URL=postgres://<usuario>:<senha>@localhost:5432/<nome_database>
   JWT_SECRET=sua_chave_secreta
   ```

3. **Rodar migrations (se usar TypeORM)**

   ```bash
   npm run typeorm migration:run
   ```

4. **Iniciar servidor**

   ```bash
   npm run start:dev
   ```

5. **Rodar testes**

   ```bash
   npm run test
   ```

---

## 4️⃣ Módulo Principal (App)

### main.ts

Ponto de entrada da aplicação:

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

---

### app.module.ts

Módulo raiz que conecta tudo:

```typescript
@Module({
  imports: [
    UsersModule,
    AuthModule,
    // Ex.: TypeOrmModule.forRoot({...})
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

---

### app.controller.ts

Exemplo de rota raiz:

```typescript
@Get()
getHello(): string {
  return 'Hello World!';
}
```

---

### app.service.ts

Serviço auxiliar com métodos de exemplo.

---

## 5️⃣ Módulo de Usuários

Gerencia registro, login, listagem e atualização de usuários.

---

### DTOs

#### create-user.dto.ts

```typescript
export class CreateUserDto {
  email: string;
  senha: string;
}
```

#### login-user.dto.ts

```typescript
export class LoginUserDto {
  email: string;
  senha: string;
}
```

#### update-user.dto.ts

```typescript
export class UpdateUserDto {
  email?: string;
  senha?: string;
}
```

---

### Controller

Rotas principais:

| Método | Rota            | Descrição            |
| ------ | --------------- | -------------------- |
| POST   | /users/register | Cria um usuário      |
| POST   | /users/login    | Login                |
| GET    | /users          | Lista usuários       |
| GET    | /users/\:id     | Busca usuário por ID |
| PATCH  | /users/\:id     | Atualiza usuário     |
| DELETE | /users/\:id     | Remove usuário       |

Exemplo:

```typescript
@Post('register')
create(@Body() dto: CreateUserDto) {
  return this.usersService.create(dto);
}
```

---

### Service

Principais métodos:

- `create()`: cria novo usuário
- `login()`: autentica
- `findAll()`: lista usuários
- `findOne(id)`: busca por ID
- `update(id, dto)`: atualiza dados
- `remove(id)`: exclui usuário

---

### Module

```typescript
@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

---

## 6️⃣ Módulo de Autenticação

Responsável pela validação de credenciais e emissão de tokens JWT.

---

### Controller

| Método | Rota        | Descrição                  |
| ------ | ----------- | -------------------------- |
| POST   | /auth/login | Autentica e gera token JWT |

Exemplo:

```typescript
@Post('login')
@UseGuards(LocalAuthGuard)
async login(@Request() req) {
  return this.authService.login(req.user);
}
```

---

### Service

Principais métodos:

- `validateUser(email, senha)`: valida credenciais
- `login(user)`: gera token JWT

Exemplo:

```typescript
async login(user: any) {
  const payload = { username: user.email, sub: user.id };
  return {
    access_token: this.jwtService.sign(payload),
  };
}
```

---

### Guards

Protege rotas autenticadas:

```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

Para proteger uma rota:

```typescript
@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@Request() req) {
  return req.user;
}
```

---

### Strategies

#### jwt.strategy.ts

Valida o token e extrai payload:

```typescript
PassportStrategy(JwtStrategy) {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  ignoreExpiration: false,
  secretOrKey: process.env.JWT_SECRET,
}
```

#### local.strategy.ts

Valida credenciais durante o login chamando `validate()` do AuthService.

---

## 7️⃣ Observações Gerais

- **Hash de Senhas**: use `bcrypt` antes de salvar.
- **Validação DTOs**: recomenda-se `class-validator`.
- **Expiração do Token**: configure `expiresIn` no `sign()`.
- **Proteção de Rotas**: use `JwtAuthGuard` em todas as rotas privadas.


