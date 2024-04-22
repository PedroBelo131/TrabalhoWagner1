import { test, describe } from 'node:test';
import { equal, deepEqual } from 'node:assert';
import { build, options } from './app.js';

describe('###Tests for Server Configuration', async(t) => {

    test('Testing options configuration file', async (t) => {
        const app = await build(options);

        t.after(async() => {
            await app.close();
        });

        deepEqual(options.stage, 'test');
        deepEqual(options.port, '3000');
        deepEqual(options.host, '127.0.0.1');
        deepEqual(options.jwt_secret, 'Abcd@1234');
        deepEqual(options.db_url, 'mongodb://localhost:27017/dositio');
    });
});


describe("##Tests for routes POST", async (t) => {
    test('#POST /register', async (t) => {
        const app = await build(options);

        t.after(async () => {
            await app.close();
        });
        const response = await app.inject({
            method: 'POST',
            url: '/register',
            body: {
                "username": "pedro",
                "password": "Abcd@1234",
                "isAdmin": true
            }
        });

        equal(response.statusCode, 201);
    });

    test('#POST /auth', async (t) => {
        const app = await build(options);

        t.after(async () => {
            await app.close();
        });
        const response = await app.inject({
            method: 'POST',
            url: '/auth',
            body: {
                "username": "Pedro",
                "password": "Abcd@1234"
            }
        });

        equal(response.statusCode, 200);
    });

    test('#POST /products', async (t) => {
        const app = await build(options);

        t.after(async () => {
            await app.close();
        });
        const response = await app.inject({
            method: 'POST',
            url: '/products',
            body: {
                "name": "maça",
                "qtd": 100,
                "category": "frutas"
            },
            headers: {
                "isadmin": "true",
                "x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlBlZHJvIiwiaWF0IjoxNzEzODEwODUxfQ.hYmaUrz8ETXkPC-pYucPSsI33JpYuDLnnGxv5bj83pc"
            }
        });

        equal(response.statusCode, 201);
    });

    test('#POST /categories', async (t) => {
        const app = await build(options);

        t.after(async () => {
            await app.close();
        });
        const response = await app.inject({
            method: 'POST',
            url: '/categories',
            body: {
                "name": "frutas",
                "img_url": "imagem de frutas"
            },
            headers: {
                "isadmin": "true",
                "x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJid2VybmFtZSI6IlBlZHJvIiwiaWF0IjoxNzEzODEwODUxfQ.hYmaUrz8ETXkPC-pYucPSsI33JpYuDLnnGxv5bj83pc"
            }
        });

        equal(response.statusCode, 201);
    });

});// fim do POST

describe("##Tests for routes GET", async (t) => {
    test('# GET /products', async(t) => {
        const app = await build(options);

        t.after(async() => {
            await app.close();
        });
        const response = await app.inject({
            method: 'GET',
            url: '/products'
        });

        equal(response.statusCode, 200);
    });

    test('# GET /categories', async(t) =>{
        const app = await build(options);

        t.after(async() => {
            await app.close();
        });
        const response = await app.inject({
            method: 'GET',
            url:'/categories'
        });

        equal(response.statusCode, 200);
    });

    test('#GET /categories/name/products', async (t) => {
        const app = await build(options);

        t.after(async () => {
            await app.close();
        });
        const response = await app.inject({
            method: 'GET',
            url: '/categories/name/products'
        });

        equal(response.statusCode, 200);
    });

    // Teste para listar usuários autenticados
    test('# GET /register - List authenticated register', async(t) => {
        // Supondo que você tenha um usuário autenticado e um token de autenticação válido
        const authenticatedUser = {
            username: 'Pedro', 
            isAdmin: 'true' 
        };
        
        const app = await build(options);

        t.after(async() => {
            await app.close();
        });

        // Simulando uma solicitação GET para /register com token de autenticação
        const response = await app.inject({
            method: 'GET',
            url: '/register',
            headers: {
                "x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlBlZHJvIiwiaWF0IjoxNzEzODEwODUxfQ.hYmaUrz8ETXkPC-pYucPSsI33JpYuDLnnGxv5bj83pc",
                    "isadmin": "true"
            }
        });

        equal(response.statusCode, 200);
    });

});// fim do GET

describe('##GET Bad Requests', async(t) => {
    test('# GET /products - Non-existent product ID', async(t) => {
        const app = await build(options);

        t.after(async() => {
            await app.close();
        });

        const response = await app.inject({
            method: 'GET',
            url: '/products/nonexistentProductId'
        });

        equal(response.statusCode, 404);
    });

    test('# GET /categories - Non-existent category ID', async(t) => {
        const app = await build(options);

        t.after(async() => {
            await app.close();
        });

        const response = await app.inject({
            method: 'GET',
            url: '/categories/nonexistentCategoryId'
        });

        equal(response.statusCode, 404);
    });

    // Teste para listar usuários sem autenticação
    test('# GET /register - List register without authentication token', async(t) => {
        const app = await build(options);

        t.after(async() => {
            await app.close();
        });

        // Simulando uma solicitação GET para /register sem token de autenticação
        const response = await app.inject({
            method: 'GET',
            url: '/register'
        });

        equal(response.statusCode, 401); // 401 Unauthorized
    });

});// fim do Bad GET

describe('##Tests for routes PUT', async(t) => {
    test('#PUT /products/id', async (t) => {
            const app = await build(options);

            t.after(async () => {
                await app.close();
            });
            const response = await app.inject({
                method: 'PUT',
                url: '/products/id',
                body: {
                    "name": "berinjela",
                    "qtd": 120,
                    "category": "verduras"
                },
                headers: {
                    "x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlBlZHJvIiwiaWF0IjoxNzEzODEwODUxfQ.hYmaUrz8ETXkPC-pYucPSsI33JpYuDLnnGxv5bj83pc",
                    "isadmin": "true"
                }
            });

            equal(response.statusCode, 204);
        });

    test('#PUT /categories/:id', async (t) => {
            const app = await build(options);

            t.after(async () => {
                await app.close();
            });
            const response = await app.inject({
                method: 'PUT',
                url: '/categories/id',
                body: {
                    "name": "Frutas"
                },
                headers: {
                    "x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlBlZHJvIiwiaWF0IjoxNzEzODEwODUxfQ.hYmaUrz8ETXkPC-pYucPSsI33JpYuDLnnGxv5bj83pc",
                    "isadmin": "true"
                }
            });

            equal(response.statusCode, 204);
        });
});// fim do PUT