# Deploy Now (Minimal Steps)

This is the fastest path to get web + APK globally accessible.

## A) One-time in this repo

1. Build APK (optional but recommended release build):
```bat
cd app\frontend\flutter_app
flutter build apk --release
cd ..\..\..
```

2. Prepare web files and copy APK:
```bat
scripts\prepare-web-release.cmd -ApiBaseUrl "https://YOUR-API-DOMAIN"
```

3. Push to GitHub:
```bat
git add .
git commit -m "Prepare production deploy"
git push
```

## B) Render (API + Postgres + Redis)

1. Create:
- Postgres (free)
- Redis (free)
- Web Service from this repo

2. Web Service settings:
- Root Directory: `web/backend/api`
- Build Command: `npm install && npm run build`
- Start Command: `npm run start`

3. Env vars:
- `PORT=4000`
- `JWT_SECRET=<long random secret>`
- `DATABASE_URL=<from Render Postgres>`
- `REDIS_URL=<from Render Redis>`
- `ADMIN_API_KEY=<your key>`
- SMTP vars (if using OTP email in production)

4. Confirm:
- `https://YOUR-API-DOMAIN/health` returns `status: ok`

## C) Cloudflare Pages (Web)

1. Create project from GitHub repo.
2. Build settings:
- Build command: *(empty)* or `exit 0`
- Output directory: `web/frontend`
3. Deploy.

## D) Verify

1. Open:
- `https://YOUR-WEB-DOMAIN/landing.html`
2. Click `Download APK`:
- should download `GigBit.apk`
3. Open admin page and verify API calls work.

## E) Update flow (every release)

1. Build new APK:
```bat
cd app\frontend\flutter_app
flutter build apk --release
cd ..\..\..
```
2. Refresh web APK + push:
```bat
scripts\prepare-web-release.cmd
git add web/frontend/GigBit.apk
git commit -m "Update APK"
git push
```
