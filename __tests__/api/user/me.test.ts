import loginHandler from '../../../pages/api/login';
import userHandler from "../../../pages/api/user/me";
import http from 'http';
import supertest from 'supertest';
import { env } from 'process';
import { createRefreshToken, createTestServer, deleteRefreshToken } from '../../utils/apitest'


jest.setTimeout(10e3);
describe('/api/user/me', () => {
    let loginServer: http.Server;
    let userServer: http.Server;
    let user_refresh_token: string;
    let admin_refresh_token: string;
    beforeAll(async () => {
        loginServer = createTestServer(loginHandler);
        user_refresh_token = await createRefreshToken(loginServer, env.USER_ID, env.USER_PASSWORD, false)
        admin_refresh_token = await createRefreshToken(loginServer, env.ADMIN_ID, env.ADMIN_PASSWORD, false)
    });

    afterAll(async () => {
        await deleteRefreshToken(loginServer, user_refresh_token)
        await deleteRefreshToken(loginServer, admin_refresh_token)
        loginServer.close()
    })

    beforeEach(() => {
        userServer = createTestServer(userHandler);
    });

    afterEach(() => {
        userServer.close()
    });

    test("get user data of target user with user role", async () => {
        const res = await supertest(userServer)
            .get('/api/user/me')
            .set('Cookie', [`refresh_token=${admin_refresh_token}`])
            .expect(200)
            .expect('Content-Type', /json/)
        expect(res.body.result).toEqual({ _id: 1, role: "admin" })
        // expect(res.body.result).toEqual({ _id: 1, id: "qwe123" })
    })
})
