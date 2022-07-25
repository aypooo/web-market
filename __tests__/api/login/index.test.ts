import loginHandler from '../../../pages/api/login';
import http from 'http';
import { createTestServer } from '../../utils/apitest'
import supertest from 'supertest';
import { env } from 'process';

jest.setTimeout(10e3);

describe('/api/login', () => {
    let loginServer: http.Server;
    beforeEach(() => {
        loginServer = createTestServer(loginHandler)
    });
    afterEach(() => loginServer.close());

    let refresh_token: string
    describe("[POST](login)", () => {
        test('with right id and password', async () => {
            const result = await supertest(loginServer)
                .post('/api/login')
                .send({ id: env.ADMIN_ID, password: env.ADMIN_PASSWORD, fingerprint: "test", persistent: false })
                .expect(200)
                .expect('Content-Type', /json/)
            expect(result.body.result).toEqual("admin")
            refresh_token = result.headers["set-cookie"][1].split(";")[0].split("refresh_token=")[1]
            // console.debug(result.headers)
        })

        test('with wrong id or password', async () => {
            const result = await supertest(loginServer)
                .post('/api/login')
                .send({ id: "a", password: "a", fingerprint: "test", persistent: false })
                .expect(400)
                .expect('Content-Type', /json/)
            expect(result.body.error.message).toEqual("not a valid id or password")
        })
    })
    describe("[DELETE](logout)", () => {
        test('with right refresh token', async () => {
            const result = await supertest(loginServer)
                .delete('/api/login')
                .set('Cookie', [`refresh_token=${refresh_token}`])
                .expect(200)
                .expect('Content-Type', /json/)
            expect(result.body.result).toEqual("logout successful")
        })

        test('with wrong refresh token', async () => {
            const result = await supertest(loginServer)
                .delete('/api/login')
                .set('Cookie', [`refresh_token=1234`])
                .expect(400)
                .expect('Content-Type', /json/)
            expect(result.body.error.message).toEqual("logout failed")
        })

        test('without refresh token', async () => {
            const result = await supertest(loginServer)
                .delete('/api/login')
                .expect(200)
                .expect('Content-Type', /json/)
            expect(result.body.result).toEqual("not logged in yet")
        })
    })
});