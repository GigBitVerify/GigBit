# GigBit Full App

Tech stack:
- App Frontend: Flutter (`app/frontend/flutter_app`)
- Web Frontend: Static HTML (`web/frontend`)
- Backend: Node.js + TypeScript (`web/backend/api`)
- Database schema: `web/database/schema.sql` (mirrored in `app/database/schema.sql`)
- Database: PostgreSQL (Docker)
- Cache: Redis (Docker)

## One-time setup status (done)
- Docker installed
- Flutter SDK installed at `C:\src\flutter`
- Android Studio installed
- API base URL in Flutter uses `http://127.0.0.1:4000` on Android (via `adb reverse` in `scripts/run-android.cmd`)

## One-time setup still required (Android SDK packages)
Android Studio is installed, but SDK components are not fully provisioned yet.

Do this once:
1. Open Android Studio.
2. Go to **More Actions > SDK Manager**.
3. Install:
   - Android SDK Platform (latest stable)
   - Android SDK Build-Tools (latest)
   - Android SDK Platform-Tools
   - Android SDK Command-line Tools (latest)
4. In terminal, run:
   - `C:\src\flutter\bin\flutter.bat doctor --android-licenses`
   - Accept all licenses.

## Run full stack
From project root (`C:\Users\Hemant\Desktop\Projects\GigBit`):

```bat
scripts\start-stack.cmd
```

This starts Postgres + Redis and ensures API is running on `http://127.0.0.1:4000`.

## Run Flutter on Android phone
Prerequisites:
- - USB debugging enabled.
- Phone connected once via USB and trusted.

Run:

```bat
scripts\run-android.cmd
```

## Manual commands (if needed)

```bat
docker compose up -d
npm install
npm run api:dev
```

```bat
cd app\frontend\flutter_app
C:\src\flutter\bin\flutter.bat pub get
C:\src\flutter\bin\flutter.bat run --dart-define=API_BASE_URL=http://127.0.0.1:4000
```
