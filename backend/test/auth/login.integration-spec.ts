import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';

describe('Login', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
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
        password: 'senhaCorreta',
      })
      .expect(200);
  });

  it('/auth/login (POST), should return access_token when correct password', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'robert',
        password: 'senhaCorreta',
      });

    const responseBody = response.body;

    expect(responseBody.access_token).toBeDefined();
  });
});
