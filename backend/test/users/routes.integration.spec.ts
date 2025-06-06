import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { randomUUID } from 'crypto';
import { HashService } from 'src/hash/hash.service';
import { clearDatabase } from 'test/orchestrator';

describe('Users Routes', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, PrismaModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = new PrismaService();
    await clearDatabase(prisma);
    const hashService = new HashService();
    const hashedPassword = await hashService.hash('password');
    await prisma.user.create({
      data: {
        id: randomUUID(),
        name: 'robert',
        surname: 'robert',
        job: 'dev',
        section: 'dev',
        username: 'robert',
        password: hashedPassword,
      },
    });
  });

  describe('Anonymous User', () => {
    it('[GET] /users, should return unauthorized', async () => {
      return request(app.getHttpServer()).get('/users').expect(401);
    });

    it('[GET] /users/{id}, should return unauthorized', async () => {
      return request(app.getHttpServer()).get(`/users/${1}`).expect(401);
    });

    it('[POST] /users, should return unauthorized', async () => {
      return request(app.getHttpServer()).post('/users').send({}).expect(401);
    });

    it('[PATCH] /users/{id}, should return unauthorized', async () => {
      return request(app.getHttpServer())
        .patch(`/users/${1}`)
        .send({})
        .expect(401);
    });

    it('[DELETE] /users/{id}, should return unauthorized', async () => {
      return request(app.getHttpServer()).delete(`/users/${1}`).expect(401);
    });
  });

  describe('Authenticated User', () => {
    let token;

    beforeAll(async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'robert',
          password: 'password',
        });

      token = loginResponse.body.access_token;
    });

    beforeEach(async () => {
      await prisma.lend.deleteMany();
      await prisma.tool.deleteMany();
      await prisma.user.deleteMany({
        where: {
          username: {
            not: 'robert',
          },
        },
      });
    });

    describe('[GET] /users', () => {
      it('should return success', async () => {
        return request(app.getHttpServer())
          .get('/users')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });

      it('should return an array', async () => {
        const response = await request(app.getHttpServer())
          .get('/users')
          .set('Authorization', `Bearer ${token}`);

        expect(Array.isArray(response.body)).toBeTruthy();
      });

      it('querying over users without lends, should return users without lends', async () => {
        const userLendId = randomUUID();
        const toolId = 99999999;
        await prisma.user.createMany({
          data: [
            {
              id: userLendId,
              name: 'user1',
              job: 'user1',
              password: 'user1',
              section: 'user1',
              username: 'user1',
            },
            {
              name: 'user2',
              job: 'user2',
              password: 'user2',
              section: 'user2',
              username: 'user2',
            },
          ],
        });
        await prisma.tool.create({
          data: {
            id: toolId,
            name: 'tool1',
          },
        });

        await prisma.lend.create({
          data: {
            limit_date: new Date(Date.now()),
            user: {
              connect: {
                id: userLendId,
              },
            },
            tool: {
              connect: {
                id: toolId,
              },
            },
          },
        });
        const response = await request(app.getHttpServer())
          .get('/users?hasLends=false')
          .set('Authorization', `Bearer ${token}`);

        expect(
          response.body.includes({
            id: userLendId,
            name: 'user1',
            job: 'user1',
            password: 'user1',
            section: 'user1',
            username: 'user1',
          }),
        ).toBeFalsy();
      });

      it('retrieving an unique, should return success', async () => {
        return request(app.getHttpServer())
          .get(`/users/${1}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });
    });

    describe('[POST] /users', () => {
      it('should return created', async () => {
        return request(app.getHttpServer())
          .post('/users')
          .send({
            id: randomUUID(),
            name: 'mockName',
            surname: 'MockSurname',
            job: 'mock',
            section: 'mock',
            username: 'mockusername',
            password: 'mockpassword',
          })
          .set('Authorization', `Bearer ${token}`)
          .expect(201);
      });

      it('should return a body without password', async () => {
        const user = {
          name: 'mockName',
          surname: 'MockSurname',
          job: 'mock',
          section: 'mock',
          username: 'mockusername',
          password: 'mockpassword',
        };
        const response = await request(app.getHttpServer())
          .post('/users')
          .send(user)
          .set('Authorization', `Bearer ${token}`);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...expectedResponse } = user;

        expect(response.body).toEqual({
          id: response.body.id,
          ...expectedResponse,
        });
      });

      it('should create a hash in password', async () => {
        const user = {
          name: 'mockName',
          surname: 'MockSurname',
          job: 'mock',
          section: 'mock',
          username: 'mockusername',
          password: 'mockpassword',
        };
        const hashService = new HashService();
        const response = await request(app.getHttpServer())
          .post('/users')
          .send(user)
          .set('Authorization', `Bearer ${token}`);

        const userInserted = await prisma.user.findFirst({
          where: {
            id: response.body.id,
          },
        });

        const isHashEqual = hashService.compare(
          user.password,
          userInserted.password,
        );

        expect(isHashEqual).toBeTruthy();
      });

      it.skip('with incorrect body, should return bad request', async () => {
        return request(app.getHttpServer())
          .post('/users')
          .send({
            name: 'MockName',
          })
          .set('Authorization', `Bearer ${token}`)
          .expect(404);
      });
    });

    describe('[PATCH] /users', () => {
      it('changing name, should return success', async () => {
        const patchId = randomUUID().toString();
        await prisma.user.create({
          data: {
            id: patchId,
            name: 'mockName',
            surname: 'MockSurname',
            job: 'mock',
            section: 'mock',
            username: 'mockusername',
            password: 'mockpassword',
          },
        });
        return request(app.getHttpServer())
          .patch(`/users/${patchId}`)
          .send({
            name: 'MockedPatchedUser',
          })
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });

      it('changing password, should create a new hash', async () => {
        const patchId = randomUUID().toString();
        await prisma.user.create({
          data: {
            id: patchId,
            name: 'mockName',
            surname: 'MockSurname',
            job: 'mock',
            section: 'mock',
            username: 'mockusername',
            password: 'mockpassword',
          },
        });
        await request(app.getHttpServer())
          .patch(`/users/${patchId}`)
          .send({
            password: 'newPassword',
          })
          .set('Authorization', `Bearer ${token}`);

        const { password: updatedPassword } = await prisma.user.findFirst({
          where: {
            id: patchId,
          },
        });

        const hashService = new HashService();
        const isValidPassword = await hashService.compare(
          'newPassword',
          updatedPassword,
        );

        expect(isValidPassword).toBeTruthy();
      });
    });

    it('[DELETE] /users, should return success', async () => {
      const deleteId = randomUUID().toString();
      await prisma.user.create({
        data: {
          id: deleteId,
          name: 'mockName',
          surname: 'MockSurname',
          job: 'mock',
          section: 'mock',
          username: 'mockusername',
          password: 'mockpassword',
        },
      });

      return request(app.getHttpServer())
        .delete(`/users/${deleteId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });
});
