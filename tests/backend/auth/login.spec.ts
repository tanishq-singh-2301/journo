import axios from 'axios';

const API_URL = 'http://localhost:3000';

describe("login", () => {

    describe('Full Credentials', () => {
        test("1. Good Credentials", async () => {
            await axios.post(`${API_URL}/api/auth/login`, {
                email: "kaju2@local.com",
                password: "kaju2pass"
            })
                .then(response => {
                    expect(response.status).toBe(200)
                    expect(response.data.success).toBe(true)
                    expect(typeof response.data.token).toBe('string')
                })
        });

        test("2. Bad Credentials", async () => {
            await axios.post(`${API_URL}/api/auth/login`, {
                email: "my-email@local.com",
                password: "password"
            })
                .then(response => {
                    expect(response.status).toBe(200)
                    expect(response.data.success).toBe(false)
                    expect(response.data.error.toLowerCase()).toEqual('Invalid Credentials'.toLowerCase())
                })
        });
    })

    describe('Email Id', () => {
        test("1. Bad Email Id", async () => {
            await axios.post(`${API_URL}/api/auth/login`, {
                email: "kaju2@localcom",
                password: "kaju2pass"
            })
                .then(response => {
                    expect(response.status).toBe(200)
                    expect(response.data.success).toBe(false)
                    expect(response.data.error.toLowerCase()).toEqual('email must be a valid email'.toLowerCase())
                })
        });

        test("2. Empty Email Id", async () => {
            await axios.post(`${API_URL}/api/auth/login`, {
                email: "",
                password: "kaju2pass"
            })
                .then(response => {
                    expect(response.status).toBe(200)
                    expect(response.data.success).toBe(false)
                    expect(response.data.error.toLowerCase()).toEqual('email is not allowed to be empty'.toLowerCase())
                })
        });

        test("3. Long Email Id", async () => {
            await axios.post(`${API_URL}/api/auth/login`, {
                email: "my-super-super-long-email-id-that-no-one-could-imgain@lol.com",
                password: "kaju2pass"
            })
                .then(response => {
                    expect(response.status).toBe(200)
                    expect(response.data.success).toBe(false)
                    expect(response.data.error.toLowerCase()).toEqual('email length must be less than or equal to 40 characters long'.toLowerCase())
                })
        });

        test("4. Short Email Id", async () => {
            await axios.post(`${API_URL}/api/auth/login`, {
                email: "a@l.co",
                password: "kaju2pass"
            })
                .then(response => {
                    expect(response.status).toBe(200)
                    expect(response.data.success).toBe(false)
                    expect(response.data.error.toLowerCase()).toEqual('email length must be at least 7 characters long'.toLowerCase())
                })
        });
    })

    describe('Passwords', () => {
        test("1. Bad Long password", async () => {
            await axios.post(`${API_URL}/api/auth/login`, {
                email: "kaju2@local.com",
                password: "my password is very very long that no one could every imagine"
            })
                .then(response => {
                    expect(response.status).toBe(200)
                    expect(response.data.success).toBe(false)
                    expect(response.data.error.toLowerCase()).toEqual('password length must be less than or equal to 30 characters long'.toLowerCase())
                })
        });

        test("2. Bad Short password", async () => {
            await axios.post(`${API_URL}/api/auth/login`, {
                email: "kaju2@local.com",
                password: "s"
            })
                .then(response => {
                    expect(response.status).toBe(200)
                    expect(response.data.success).toBe(false)
                    expect(response.data.error.toLowerCase()).toEqual('password length must be at least 3 characters long'.toLowerCase())
                })
        });

        test("3. Empty password", async () => {
            await axios.post(`${API_URL}/api/auth/login`, {
                email: "kaju2@local.com",
                password: ""
            })
                .then(response => {
                    expect(response.status).toBe(200)
                    expect(response.data.success).toBe(false)
                    expect(response.data.error.toLowerCase()).toEqual('password is not allowed to be empty'.toLowerCase())
                })
        });

        test("4. Bad password", async () => {
            await axios.post(`${API_URL}/api/auth/login`, {
                email: "kaju2@local.com",
                password: "password"
            })
                .then(response => {
                    expect(response.status).toBe(200)
                    expect(response.data.success).toBe(false)
                    expect(response.data.error.toLowerCase()).toEqual('Invalid Credentials'.toLowerCase())
                })
        });
    })

})

// npm run test:backend