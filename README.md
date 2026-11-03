# Writer portfolio

Files: index.html, photo.jpg, api/subscribe.js (keep this structure when you push to GitHub).

## Receive sign-ups with Resend
1. resend.com > create account > API Keys > create a key.
2. Vercel > your project > Settings > Environment Variables, add:
   - RESEND_API_KEY = your key
   - TO_EMAIL = the inbox that should receive sign-ups (use the same email you registered on Resend until you verify a domain)
   - FROM_EMAIL = optional, e.g. "Boluwatife <hello@yourdomain.com>" once your domain is verified
3. Redeploy (Deployments > ... > Redeploy). Each form submission now arrives as an email.
