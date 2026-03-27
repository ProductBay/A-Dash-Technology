# A'Dash Supabase Go-Live Steps

## 1. Apply the submissions schema and RLS

Run the SQL in `supabase/service_requests.sql` inside the Supabase SQL Editor.

That script does all of the following:

- creates `public.service_requests` if missing
- adds `status`, `admin_updated_at`, and `updated_at`
- enables row level security
- allows public request inserts
- restricts submission reads and updates to authenticated admins only

## 2. Create an admin auth user

In Supabase:

1. Go to `Authentication -> Users`
2. Create the admin user
3. Open that user record
4. Set `app_metadata` to:

```json
{
  "role": "admin"
}
```

The `/admin` page checks for a signed-in user, but the real enforcement is in the database policies.

## 3. Environment

Keep only the Supabase project connection values in `.env`:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

`VITE_ADMIN_ACCESS_KEY` is no longer needed by the app.

## 4. Live-path verification checklist

After the SQL and admin user are set up:

1. Restart the app with `npm run dev`
2. Submit one request from each flow:
   - `/request/discovery`
   - `/request/website`
   - `/request/software`
3. Confirm the rows appear in `public.service_requests`
4. Sign into `/admin` with the admin Supabase Auth account
5. Confirm:
   - request type filtering works
   - status updates persist
   - the detail panel shows the payload cleanly

## 5. Production note

Do not expose broad read/update policies to `anon`.

The intended model is:

- public users can submit requests
- only authenticated admin users with `app_metadata.role = "admin"` can read or update submissions
