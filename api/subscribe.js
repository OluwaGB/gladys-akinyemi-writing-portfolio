// Vercel serverless function: receives the form and emails the details to the writer via Resend.
// Needs these Environment Variables in Vercel:
//   RESEND_API_KEY  (from resend.com > API Keys)
//   TO_EMAIL        (the inbox that should receive sign-ups)
//   FROM_EMAIL      (optional; defaults to Resend's test sender)

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const name = String(body.name || '').trim().slice(0, 120);
  const email = String(body.email || '').trim().slice(0, 200);
  const phone = String(body.phone || '').trim().slice(0, 40);

  if (!name || !/^\S+@\S+\.\S+$/.test(email) || phone.replace(/\D/g, '').length < 7) {
    return res.status(400).json({ error: 'Invalid details' });
  }
  if (!process.env.RESEND_API_KEY || !process.env.TO_EMAIL) {
    return res.status(500).json({ error: 'Server not configured' });
  }

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.FROM_EMAIL || 'Portfolio Form <onboarding@resend.dev>',
        to: [process.env.TO_EMAIL],
        reply_to: email,
        subject: 'New sign-up: ' + name,
        html: '<h2>New sign-up from your website</h2>' +
              '<p><b>Name:</b> ' + esc(name) + '</p>' +
              '<p><b>Email:</b> ' + esc(email) + '</p>' +
              '<p><b>Phone:</b> ' + esc(phone) + '</p>',
      }),
    });
    if (!r.ok) return res.status(502).json({ error: 'Email failed' });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
