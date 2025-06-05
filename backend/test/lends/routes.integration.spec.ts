import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { randomUUID } from 'crypto';
import { HashService } from 'src/hash/hash.service';

describe('Lends Routes', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, PrismaModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = new PrismaService();
    const hashService = new HashService();
    await prisma.user.deleteMany();
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
    it('[GET] /lends, should return unauthorized', async () => {
      return request(app.getHttpServer()).get('/lends').expect(401);
    });

    it('[POST] /lends, should return unauthorized', async () => {
      return request(app.getHttpServer()).post('/lends').send({}).expect(401);
    });
  });

  describe('Authenticated User', () => {
    let token;

    const userId = randomUUID();
    const toolId = 123;

    const lendMock = {
      limit_date: new Date(Date.now()),
      user: {
        id: userId,
      },
      tool: {
        id: toolId,
      },
    };

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
      await prisma.user.create({
        data: {
          id: userId,
          name: 'LendTestUser',
          job: 'LendTestJob',
          section: 'LendTestSection',
          username: 'LendTestUsername',
          password: 'LendTestPassword',
        },
      });
      await prisma.tool.create({
        data: {
          id: toolId,
          name: 'LendTestTool',
        },
      });
    });

    afterEach(async () => {
      await prisma.lend.deleteMany();
      await prisma.user.deleteMany();
      await prisma.tool.deleteMany();
    });

    describe('[GET] /lends', () => {
      it('should return success', async () => {
        return request(app.getHttpServer())
          .get('/lends')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });

      it('should return an array', async () => {
        const response = await request(app.getHttpServer())
          .get('/lends')
          .set('Authorization', `Bearer ${token}`);

        expect(Array.isArray(response.body)).toBeTruthy();
      });
    });

    describe('[POST] /lends', () => {
      it('should return sucess', async () => {
        return request(app.getHttpServer())
          .post('/lends')
          .send(lendMock)
          .set('Authorization', `Bearer ${token}`)
          .expect(201);
      });

      it('should return the lend', async () => {
        const response = await request(app.getHttpServer())
          .post('/lends')
          .send(lendMock)
          .set('Authorization', `Bearer ${token}`);

        expect(response.body).toEqual({
          id: response.body.id,
          limit_date: response.body.limit_date,
          lend_date: response.body.lend_date,
          userId: lendMock.user.id,
          toolId: lendMock.tool.id,
        });
      });

      it('should create a lend in db', async () => {
        const response = await request(app.getHttpServer())
          .post('/lends')
          .send(lendMock)
          .set('Authorization', `Bearer ${token}`);

        const lendCreated = await prisma.lend.findFirst({
          where: {
            id: response.body.id,
          },
        });

        expect(lendCreated).toBeDefined();
      });

      it.skip('with incorrect body, should return bad request', async () => {
        return request(app.getHttpServer())
          .post('/lends')
          .send({
            name: 'MockName',
          })
          .set('Authorization', `Bearer ${token}`)
          .expect(404);
      });
    });

    describe('[DELETE] /lends', () => {
      it('should return success', async () => {
        const deleteLendId = randomUUID();
        await prisma.lend.create({
          data: {
            id: deleteLendId,
            limit_date: lendMock.limit_date,
            user: {
              connect: lendMock.user,
            },
            tool: {
              connect: lendMock.tool,
            },
          },
        });

        return request(app.getHttpServer())
          .delete(`/lends/${deleteLendId}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });

      it('should change status of tool to available', async () => {
        const deleteLendId = randomUUID();
        await prisma.lend.create({
          data: {
            id: deleteLendId,
            limit_date: lendMock.limit_date,
            user: {
              connect: lendMock.user,
            },
            tool: {
              connect: lendMock.tool,
            },
          },
        });

        await prisma.tool.update({
          where: {
            id: lendMock.tool.id,
          },
          data: {
            status: 'UNAVAILABLE',
          },
        });

        await request(app.getHttpServer())
          .delete(`/lends/${deleteLendId}`)
          .set('Authorization', `Bearer ${token}`);

        const { status: toolStatus } = await prisma.tool.findFirst({
          where: {
            id: lendMock.tool.id,
          },
        });

        return expect(toolStatus).toEqual('AVAILABLE');
      });
    });
  });
});
