import { test, expect } from '@playwright/test';

interface BookingDates {
  checkin: string;
  checkout: string;
}

interface Booking {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds: string;
}

interface CreateBookingResponse {
  bookingid: number;
  booking: Booking;
}

interface BookingIdEntry {
  bookingid: number;
}

const bookingDates: BookingDates = {
  checkin: '2026-07-01',
  checkout: '2026-07-07',
};

const payloadAlpha: Booking = {
  firstname: 'Alejandro',
  lastname: 'Vega',
  totalprice: 200,
  depositpaid: true,
  bookingdates: bookingDates,
  additionalneeds: 'Late checkout',
};

const payloadBeta: Booking = {
  firstname: 'Hiroshi',
  lastname: 'Tanaka',
  totalprice: 350,
  depositpaid: false,
  bookingdates: bookingDates,
  additionalneeds: 'Early checkin',
};

test.describe('Booking Filters', () => {
  test('GET /booking?firstname= returns only matching bookings', async ({ request }) => {
    // Create both bookings
    const [resAlpha, resBeta] = await Promise.all([
      request.post('/booking', { data: payloadAlpha }),
      request.post('/booking', { data: payloadBeta }),
    ]);

    expect(resAlpha.status()).toBe(200);
    expect(resBeta.status()).toBe(200);

    const { bookingid: idAlpha } = (await resAlpha.json()) as CreateBookingResponse;
    const { bookingid: idBeta } = (await resBeta.json()) as CreateBookingResponse;

    // Filter by the first booking's firstname
    const filterRes = await request.get('/booking', {
      params: { firstname: payloadAlpha.firstname },
    });

    expect(filterRes.status()).toBe(200);

    const results: BookingIdEntry[] = await filterRes.json();
    const returnedIds = results.map((entry) => entry.bookingid);

    expect(returnedIds).toContain(idAlpha);
    expect(returnedIds).not.toContain(idBeta);
  });
});
