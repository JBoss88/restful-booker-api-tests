import { test, expect } from '@playwright/test';

test.describe('POST /booking - Negative Validation', () => {
  test('returns an error when firstname is missing', async ({ request }) => {
    const res = await request.post('/booking', {
      data: {
        lastname: 'Doe',
        totalprice: 150,
        depositpaid: true,
        bookingdates: { checkin: '2026-06-01', checkout: '2026-06-07' },
        additionalneeds: 'Breakfast',
      },
    });

    expect(res.status()).toBeGreaterThanOrEqual(400);
  });

  // KNOWN VALIDATION GAP: Restful-Booker does not validate the totalprice type.
  // A string value is accepted and the booking is created with status 200.
  // Expected behaviour: 400 Bad Request.
  test('accepts a string totalprice without error (known validation gap)', async ({ request }) => {
    const res = await request.post('/booking', {
      data: {
        firstname: 'Jane',
        lastname: 'Doe',
        totalprice: 'not-a-number',
        depositpaid: true,
        bookingdates: { checkin: '2026-06-01', checkout: '2026-06-07' },
        additionalneeds: 'Breakfast',
      },
    });

    // API does not reject the request — documents current (incorrect) behaviour
    expect(res.status()).toBe(200);
  });

  // KNOWN VALIDATION GAP: Restful-Booker does not validate date chronology.
  // A checkout date earlier than checkin is accepted with status 200.
  // Expected behaviour: 400 Bad Request.
  test('accepts inverted checkin/checkout dates without error (known validation gap)', async ({ request }) => {
    const res = await request.post('/booking', {
      data: {
        firstname: 'Jane',
        lastname: 'Doe',
        totalprice: 150,
        depositpaid: true,
        bookingdates: { checkin: '2026-06-07', checkout: '2026-06-01' },
        additionalneeds: 'Breakfast',
      },
    });

    // API does not reject the request — documents current (incorrect) behaviour
    expect(res.status()).toBe(200);
  });
});
