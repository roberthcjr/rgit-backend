import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';

describe('Protected routes', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
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
