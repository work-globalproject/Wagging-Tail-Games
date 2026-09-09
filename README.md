# Wagging Tail Games · V1

A dog-and-owner play app for iOS, Android and the web, built with React, TypeScript, Capacitor and Firebase.

## Develop and check

Use Node 22+ and npm. `package-lock.json` is now the shared lockfile; the old Bun lockfile was removed to avoid divergent installs between AI Studio, local work and CI.

```sh
npm ci
npm run dev
npm run lint
npm test
npm run build
```

`lint` is TypeScript checking. The unit suite covers per-account storage, explicit guest import boundaries, sync failures, calendar-day streaks, background timer elapsed time, and camera cleanup/permission denial.

Firebase configuration is in `firebase-applet-config.json` and includes a **named Firestore database**. Normal development connects to that configured project. To work entirely locally, start the emulators and set `VITE_USE_FIREBASE_EMULATORS=true` in `.env.local`; this switches to the isolated `demo-wagging-tail` project and default emulator database.

```sh
npx firebase emulators:start --config firebase.emulators.json --project demo-wagging-tail --only firestore,auth
npm run test:rules
```

The Firebase emulator needs Java 21+. The repository's ignored `.tools` directory may contain a local Java runtime used during development; it is not required or shipped. Browser tests use Chrome locally and Playwright Chromium in CI:

```sh
npx firebase emulators:exec --config firebase.emulators.json --project demo-wagging-tail --only firestore,auth "npm run test:e2e"
```

## Build mobile apps

```sh
npm run cap:sync
npm run cap:open:android
```

`cap:sync` builds with native mode (no web service worker) and refreshes both native projects. `npm run cap:open:ios` requires a Mac with Xcode. The iOS simulator CI job builds without signing; actual App Store archives need the publisher's Apple signing team.

Generated web bundles are excluded from Git. Run `npm run cap:sync` after checkout and after changing web source, before opening or building either native project.

The app includes native Preferences storage, Filesystem/Share export, local reminders and app lifecycle integration. Run `node scripts/native-icons.mjs` after changing `public/icon.svg` to refresh the branded native icon and splash assets.

## V1 behavior

- Eleven included activities, dog profile, visual instructions, timers, history and calendar-day streaks. No invented sessions or default streaks.
- Guest play without login. Email/password signup, password recovery and email verification for optional cloud backup.
- Separate local storage for each account and guest. Guest data only imports through the explicit Account action.
- Failed cloud writes remain local and do not gain a cloud-saved badge. Reconnect and manual retry are supported.
- Account deletion removes cloud session documents, the profile and the authentication account; the current account cache is cleared. Guest history and user-exported files remain separate.
- Photos and silent videos are temporary previews. Users export through the native share sheet or web download/share. Cloud history contains metadata, not media files.
- Opt-in daily local reminder. All included games are accessible without sharing.
- Branded native icons/splash, bundled fonts, safe-area spacing, labeled forms, dialog keyboard handling, and in-app privacy/support pages.

Three prototype activities involving DIY bottles, socks and raised hurdles are held back pending content review. The former unused share-card simulator and publishing tutorial in the player UI were removed.

## GitHub and Google AI Studio

Pull current GitHub changes before editing in either environment, review the diff, run checks, and push only the intended branch. Avoid simultaneous changes to the same files. A GitHub push does not deploy Firestore rules or submit an app to Apple.

`.github/workflows/validate.yml` checks TypeScript, tests, a web build, Firebase rules, mobile-sized browser journeys and an unsigned iOS simulator build. It must actually run on GitHub before its status can be treated as passed.

## Publishing

See [the App Store submission pack](release/APP_STORE.md) for reusable metadata, review notes, privacy details and the real-device checklist. Public HTTPS privacy/support URLs, publisher details, production Firebase verification, Apple signing, native device testing and final submission remain required. Local or browser checks do not establish App Store approval or native-device readiness.
