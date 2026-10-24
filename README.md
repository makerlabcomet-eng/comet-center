# Comet Center

Student portal for **Comet Center**, the fabrication and prototyping lab at IIT Hyderabad.

**Live preview:** https://makerlabcomet-eng.github.io/comet-center/

> This is an early version shared for feedback. Material rates and the UPI payment details are placeholders.

## What it does

- **Find a machine:** a four-question finder recommends the right machine for your job.
- **Machine bay:** all 15 machines with live 3D models, specs, safety rules, SOP folders and videos.
- **Cost estimator:** drop an STL, OBJ or DXF file to estimate time, material and price. The file never leaves your browser.
- **Generate your job:** turns an estimate into a PDF job sheet with a UPI payment QR. Students pay at the job desk.
- **My jobs:** each student's job sheets and their status, live.
- **Admin:** the job desk for staff: record payments, move jobs through printing, export to Excel, manage staff access.
- Training/quiz/passes and slot booking are built but switched off for now (commented out in `index.html`).

## Changing content (no coding needed)

Machine details, SOP links, videos, prices, the UPI ID and desk hours all live in the [`config`](config) folder. Edit them on GitHub in your browser. [`config/README.md`](config/README.md) explains how, step by step. Every change is checked automatically, and a mistake never reaches the live site.

## Backend (Firebase, free Spark plan)

- **Sign-in:** Google accounts through Firebase Authentication. Any `…iith.ac.in` email gets the IITH rate; any other Google account is External.
- **Database:** Cloud Firestore (`comet-center-iith`, Mumbai). It holds `users`, `jobs` (generated job sheets) and `config/admins` (the staff list).
- **Who can do what** is decided by [`firestore.rules`](firestore.rules), not by the website. Students see only their own jobs; only staff can mark a job paid or change its status. `makerlab.comet@coe.iith.ac.in` is always an admin and adds TAs from the Admin page.
- The Firebase web keys in `config/firebase.js` are public by design. The rules protect the data.

> ⚠ **Never upgrade the project to the Blaze (pay-as-you-go) plan or add a billing account.** Everything here runs on the free Spark plan. Cloud Storage and Cloud Functions need Blaze, so the site doesn't use them. Two free Google Apps Scripts on the lab account do those jobs instead.

**Apps Scripts on the lab account** (set up once, then they run by themselves):
- **Pickup emails:** emails the student when a job is marked Ready to collect. Setup: [`docs/ready-email.md`](docs/ready-email.md).
- **File uploads:** saves each job's STL/OBJ/DXF to the lab Drive (`Comet Center upload test / date / job ID / file`) and deletes it 30 days after collection. Setup: [`docs/file-uploads.md`](docs/file-uploads.md).

**Deploying rule changes** (lab account): `firebase deploy --only firestore:rules`

**Testing locally:**

```
npm install
npm run emulators          # Firebase emulators for sign-in and the database
npx http-server . -p 8080  # in another terminal
```

Open http://127.0.0.1:8080/?emulator=1 to use the site against the emulators instead of the live database. Run the security rule tests with `npm run test:rules`.

**Known limit:** the quiz and price checks run in the browser. The job price shown on the sheet is confirmed by staff at the desk before payment.

## Giving feedback

Open an issue on this repo, or send your notes to the lab team. Screenshots help.

## Run it locally

It's a single HTML file. Serve the folder and open it in a browser:

```
npx http-server . -p 8080
```

Then go to http://127.0.0.1:8080.

## What's next

The build plan, including the Firebase backend and the staff dashboard, is in [`docs/BRIEF.md`](docs/BRIEF.md).
