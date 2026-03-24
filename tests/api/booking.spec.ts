import { test, expect } from '@playwright/test';
import { generateToken } from './utils/auth';
import { createBookingPayload, Booking, CreateBookingResponse } from './utils/dataFactory';

const payload: Booking = createBookingPayload();

test.describe('Booking', () => {
  let bookingId: number;
  let token: string;

  test.beforeAll(async ({ request }) => {
    token = await generateToken(request);
  });

  test('POST /booking creates a new booking and returns a bookingid', async ({
    request,
  }) => {
    const res = await request.post('/booking', { data: payload });

    expect(res.status()).toBe(200);

    const body: CreateBookingResponse = await res.json();
    expect(body.bookingid).toBeDefined();
    expect(typeof body.bookingid).toBe('number');

    bookingId = body.bookingid;
  });

  test('GET /booking/{id} returns the correct booking data', async ({
    request,
  }) => {
    expect(bookingId).toBeDefined();

    const res = await request.get(`/booking/${bookingId}`);

    expect(res.status()).toBe(200);

    const body: Booking = await res.json();
    expect(body.firstname).toBe(payload.firstname);
    expect(body.lastname).toBe(payload.lastname);
    expect(body.totalprice).toBe(payload.totalprice);
    expect(body.depositpaid).toBe(payload.depositpaid);
    expect(body.bookingdates.checkin).toBe(payload.bookingdates.checkin);
    expect(body.bookingdates.checkout).toBe(payload.bookingdates.checkout);
    expect(body.additionalneeds).toBe(payload.additionalneeds);
  });

  // Prompt 2
  test('PUT /booking/{id} updates firstname and lastname', async ({
    request,
  }) => {
    // Create a dedicated booking for this test
    const createRes = await request.post('/booking', { data: payload });
    expect(createRes.status()).toBe(200);
    const { bookingid } = (await createRes.json()) as CreateBookingResponse;

    const updatedPayload: Booking = {
      ...payload,
      firstname: 'John',
      lastname: 'Smith',
    };

    const res = await request.put(`/booking/${bookingid}`, {
      data: updatedPayload,
      headers: { Cookie: `token=${token}` },
    });

    expect(res.status()).toBe(200);

    const body: Booking = await res.json();
    expect(body.firstname).toBe('John');
    expect(body.lastname).toBe('Smith');
  });

  // Prompt 4
  test('PATCH /booking/{id} updates only totalprice and additionalneeds', async ({ request }) => {
    // Create a dedicated booking for this test
    const createRes = await request.post('/booking', { data: payload });
    expect(createRes.status()).toBe(200);
    const { bookingid } = (await createRes.json()) as CreateBookingResponse;

    const patchRes = await request.patch(`/booking/${bookingid}`, {
      data: { totalprice: 999, additionalneeds: 'Dinner' },
      headers: { Cookie: `token=${token}` },
    });
    expect(patchRes.status()).toBe(200);

    const getRes = await request.get(`/booking/${bookingid}`);
    expect(getRes.status()).toBe(200);

    const body: Booking = await getRes.json();

    // Updated fields
    expect(body.totalprice).toBe(999);
    expect(body.additionalneeds).toBe('Dinner');

    // Untouched fields
    expect(body.firstname).toBe(payload.firstname);
    expect(body.lastname).toBe(payload.lastname);
    expect(body.bookingdates.checkin).toBe(payload.bookingdates.checkin);
    expect(body.bookingdates.checkout).toBe(payload.bookingdates.checkout);
  });

  // Prompt 3
  test('DELETE /booking/{id} removes the booking', async ({ request }) => {
    // Create a dedicated booking for this test
    const createRes = await request.post('/booking', { data: payload });
    expect(createRes.status()).toBe(200);
    const { bookingid } = (await createRes.json()) as CreateBookingResponse;

    const deleteRes = await request.delete(`/booking/${bookingid}`, {
      headers: { Cookie: `token=${token}` },
    });
    expect(deleteRes.status()).toBe(201);

    const getRes = await request.get(`/booking/${bookingid}`);
    expect(getRes.status()).toBe(404);
  });
});
