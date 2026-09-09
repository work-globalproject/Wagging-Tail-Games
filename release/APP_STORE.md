# Wagging Tail Games — V1 submission pack

## Product scope

An English-language play companion for adult dog owners: guided activities, a dog profile, timers, session history, calendar-day streaks, optional daily device reminders, private camera moments and shareable story cards. Guest use is supported. Optional email/password accounts provide profile and session metadata backup through Firebase.

All included games are available without payment or sharing. V1 contains no ads, tracking SDK, purchase flow, public feed or direct messaging. Camera moments are silent and exported by the user; they are not cloud media storage. Three prototype activities involving DIY bottles, socks and raised hurdles are held back from the included catalog pending a content review.

## Validation record — September 9, 2026

Local checks passed: TypeScript, 14 unit/component tests, 6 Firestore security-rule tests, and 2 browser journeys at an iPhone-sized viewport. The journeys cover offline guest play and saved history, dialog dismissal and privacy access, and account creation, explicit guest import and account deletion against isolated Firebase emulators. Production web and native bundles build successfully; Capacitor synchronization succeeds for iOS and Android.

The browser screenshot in local test output is a layout preview, not an App Store screenshot. Signed archives, actual iOS/Android device behavior and production Firebase settings are not verified by these checks. GitHub's Mac build must be checked separately.

## App Store Connect copy

**Name:** Wagging Tail Games

**Subtitle:** Everyday play for you and pup

**Promotional text:** Make a little time for a lot of tail wags. Find guided games, follow your play routine and keep your favorite moments together.

**Description:**

Make everyday time together more playful. Wagging Tail Games helps you choose guided activities for your dog, from sniffing and discovery to gentle movement and problem-solving.

- Create a profile for your dog's size, energy and favorite rewards.
- Browse step-by-step games and visual guides.
- Start a play timer and log the time you spend together.
- Follow your history, daily goals and play streaks.
- Choose an optional daily reminder on your device.
- Capture silent clips or photos, then save or share a favorite moment.
- Make a personal story card from your dog's play stats.

Start as a guest. An optional email account backs up your profile and play history across devices. Photos and videos remain private device previews until you export them, and are not included in cloud backup. All included V1 games are available without sharing.

Always supervise play, choose suitable dog-safe materials and let your dog set the pace. Suggested games and times are not veterinary advice.

**Keywords:** dog,puppy,play,enrichment,training,bonding,pet,activity,tracker,timer

**Suggested category:** Lifestyle. Confirm the final category and age-rating questionnaire against the actual release build.

**Version:** 1.0.0, build 1. Increment the build number for each subsequent upload.

## Review notes

The primary features can be reviewed without an account. Complete the short dog profile setup, choose a game and start a timer. Finish the timer to see the session in Stats. Cloud backup uses optional email/password authentication. A reviewer can create a test account; the publisher should additionally provide a working review account if requested in App Store Connect.

Account deletion is available in Account → Delete account and cloud data. Password recovery is on the sign-in screen. Sharing opens the device share sheet; cancellation leaves the preview available. Camera video is silent. Local notification permission is requested only when the user enables a reminder. The app has no subscriptions, ads, social-login requirement or public user-generated-content feed.

## Privacy information to confirm

The checked-in native privacy manifest describes email, optional name, user ID, other user content (dog profile and session notes), and product interaction (play history and account activity totals), linked to the account and used for app functionality. No tracking is implemented. Camera media is processed on the device and not uploaded to the app's servers. Firebase operational processing must also be reviewed when completing App Store Connect's privacy questionnaire; the manifest is not a substitute for that questionnaire.

The bundled privacy and support pages are in `public/`. They must be available at stable public HTTPS URLs before submission. Their current contact route uses the existing creator Instagram link from the repository. The publisher must confirm its legal identity, a suitable direct support/data-request contact and the final privacy notice before release.

## Checks that require the publisher or Apple tooling

- Confirm Apple Developer membership, legal publisher name, support contact, bundle identifier ownership and App Store Connect app record.
- Run the checked-in iOS simulator workflow on GitHub or build on a Mac. A workflow file existing in the repository is not proof it has run.
- Select the signing team and archive using Xcode 26 or newer with the iOS 26 SDK or newer, as required for uploads since April 28, 2026.
- Deploy the reviewed Firestore rules to the **named database** in the configured Firebase project; local tests use a separate demo emulator project. Enable Email/Password authentication and verify email delivery, provider settings, authorized domains and password recovery against the release project.
- Host and verify the public privacy/support URLs, then enter them in App Store Connect.
- Complete the privacy, age-rating, availability, export-compliance, pricing and review-contact forms truthfully. No approval or answer has been inferred for the publisher.
- Run the device checklist below on TestFlight. Replace browser layout previews with genuine screenshots of the release running on iPhone/iPad, using the sizes App Store Connect requests.
- Submit only after reviewing the archive, screenshots and metadata.

## Real-device acceptance checklist

| Scenario | Expected result |
| --- | --- |
| Fresh install, guest setup | No sample sessions; zero streak; all included games available |
| Relaunch offline | Existing guest/account cache can be opened; cloud failure is visible |
| Timer: pause, resume, lock screen, return | Accurate active timer duration; no ticking after close |
| Sign in A, sign out, sign in B | No automatic movement of A's or guest history into B |
| Explicit guest import | No duplicate sessions; existing account profile preserved |
| Save while offline, reconnect | Local record remains; cloud badge appears only after successful upload |
| Password reset and email verification | Emails arrive and links work |
| Account deletion and retry | Profile, sessions and auth account removed; guest history remains separate |
| Camera permission allowed/denied | Real capture or useful fallback; no simulated photos or recordings |
| Close camera during permission prompt | Any late stream is released; no ongoing camera indicator |
| Export photo, silent video and story | Correct preview and format; cancellation does not claim a social post |
| Notifications allowed/denied/off | Correct time, no duplicate reminder; clear opt-out |
| Small iPhone, larger text, VoiceOver | Controls remain reachable; forms labeled; dialogs dismissible |
| iPad and rotation | No clipped modal actions or navigation |

## Primary references checked

- [Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) — account deletion, privacy, login services, metadata and review access.
- [Apple account deletion guidance](https://developer.apple.com/support/offering-account-deletion-in-your-app/).
- [Apple upload requirements](https://developer.apple.com/news/upcoming-requirements/).
- [Capacitor Preferences](https://capacitorjs.com/docs/apis/preferences) and [Filesystem](https://capacitorjs.com/docs/apis/filesystem) — persistent storage and required-reason API declarations.
- [RSPCA guidance on small parts](https://www.rspca.org.uk/adviceandwelfare/seasonal/christmas) and [AKC jumping guidance](https://www.akc.org/expert-advice/training/puppies-dogs-jump-safely/) — reasons to revise or hold back prototype activities.
