import { test, expect } from '@playwright/test';
import { apiResponseTimeLimitMs, usersToCreate } from '../../src/data/api-test-data';

test.use({ baseURL: 'https://reqres.in' });

/** Off by default. Enable full JSON dumps with: set LOG_FULL_RESPONSE=1&& npx playwright test tests/api */
const logFullResponse = process.env.LOG_FULL_RESPONSE === '1';

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

    await test.step(
      `Validate pagination and user data (data.length=${body.data.length}, total=${body.total})`,
      async () => {
        const lastNames = body.data.map((user: { last_name: string }) => user.last_name);
        console.log(
          `GET /api/users → users in data: ${body.data.length}, total: ${body.total}, last_names: ${lastNames.join(', ')}`,
        );
        if (logFullResponse) {
          console.log('GET /api/users → full response:\n', JSON.stringify(body, null, 2));
        }

        expect(body.page).toBe(1);
        expect(body.per_page).toBe(body.total);
        // If a user disappears but total is wrong, or count drifts, this fails.
        expect(body.data.length).toBe(body.total);
        expect(body.total_pages).toBe(1);
        expect(body.data.length).toBeGreaterThan(1);
        // Known users must still be present anywhere in the list (not only at fixed indexes).
        expect(lastNames).toEqual(expect.arrayContaining(['Bluth', 'Weaver']));

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
      },
    );
  });

  /**
   * Interview demo: intentional failure when an expected user is missing from `data`.
   * Skipped by default so CI stays green. Run with: npm run test:demo-fail
   */
  test('DEMO: fails when an expected user is missing from data', async ({ request }) => {
    test.skip(process.env.DEMO_FAIL !== '1', 'Enable with DEMO_FAIL=1 (npm run test:demo-fail)');

    const response = await request.get('/api/users?page=1&per_page=12');
    const body = await response.json();
    const lastNames = body.data.map((user: { last_name: string }) => user.last_name);

    console.log(`DEMO fail → actual last_names: ${lastNames.join(', ')}`);

    // Deliberately wrong: this surname is not in the ReqRes list → report shows expected vs received.
    expect(lastNames).toEqual(expect.arrayContaining(['Bluth', 'Weaver', 'DoesNotExist']));
  });

  for (const userData of usersToCreate) {
    test(`POST /api/users creates ${userData.name}`, async ({ request }) => {
      const requestStartedAt = Date.now();
      const response = await request.post('/api/users', { data: userData });
      const responseTimeMs = Date.now() - requestStartedAt;
      const body = await response.json();

      await test.step(
        `Validate HTTP response and timing (status=${response.status()}, ${responseTimeMs}ms)`,
        async () => {
          console.log(
            `POST /api/users → name=${userData.name}, status=${response.status()}, responseTimeMs=${responseTimeMs}, id=${body.id}`,
          );
          if (logFullResponse) {
            console.log('POST /api/users → full response:\n', JSON.stringify(body, null, 2));
          }

          expect(response.status()).toBe(201);
          expect(response.headers()['content-type']).toContain('application/json');
          expect(responseTimeMs).toBeLessThan(apiResponseTimeLimitMs);
        },
      );

      await test.step(`Validate created user response (id=${body.id})`, async () => {
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
