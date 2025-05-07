import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { randomUUID } from 'crypto';

describe('Protected routes', () => {
  let app: INestApplication;

  beforeEach(async () => {
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

  it('/tools (GET), should return 200 when acessing protected route with correct token', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'robert',
        password: 'password',
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
