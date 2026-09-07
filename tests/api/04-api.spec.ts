import { test, expect } from '@playwright/test';
import { apiResponseTimeLimitMs, usersToCreate } from '../../src/data/api-test-data';

test.use({ baseURL: 'https://reqres.in' });

/**
 * API test automation for the ReqRes users endpoints.
 * The assertions cover the HTTP contract as well as the response body.
 */
test.describe('ReqRes Users API', () => {
  test('GET /api/users lists users on the requested page', async ({ request }) => {
    const response = await request.get('/api/users?page=1&per_page=12');
    const body = await response.json();

    await test.step('Validate the HTTP response', async () => {
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('application/json');
    });

    await test.step('Validate pagination and user data', async () => {
      expect(body.page).toBe(1);
      expect(body.per_page).toBe(body.total);
      expect(body.data.length).toBe(body.total);
      expect(body.total_pages).toBe(1);
      expect(body.data.length).toBeGreaterThan(1);
      expect(body.data[0].last_name).toBe('Bluth');
      expect(body.data[1].last_name).toBe('Weaver');

      for (const user of body.data) {
        expect(user).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            email: expect.stringMatching(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
            first_name: expect.any(String),
            last_name: expect.any(String),
            avatar: expect.stringMatching(/^https?:\/\//),
          }),
        );
      }
    });
  });

  for (const userData of usersToCreate) {
    test(`POST /api/users creates ${userData.name}`, async ({ request }) => {
      const requestStartedAt = Date.now();
      const response = await request.post('/api/users', { data: userData });
      const responseTimeMs = Date.now() - requestStartedAt;
      const body = await response.json();

      await test.step('Validate the HTTP response and response time', async () => {
        expect(response.status()).toBe(201);
        expect(response.headers()['content-type']).toContain('application/json');
        expect(responseTimeMs).toBeLessThan(apiResponseTimeLimitMs);
      });

      await test.step('Validate the created user response', async () => {
        expect(body).toEqual(
          expect.objectContaining({
            ...userData,
            id: expect.any(String),
            createdAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
          }),
        );
      });
    });
  }
});