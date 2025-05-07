import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { randomUUID } from 'crypto';

describe('Login', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, PrismaModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    const prisma = new PrismaService();
    await prisma.user.create({
      data: {
        id: randomUUID(),
        name: 'robert',
        surname: 'robert',
        job: 'dev',
        section: 'dev',
        username: 'robert',
        password: 'password',
      },
    });
  });

  it('/auth/login (POST), should return 404 when wrong username', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'qualquer',
        password: 'anypass',
      })
      .expect(404);
  });

  it('/auth/login (POST), should return 401 when wrong password', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'robert',
        password: '123123',
      })
      .expect(401);
  });

  it('/auth/login (POST), should return 200 when correct password', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'robert',
        password: 'password',
      })
      .expect(200);
  });

  it('/auth/login (POST), should return access_token when correct password', async () => {
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
