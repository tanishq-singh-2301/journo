import axios from 'axios';

const API_URL: string = 'http://localhost:3000';
const garbageValue: string = "some random very very random garbage value that'll backend definately refuse to take any shit. thankyou for reading this.";
const token: string = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWVmNzUwZDAyNzNmZmYxOGE4NThhNWQiLCJlbWFpbCI6ImthanUxQGxvY2FsLmNvbSIsInVzZXJuYW1lIjoia2FqdTEiLCJpYXQiOjE2NDMzODk0MDQsImV4cCI6MTY0MzU2MjIwNH0.EGyupYKZho-yU82MK6f-m5VpBzRn0AWU95REUk8PJwE";

describe('Event', () => {
    describe('Delete', () => {

        describe('1. Good Authorization', () => {

            test('1. Token', async () => {
                await axios.get(`${API_URL}/api/event`, {
                    headers: {
                        "authentication": token
                    }
                })
                    .then(response => {
                        expect(response.status).toBe(200)
                        expect(response.data.success).toBe(true)
                        expect(typeof response.data.error).toBe('undefined')
                        expect(typeof response.data.data).toBe('object')
                    })
            })

        });

    });
});

// npx jest ./tests/backend/event/get.spec.ts