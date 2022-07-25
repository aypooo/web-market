import loginHandler from '../../../pages/api/login';
import productHandler, { config } from "../../../pages/api/product";
import http from 'http';
import supertest from 'supertest';
import { env } from 'process';
import { createRefreshToken, createTestServer, deleteRefreshToken } from '../../utils/apitest'
import fs from 'fs'


jest.setTimeout(10e3);
describe('/api/product', () => {
    let loginServer: http.Server;
    let productServer: http.Server;
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
        productServer = createTestServer(productHandler, config);
    });

    afterEach(() => {
        productServer.close()
    });

    describe("[GET](get product data)", () => {
        test('with _id query', async () => {
            const result = await supertest(productServer)
                .get('/api/product')
                .query({ _id: 1 })
                .expect(200)
                .expect('Content-Type', /json/)
            expect(result.body.result.metadata.totalnum).toEqual(1)
        })
    })

    // test("get product data with query ")
    let product_id: number

    describe("[POST](create product)", () => {
        test("with right body", async () => {
            const imageDataUrl2 = "data:image/jpeg;base64," + fs.readFileSync('./__src__/image/fresh-fruits.jpg', 'base64')
            const imageDataUrl3 = "data:image/jpeg;base64," + fs.readFileSync('./__src__/image/salad.jpg', 'base64')
            const imageDataUrl4 = "data:image/jpeg;base64," + fs.readFileSync('./__src__/image/vegetables.jpg', 'base64')
            const imageDataUrl1 = "data:image/jpeg;base64," + fs.readFileSync('./__src__/image/berries.jpg', 'base64')
            const imageDataUrl = [imageDataUrl1, imageDataUrl2]
            const thumbnailDataUrl = [imageDataUrl3, imageDataUrl4]
            const result = await supertest(productServer)
                .post('/api/product')
                .set('Cookie', [`refresh_token=${admin_refresh_token}`])
                .send({ name: "test", price: 10000, category1: "디지털/가전", category2: "PC부품", imageDataUrl, thumbnailDataUrl })
                .expect(200)
                .expect('Content-Type', /json/)
            product_id = result.body.result
            expect(typeof product_id).toBe('number')
        })
    })

    describe("[PUT](edit product data)", () => {
        test("with right body", async () => {
            await supertest(productServer)
                .put('/api/product')
                .set('Cookie', [`refresh_token=${admin_refresh_token}`])
                .send({ _id: product_id, price: 5000 })
                .expect(200)
                .expect('Content-Type', /json/)

            const { body: { result: { data: result } } } = await supertest(productServer)
                .get('/api/product')
                .query({ _id: product_id })
                .expect(200)
                .expect('Content-Type', /json/)
            expect(result[0].price).toEqual(5000)
        })
    })

    describe("[DELETE](delete product data)", () => {
        test("with right query", async () => {
            const result = await supertest(productServer)
                .delete('/api/product')
                .set('Cookie', [`refresh_token=${admin_refresh_token}`])
                .query({ _id: product_id })
                .expect(200)
                .expect('Content-Type', /json/)
        })
    })
})