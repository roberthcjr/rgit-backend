import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Integration tests', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello Robert!');
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

  it('/tools (GET), should return 200 when acessing protected route with correct token', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'robert',
        password: 'senhaCorreta',
      });

    const token = loginResponse.body.access_token;

    return request(app.getHttpServer())
      .get('/tools')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('/tools (GET), should return 401 when acessing protected route without correct token', async () => {
    return request(app.getHttpServer()).get('/tools').expect(401);
  });
});
