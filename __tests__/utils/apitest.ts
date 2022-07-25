import http from 'http';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextConnect } from 'next-connect';
import { apiResolver } from 'next/dist/server/api-utils/node';
import supertest from 'supertest';
import url from 'url';

export function createTestServer(handler: NextConnect<NextApiRequest, NextApiResponse<any>>, config?: any) {
    const requestHandler = (request: http.IncomingMessage, response: http.ServerResponse) => {
        const query = url.parse(request.url, true).query
        handler["config"] = config
        apiResolver(request, response, query, handler, undefined, true);
    }
    return http.createServer(requestHandler);
}

export async function createRefreshToken(loginServer: http.Server, id: string, password: string, persistent: boolean) {
    const result = await supertest(loginServer)
        .post('/api/login')
        .send({ id, password, fingerprint: "test", persistent })
        .expect(200)
        .expect('Content-Type', /json/)
    const refresh_token = result.headers["set-cookie"][1].split(";")[0].split("refresh_token=")[1]
    return refresh_token
}

export async function deleteRefreshToken(loginServer: http.Server, refresh_token: string) {
    const result = await supertest(loginServer)
        .delete('/api/login')
        .set('Cookie', [`refresh_token=${refresh_token}`])
        .expect(200)
        .expect('Content-Type', /json/)
    expect(result.body.result).toEqual("logout successful")
}