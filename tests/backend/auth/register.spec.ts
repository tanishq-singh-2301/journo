import axios from 'axios';

const API_URL: string = 'http://localhost:3000';
const garbageValue: string = "some random very very random garbage value that'll backend definately refuse to take any shit. thankyou for reading this.";

describe("Register", () => {

    describe('1. Bad Credentials', () => {

        describe("1. Username", () => {

            test("1. Empty Value", async () => {
                await axios.post(`${API_URL}/api/auth/register`, {
                    email: "kaju1@local.com",
                    password: "kaju1pass",
                    username: ""
                })
                    .then(response => {
                        expect(response.status).toBe(200)
                        expect(response.data.success).toBe(false)
                        expect(typeof response.data.error).toBe('string')
                        expect(typeof response.data.token).toBe('undefined')
                    });
            });

            test("2. Small Value", async () => {
                await axios.post(`${API_URL}/api/auth/register`, {
                    email: "kaju1@local.com",
                    password: "kaju1pass",
                    username: "a"
                })
                    .then(response => {
                        expect(response.status).toBe(200)
                        expect(response.data.success).toBe(false)
                        expect(typeof response.data.error).toBe('string')
                        expect(typeof response.data.token).toBe('undefined')
                    });
            });

            test("3. Grbage Value", async () => {
                await axios.post(`${API_URL}/api/auth/register`, {
                    email: "kaju1@local.com",
                    password: "kaju1pass",
                    username: garbageValue
                })
                    .then(response => {
                        expect(response.status).toBe(200)
                        expect(response.data.success).toBe(false)
                        expect(typeof response.data.error).toBe('string')
                        expect(typeof response.data.token).toBe('undefined')
                    });
            });

        });

        describe("2. Password", () => {

            test("1. Empty Value", async () => {
                await axios.post(`${API_URL}/api/auth/register`, {
                    email: "kaju1@local.com",
                    password: "",
                    username: "kaju1pass"
                })
                    .then(response => {
                        expect(response.status).toBe(200)
                        expect(response.data.success).toBe(false)
                        expect(typeof response.data.error).toBe('string')
                        expect(typeof response.data.token).toBe('undefined')
                    });
            });

            test("2. Small Value", async () => {
                await axios.post(`${API_URL}/api/auth/register`, {
                    email: "kaju1@local.com",
                    password: "s",
                    username: "kaju1pass"
                })
                    .then(response => {
                        expect(response.status).toBe(200)
                        expect(response.data.success).toBe(false)
                        expect(typeof response.data.error).toBe('string')
                        expect(typeof response.data.token).toBe('undefined')
                    });
            });

            test("3. Grbage Value", async () => {
                await axios.post(`${API_URL}/api/auth/register`, {
                    email: "kaju1@local.com",
                    password: garbageValue,
                    username: "kaju1pass"
                })
                    .then(response => {
                        expect(response.status).toBe(200)
                        expect(response.data.success).toBe(false)
                        expect(typeof response.data.error).toBe('string')
                        expect(typeof response.data.token).toBe('undefined')
                    });

            });

        });

        describe("3. Email Id", () => {

            test("1. Empty Value", async () => {
                await axios.post(`${API_URL}/api/auth/register`, {
                    email: "",
                    password: "kaju1pass",
                    username: "kaju1"
                })
                    .then(response => {
                        expect(response.status).toBe(200)
                        expect(response.data.success).toBe(false)
                        expect(typeof response.data.error).toBe('string')
                        expect(typeof response.data.token).toBe('undefined')
                    });
            });

            test("2. Small Value", async () => {
                await axios.post(`${API_URL}/api/auth/register`, {
                    email: "s",
                    password: "kaju1pass",
                    username: "kaju1"
                })
                    .then(response => {
                        expect(response.status).toBe(200)
                        expect(response.data.success).toBe(false)
                        expect(typeof response.data.error).toBe('string')
                        expect(typeof response.data.token).toBe('undefined')
                    });
            });

            test("3. Grbage Value", async () => {
                await axios.post(`${API_URL}/api/auth/register`, {
                    email: garbageValue,
                    password: "kaju1pass",
                    username: "kaju1"
                })
                    .then(response => {
                        expect(response.status).toBe(200)
                        expect(response.data.success).toBe(false)
                        expect(typeof response.data.error).toBe('string')
                        expect(typeof response.data.token).toBe('undefined')
                    });
            });

        })

    });

    describe('2. Good Credentials', () => {
        test('1. Everything Good, (register user)', async () => {
            await axios.post(`${API_URL}/api/auth/register`, {
                email: "kaju4@local.com",
                password: "kaju4pass",
                username: "kaju4"
            })
                .then(response => {
                    expect(response.status).toBe(200)
                    expect(response.data.success).toBe(true)
                    expect(typeof response.data.token).toBe('string')
                    expect(typeof response.data.error).toBe('undefined')
                })
        })
    });

    describe('3. Additional Tests', () => {
        test('1. User Exists', async () => {
            await axios.post(`${API_URL}/api/auth/register`, {
                email: "kaju1@local.com",
                password: "randompass",
                username: "random username"
            })
                .then(response => {
                    expect(response.status).toBe(200)
                    expect(response.data.success).toBe(false)
                    expect(typeof response.data.error).toBe('string')
                    expect(typeof response.data.token).toBe('undefined')
                })
        })
    });

})

// npx jest ./tests/backend/auth/register.spec.ts