# RSVP Export & Management (Supabase)

This guide explains how to review, export, and manage RSVP submissions stored in Supabase using the PostgREST API (no SDK required). It also covers optional email notifications and spam controls.

## Table Schema

Recommended columns in public.rsvps:

- id bigint primary key generated always as identity
- first_name text
- last_name text
- email text
- phone text
- attendance text (accept/decline)
- events jsonb (array of selected events) — or text[] if preferred
- guests integer
- meal text
- dietary text
- song text
- notes text
- submitted_at timestamptz default now()

Enable Row Level Security (RLS) and add a policy allowing anon INSERT only (see docs/DEPLOYMENT.md).

## Viewing RSVPs

Option 1: Supabase Dashboard
1) Open Supabase project > Table Editor > rsvps.
2) Filter, sort, and export as CSV.

Option 2: REST (curl)
Replace SUPABASE_URL and SUPABASE_ANON_KEY with your values:
```
curl -H "apikey: SUPABASE_ANON_KEY" \
     -H "Authorization: Bearer SUPABASE_ANON_KEY" \
     "https://SUPABASE_URL/rest/v1/rsvps?select=*"
```

## Exporting as CSV

Supabase REST supports CSV via Accept header:
```
curl -H "apikey: SUPABASE_ANON_KEY" \
     -H "Authorization: Bearer SUPABASE_ANON_KEY" \
     -H "Accept: text/csv" \
     "https://SUPABASE_URL/rest/v1/rsvps?select=*" \
     -o rsvps.csv
```

Tip: Convert events jsonb to text in a spreadsheet for counts by event.

## Email Notifications (Optional)

Approach A: Supabase Edge Function (recommended)
- Create an Edge Function that receives the RSVP payload and sends an email (Resend, Postmark, SES).
- From the client, POST RSVP data to the function URL after insert.
- Store function URL in data/site.json as notify_webhook and uncomment the fetch in assets/js/rsvp.js.

Approach B: Zapier/Make + Webhook
- Use a webhook that triggers an email workflow and/or adds to Google Sheets.
- Add the webhook URL to data/site.json as notify_webhook.

## Spam Protection

Baseline in the form:
- Honeypot field hidden with CSS/offscreen technique.
- Basic validation and rate-limit via client side (prevent double-submit).

Recommended upgrades:
- Enable hCaptcha or reCAPTCHA Enterprise in the form (server validation via Edge Function).
- Supabase RLS policies with rate-limiting logic via Postgres functions or using pg_net + Cloudflare Turnstile verification.
- Use Supabase Log Drains and alerts to detect spikes.

## Common Queries

Count attending guests:
```
/rest/v1/rsvps?select=guests&attendance=eq.accept
```
You can sum guests in your spreadsheet after export.

Filter by event (jsonb contains):
```
/rest/v1/rsvps?select=*&events=cs.{ceremony}
```
If using text arrays, use the appropriate PostgREST filter operators for arrays.

## Data Retention & Privacy

- Keep anon key strictly public; it’s limited by RLS to INSERT only.
- For read access, create a service role key and keep it server-side only.
- Retain RSVPs for as long as needed; consider exporting and anonymizing after the event.

## Troubleshooting

- 401/403 errors: Check anon policy, table name, and headers.
- CORS: Supabase REST supports CORS; ensure URL is exact and no proxies block it.
- Network errors in RSVP form: Check console; verify data/site.json supabase.url and anon_key, and that the table exists.
