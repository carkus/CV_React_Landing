# Instagram feed

`instagram_sync.py` runs hourly on the droplet, fetches the latest posts via the
Instagram API (with Instagram Login), and writes
`/var/www/carkus.com/data/instagram.json`. `src/components/InstagramSection.tsx`
reads that file; the section stays hidden until the file exists.

The file is generated on the server only — it is not in `public/data/` and not
in git. `deploy.ps1` syncs without `-delete`, so deploys leave it alone.

## One-time setup

1. **Account type.** In the Instagram app: Settings → Account type and tools →
   switch to a *Creator* or *Business* account (free; required by the API).
2. **Meta app.** At developers.facebook.com → My Apps → Create app → use case
   "Manage messaging & content on Instagram" (Instagram API with Instagram
   Login). Under *API setup with Instagram login*, add your Instagram account
   and click **Generate token**. Only the `instagram_business_basic`
   permission is needed. The token shown is a long-lived (60-day) token.
   The app can stay in development mode — it only reads your own account.
3. **Copy the script and token to the droplet** (from this repo's root):

   ```powershell
   scp scripts/instagram/instagram_sync.py root@170.64.223.82:/usr/local/bin/instagram_sync.py
   ```

   then on the droplet:

   ```bash
   chmod 755 /usr/local/bin/instagram_sync.py
   mkdir -p /etc/instagram-feed && chmod 700 /etc/instagram-feed
   nano /etc/instagram-feed/token        # paste the token, save
   chmod 600 /etc/instagram-feed/token
   /usr/local/bin/instagram_sync.py      # should print "Wrote N posts to …"
   ```

4. **Schedule it** (`crontab -e` as root):

   ```cron
   17 * * * * /usr/local/bin/instagram_sync.py >> /var/log/instagram_sync.log 2>&1
   ```

## Notes

- The token renews itself weekly (the token file's modification time records
  the last renewal). If the job stops running for 60+ days the token expires —
  generate a new one (step 2) and paste it in again.
- Instagram image URLs expire after a few days, which is why it runs hourly.
- Environment overrides: `IG_TOKEN_FILE`, `IG_OUT_FILE`, `IG_LIMIT` (default 12).
