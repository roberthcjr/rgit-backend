import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { randomUUID } from 'crypto';
import { HashService } from 'src/hash/hash.service';
import { clearDatabase } from 'test/orchestrator';

describe('[POST] /auth/login', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, PrismaModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    const prisma = new PrismaService();
    const hashService = new HashService();
    await clearDatabase(prisma);
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
    it('should return not found when wrong username', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'qualquer',
          password: 'anypass',
        })
        .expect(404);
    });

    it('should return unauthorized when wrong password', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'robert',
          password: '123123',
        })
        .expect(401);
    });

    it('should return success when correct password', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'robert',
          password: 'password',
        })
        .expect(200);
    });

    it('should return access_token when correct password', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'robert',
          password: 'password',
        });

      const responseBody = response.body;

      expect(responseBody.access_token).toBeDefined();
    });
  });
});
