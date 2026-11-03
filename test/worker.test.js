import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import worker from '../src/worker.js';

const originalFetch = globalThis.fetch;
const secrets = { RESEND_API_KEY: 'test-only-secret', RESEND_FROM: 'Headshot Scout <submissions@example.com>' };
const input = {
  name: 'Example Studio',
  website: 'https://example.com',
  email: 'photographer@example.com',
  area: 'Astoria',
  price: '250',
  specialty: 'Actor headshots',
};
const logo = {
  filename: 'studio-logo.png',
  contentType: 'image/png',
  data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/SroAAAAASUVORK5CYII=',
};

function makeDb({ failInsert = false } = {}) {
  const calls = [];
  return {
    calls,
    prepare(sql) {
      return {
        bind(...values) {
          return {
            async run() {
              calls.push({ sql, values });
              if (sql.includes('INSERT') && failInsert) throw new Error('database unavailable');
              return sql.includes('INSERT') ? { meta: { last_row_id: 41 } } : { success: true };
            },
          };
        },
      };
    },
  };
}

function request(body = input) {
  return new Request('https://headshotscout.com/api/profile-submissions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

afterEach(() => { globalThis.fetch = originalFetch; });

test('saves a pending submission and notifies the designated inbox', async () => {
  const db = makeDb();
  let emailRequest;
  globalThis.fetch = async (url, options) => {
    emailRequest = { url, options };
    return new Response('{"id":"email-test-id"}', { status: 200 });
  };

  const response = await worker.fetch(request(), { ...secrets, SUBMISSIONS_DB: db }, {});
  const body = await response.json();
  const insert = db.calls.find(call => call.sql.includes('INSERT'));
  const update = db.calls.find(call => call.sql.includes('UPDATE'));

  assert.equal(response.status, 201);
  assert.deepEqual(body, { ok: true, saved: true, notification: 'sent' });
  assert.deepEqual(insert.values, ['Example Studio', 'https://example.com', 'photographer@example.com', 'Astoria', '250', 'Actor headshots', null, null, null]);
  assert.deepEqual(update.values, ['sent', null, 41]);
  assert.equal(emailRequest.url, 'https://api.resend.com/emails');
  assert.equal(emailRequest.options.headers.Authorization, `Bearer ${secrets.RESEND_API_KEY}`);
  assert.deepEqual(JSON.parse(emailRequest.options.body).to, ['headshotscout.support@gmail.com']);
  assert.equal(JSON.stringify(body).includes(secrets.RESEND_API_KEY), false);
});

test('keeps the saved profile and records notification failure when email delivery fails', async () => {
  const db = makeDb();
  globalThis.fetch = async () => new Response('provider error', { status: 503 });

  const response = await worker.fetch(request({ ...input, logo }), { ...secrets, SUBMISSIONS_DB: db }, {});
  const body = await response.json();
  const insert = db.calls.find(call => call.sql.includes('INSERT'));
  const update = db.calls.find(call => call.sql.includes('UPDATE'));

  assert.equal(response.status, 201);
  assert.equal(body.saved, true);
  assert.equal(body.notification, 'failed');
  assert.equal(db.calls.some(call => call.sql.includes('INSERT')), true);
  assert.equal(insert.values[6] instanceof Uint8Array, true);
  assert.equal(update.values[0], 'failed');
  assert.equal(update.values[2], 41);
});

test('stores an optional logo and attaches it to the review email', async () => {
  const db = makeDb();
  let emailRequest;
  globalThis.fetch = async (url, options) => {
    emailRequest = { url, options };
    return new Response('{"id":"email-logo-test"}', { status: 200 });
  };

  const response = await worker.fetch(request({ ...input, logo }), { ...secrets, SUBMISSIONS_DB: db }, {});
  const insert = db.calls.find(call => call.sql.includes('INSERT'));
  const attachment = JSON.parse(emailRequest.options.body).attachments[0];

  assert.equal(response.status, 201);
  assert.equal(insert.values[6] instanceof Uint8Array, true);
  assert.equal(insert.values[7], 'image/png');
  assert.equal(insert.values[8], 'studio-logo.png');
  assert.deepEqual(attachment, { filename: 'studio-logo.png', content: logo.data, content_type: 'image/png' });
});

test('rejects a logo whose declared format does not match its image bytes', async () => {
  const db = makeDb();
  let emailAttempted = false;
  globalThis.fetch = async () => { emailAttempted = true; return new Response('{}'); };

  const response = await worker.fetch(request({ ...input, logo: { ...logo, contentType: 'image/webp' } }), { ...secrets, SUBMISSIONS_DB: db }, {});
  assert.equal(response.status, 400);
  assert.equal(db.calls.length, 0);
  assert.equal(emailAttempted, false);
});

test('does not send email or report success when saving fails', async () => {
  const db = makeDb({ failInsert: true });
  let emailAttempted = false;
  globalThis.fetch = async () => { emailAttempted = true; return new Response('{}'); };

  const response = await worker.fetch(request(), { ...secrets, SUBMISSIONS_DB: db }, {});
  const body = await response.json();

  assert.equal(response.status, 503);
  assert.equal(body.saved, undefined);
  assert.equal(emailAttempted, false);
  assert.equal(db.calls.some(call => call.sql.includes('UPDATE')), false);
});

test('rejects requests when required fields are invalid before saving', async () => {
  const db = makeDb();
  const response = await worker.fetch(request({ ...input, website: 'javascript:alert(1)' }), { ...secrets, SUBMISSIONS_DB: db }, {});
  assert.equal(response.status, 400);
  assert.equal(db.calls.length, 0);
});
