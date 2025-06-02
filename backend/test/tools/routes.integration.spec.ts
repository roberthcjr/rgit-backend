import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { randomUUID } from 'crypto';
import { vol } from 'memfs';

describe('Tools Routes', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, PrismaModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = new PrismaService();
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

  describe('Anonymous User', () => {
    it('[GET] /tools, should return unauthorized', async () => {
      return request(app.getHttpServer()).get('/tools').expect(401);
    });

    it('[GET] /tools/{id}, should return unauthorized', async () => {
      return request(app.getHttpServer()).get(`/tools/${1}`).expect(401);
    });

    it('[POST] /tools, should return unauthorized', async () => {
      return request(app.getHttpServer()).post('/tools').send({}).expect(401);
    });

    it('[PATCH] /tools/{id}, should return unauthorized', async () => {
      return request(app.getHttpServer())
        .patch(`/tools/${1}`)
        .send({})
        .expect(401);
    });

    it('[DELETE] /tools/{id}, should return unauthorized', async () => {
      return request(app.getHttpServer()).delete(`/tools/${1}`).expect(401);
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
      await prisma.tool.deleteMany();
    });

    describe('[GET] /tools', () => {
      it('should return success', async () => {
        return request(app.getHttpServer())
          .get('/tools')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });

      it('should return an array', async () => {
        return request(app.getHttpServer())
          .get('/tools')
          .set('Authorization', `Bearer ${token}`)
          .expect((response) => Array.isArray(response));
      });

      it('retrieving an unique, should return success', async () => {
        return request(app.getHttpServer())
          .get(`/tools/${1}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      });
    });

    describe('[POST] /tools', () => {
      it('should return created', async () => {
        return request(app.getHttpServer())
          .post('/tools')
          .send({
            name: 'MockingTool',
            brand: { name: 'MockingBrand' ,
              id: randomUUID()
            },
            category: { name: 'MockingCategory' ,
              id: randomUUID()
            },
          })
          .set('Authorization', `Bearer ${token}`)
          .expect(201);
      });

      it('sending externalId, should return created', async () => {
        return request(app.getHttpServer())
          .post('/tools')
          .send({
            name: 'MockingTool',
            brand: { name: 'MockingBrand' ,
              id: randomUUID()
            },
            category: { name: 'MockingCategory' ,
              id: randomUUID()
            },
            externalId: '123123213',
          })
          .set('Authorization', `Bearer ${token}`)
          .expect(201);
      });

      it.skip('with incorrect body, should return bad request', async () => {
        return request(app.getHttpServer())
          .post('/tools')
          .send({
            brand: { name: 'MockingBrand' },
            category: { name: 'MockingCategory' },
          })
          .set('Authorization', `Bearer ${token}`)
          .expect(404);
      });
    });

    describe('[POST] /tools/importCSV', () => {
      beforeEach(() => {
        vol.reset();
      });
      it('should return created and the expected number of tools created', async () => {
        const baseContent = 'name\nToolA\nToolB\n';

        vol.fromJSON(
          {
            './tools.csv': baseContent,
          },
          '/mock',
        );

        const buffer = vol.readFileSync('/mock/tools.csv');
        const response = await request(app.getHttpServer())
          .post('/tools/importCSV')
          .attach('file', buffer, {
            filename: 'tools.csv',
            contentType: 'text/csv',
          })
          .set('Authorization', `Bearer ${token}`);

        expect(response.body.count).toBe(2);
        expect(response.status).toBe(201);
      });

      it('should return created and the expected number of tools created when passing externalId', async () => {
        const baseContent = 'name,externalId\nToolA,1231231\nToolB,2132312\n';

        vol.fromJSON(
          {
            './tools.csv': baseContent,
          },
          '/mock',
        );

        const buffer = vol.readFileSync('/mock/tools.csv');
        const response = await request(app.getHttpServer())
          .post('/tools/importCSV')
          .attach('file', buffer, {
            filename: 'tools.csv',
            contentType: 'text/csv',
          })
          .set('Authorization', `Bearer ${token}`);

        expect(response.body.count).toBe(2);
        expect(response.status).toBe(201);
      });

      it('should return bad request when wrong type', async () => {
        const baseContent = 'name\nToolA\nToolB\n';

        vol.fromJSON(
          {
            './tools.pdf': baseContent,
          },
          '/mock',
        );

        const buffer = vol.readFileSync('/mock/tools.pdf');
        const response = await request(app.getHttpServer())
          .post('/tools/importCSV')
          .attach('file', buffer, {
            filename: 'tools.pdf',
            contentType: 'text/pdf',
          })
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
      });

      it('should return bad request when file size bigger than 5Mb', async () => {
        const baseContent = 'name\nToolA\nToolB\n';
        const targetSize = 6 * 1024 * 1024; // 6Mb
        const padding = 'ExtraLine\n'.repeat(
          (targetSize - baseContent.length) / 'ExtraLine\n'.length,
        );
        const csvContent = baseContent + padding;

        vol.fromJSON(
          {
            './tools.csv': csvContent,
          },
          '/mock',
        );

        const buffer = vol.readFileSync('/mock/tools.csv');
        const response = await request(app.getHttpServer())
          .post('/tools/importCSV')
          .attach('file', buffer, {
            filename: 'tools.csv',
            contentType: 'text/csv',
          })
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
      });
    });

    it('[PATCH] /tools, should return success', async () => {
      const patchId = 1;
      await prisma.tool.create({
        data: {
          id: patchId,
          name: 'MockedPatchTool',
        },
      });
      return request(app.getHttpServer())
        .patch(`/tools/${patchId}`)
        .send({
          name: 'MockedPatchedTool',
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('[DELETE] /tools, should return success', async () => {
      const deleteId = 1;
      await prisma.tool.create({
        data: {
          id: deleteId,
          name: 'MockedDeleteTool',
        },
      });

      return request(app.getHttpServer())
        .delete(`/tools/${deleteId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });
});
