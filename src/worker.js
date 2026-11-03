const recipient = 'headshotscout.support@gmail.com';
const maxLogoBytes = 1_000_000;
const imageTypes = {
  'image/png': { extension: 'png', signature: bytes => bytes.length >= 8 && [137, 80, 78, 71, 13, 10, 26, 10].every((byte, index) => bytes[index] === byte) },
  'image/jpeg': { extension: 'jpg', signature: bytes => bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255 },
  'image/webp': { extension: 'webp', signature: bytes => bytes.length >= 12 && String.fromCharCode(...bytes.subarray(0, 4)) === 'RIFF' && String.fromCharCode(...bytes.subarray(8, 12)) === 'WEBP' },
};

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
});

function clean(value, maxLength) {
  return typeof value === 'string' ? value.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, maxLength) : '';
}

function parseLogo(logo) {
  if (logo == null) return { logo: null, error: null };
  if (!logo || typeof logo !== 'object' || Array.isArray(logo)) return { error: 'Please choose a PNG, JPG, or WebP logo under 1 MB.' };
  const type = imageTypes[logo.contentType];
  const base64 = logo.data;
  if (!type || typeof base64 !== 'string' || base64.length === 0 || base64.length > Math.ceil(maxLogoBytes / 3) * 4 || base64.length % 4 !== 0 || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(base64)) {
    return { error: 'Please choose a PNG, JPG, or WebP logo under 1 MB.' };
  }
  let binary;
  try { binary = atob(base64); } catch { return { error: 'The logo file could not be read. Please choose another image.' }; }
  const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
  if (!bytes.length || bytes.length > maxLogoBytes || !type.signature(bytes)) {
    return { error: 'The logo must be a valid PNG, JPG, or WebP image under 1 MB.' };
  }
  const requestedName = clean(logo.filename, 100).split(/[\\/]/).pop() || 'photographer-logo';
  const stem = requestedName.replace(/\.[^.]*$/, '').replace(/[^A-Za-z0-9_-]/g, '_').slice(0, 80) || 'photographer-logo';
  return { logo: { base64, bytes, contentType: logo.contentType, filename: `${stem}.${type.extension}` }, error: null };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== '/api/profile-submissions') return env.ASSETS.fetch(request);
    if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);
    if (!request.headers.get('content-type')?.toLowerCase().includes('application/json')) {
      return json({ error: 'Invalid request.' }, 415);
    }
    if (!env.SUBMISSIONS_DB) return json({ error: 'Submissions are temporarily unavailable. Please contact us directly.' }, 503);

    let input;
    try {
      const raw = await request.text();
      if (raw.length > 1_400_000) return json({ error: 'Submission is too large. Logo images must be no larger than 1 MB.' }, 413);
      input = JSON.parse(raw);
    } catch {
      return json({ error: 'Invalid submission.' }, 400);
    }
    if (!input || typeof input !== 'object' || Array.isArray(input)) {
      return json({ error: 'Invalid submission.' }, 400);
    }
    const parsedLogo = parseLogo(input.logo);
    if (parsedLogo.error) return json({ error: parsedLogo.error }, 400);

    const profile = {
      name: clean(input.name, 120),
      website: clean(input.website, 500),
      email: clean(input.email, 254),
      area: clean(input.area, 120),
      price: clean(input.price, 20),
      specialty: clean(input.specialty, 1000),
      logo: parsedLogo.logo,
    };
    if (!profile.name || !profile.website || !profile.email || !profile.area || !profile.specialty ||
      !/^https?:\/\//i.test(profile.website) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email) ||
      (profile.price && (!/^\d+(\.\d{1,2})?$/.test(profile.price) || Number(profile.price) > 1_000_000))) {
      return json({ error: 'Please check the required fields and try again.' }, 400);
    }

    let submission;
    try {
      submission = await env.SUBMISSIONS_DB.prepare(`
        INSERT INTO profile_submissions (name, website, email, area, price, specialty, logo_data, logo_content_type, logo_filename)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(profile.name, profile.website, profile.email, profile.area, profile.price || null, profile.specialty, profile.logo?.bytes || null, profile.logo?.contentType || null, profile.logo?.filename || null).run();
    } catch (error) {
      const detail = String(error?.message || 'database error').replace(/[\u0000-\u001f\u007f]/g, ' ').slice(0, 200);
      console.error('Profile submission could not be saved:', error?.name || 'Error', detail);
      return json({ error: 'We could not save your submission. Please try again later.' }, 503);
    }

    const submissionId = submission.meta?.last_row_id;
    let notificationStatus = 'pending';
    let notificationError = null;
    if (env.RESEND_API_KEY && env.RESEND_FROM) {
      const message = [
        'A photographer profile was submitted for review.', '',
        `Photographer or studio: ${profile.name}`,
        `Website: ${profile.website}`,
        `Contact email: ${profile.email}`,
        `Neighborhood: ${profile.area}`,
        `Starting price: ${profile.price || 'Not listed'}`,
        `Specialty: ${profile.specialty}`,
      ].join('\n');

      try {
        const email = { from: env.RESEND_FROM, to: [recipient], reply_to: profile.email, subject: `Profile submission: ${profile.name}`.slice(0, 200), text: message };
        if (profile.logo) email.attachments = [{ filename: profile.logo.filename, content: profile.logo.base64, content_type: profile.logo.contentType }];
        const sent = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(email),
        });
        if (sent.ok) {
          notificationStatus = 'sent';
        } else {
          notificationStatus = 'failed';
          notificationError = `Resend returned HTTP ${sent.status}`;
          console.error('Submission email provider rejected the message:', sent.status);
        }
      } catch (error) {
        notificationStatus = 'failed';
        notificationError = `Delivery error: ${error?.name || 'unknown error'}`;
        console.error('Submission email delivery failed:', error?.name || 'unknown error');
      }
    }

    try {
      await env.SUBMISSIONS_DB.prepare(`
        UPDATE profile_submissions
        SET notification_status = ?, notification_error = ?, notification_attempted_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(notificationStatus, notificationError, submissionId).run();
    } catch (error) {
      console.error('Could not update profile submission notification status:', error?.name || 'database error');
    }

    return json({ ok: true, saved: true, notification: notificationStatus }, 201);
  },
};
