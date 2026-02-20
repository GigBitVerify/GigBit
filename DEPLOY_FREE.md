# Free Deployment Plan (Web + App)

This setup keeps everything free:

- Web frontend/admin: Cloudflare Pages (free)
- Backend/API + PostgreSQL + Redis: Oracle Cloud Always Free VM (free)
- APK distribution: GitHub Releases (free direct APK download)

## 1) Deploy Backend + DB + Redis (Oracle Free VM)

1. Create Oracle Cloud Always Free account and VM (Ubuntu).
2. Open inbound ports in VM/network security list:
   - `22` (SSH)
   - `4000` (API)
   - `5433` and `6379` optional (only if you need external DB/Redis access)
3. SSH into VM and install Docker + Compose plugin.
4. Clone repo to VM:
   - `git clone <your-repo-url> && cd GigBit`
5. Start stack:
   - `docker compose up -d --build`
6. Verify:
   - `curl http://127.0.0.1:4000/health`

## 2) Deploy Web Frontend (Cloudflare Pages)

1. Push repo to GitHub.
2. In Cloudflare Pages:
   - Create project from GitHub repo.
   - Build command: leave empty.
   - Output directory: `web/frontend`.
3. Deploy.

## 3) Point Web to Deployed API

`landing.html` and `admin.html` now support API override via:

- localStorage key: `gigbit_admin_api_base`
- or meta tag: `<meta name="gigbit-api-base" content="https://your-api-domain">`

Recommended for deployment:

1. Edit:
   - `web/frontend/landing.html`
   - `web/frontend/admin.html`
2. Set:
   - `<meta name="gigbit-api-base" content="http://<your-vm-public-ip>:4000" />`
3. Re-deploy Cloudflare Pages.

## 4) Publish APK for Free

1. Build APK locally:
   - `cd app/frontend/flutter_app`
   - `flutter build apk --release`
2. Create a GitHub Release and upload APK asset.
3. Keep APK outside `web/frontend` (Cloudflare Pages has a 25 MiB per-file limit).
4. Use GitHub-hosted APK URL in landing page (already configured).

## 5) Keep Download Button Working

Current APK file location in repo:
- `app/releases/GigBit.apk`

When you generate a new APK, overwrite this file (or update button URL to your latest GitHub release asset).

## Notes

- Play Store publishing is not free (one-time fee), so direct APK distribution is the free path.
- Oracle Always Free capacity is limited; keep only required services running.
