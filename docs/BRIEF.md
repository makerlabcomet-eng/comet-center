# Comet Center website: build brief for Claude Code

## What you're building

Comet Center is the fabrication and prototyping lab at IIT Hyderabad. This website is its student portal. Students use it to:

1. find the right machine for what they want to make
2. learn that machine through short lessons and a safety quiz
3. get a digital access pass for the machine
4. estimate the cost, time and material of a job by uploading their file
5. book machine time slots
6. (later) book a 1:1 mentor session and submit "print my part" requests

A working single-file prototype already exists: `reference/prototype.html`. **It is the source of truth for the design, content, interactions, machine data, wizard logic and cost formulas.** Your job is to turn it into a clean, maintainable, GitHub-ready project and connect a real free backend. Don't redesign it. Keep the look, copy and behaviour unless this brief says otherwise.

Machine posters (PDFs) are in `reference/posters/`. They're the source for machine specs and rules if anything in the prototype looks wrong.

## Hard constraints (non-negotiable)

- **Zero running cost.** No credit card anywhere. Every service must be on a free tier that needs no billing account.
- **No server to maintain.** It's a static site plus Firebase on the free **Spark** plan.
- **Firebase services allowed:** Authentication and Cloud Firestore only. Firebase Hosting is optional.
- **Firebase services NOT allowed:** Cloud Storage and Cloud Functions both need the paid Blaze plan. Don't use them, and don't write code that depends on them.
- **Static content** (machine data, lessons, pricing, images) lives in the repo. Lesson videos are links to YouTube or Google Drive.
- **Hosting:** GitHub Pages, deployed by a GitHub Actions workflow. Keep the build compatible with Firebase Hosting as an alternative.
- **Prefer free, well-known tools.** Add as few dependencies as possible.

## Audience and tone

The site has to be beginner friendly, student friendly, interactive, 3D and animated.
- Most users have never touched a CNC or a resin printer.
- Copy is plain, short and direct. Keep the prototype's voice.
- Respect `prefers-reduced-motion`.
- It must work well on phones at 360–400 px wide, with no horizontal scroll.

## Users and sign-in

There are three kinds of visitor:

| Role | How they sign in | What they can do |
|---|---|---|
| **IITH student / staff** | Google sign-in restricted to `@iith.ac.in` | Everything. Student pricing (lower multipliers). |
| **External** | Google sign-in with any Google account | Train, book, get quotes. External pricing (higher multipliers). |
| **Guest** | No sign-in | Browse machines, use the finder, use the cost estimator. Can't train, book or hold passes. |
| **Admin / lab staff** | Google sign-in, email listed in an admin allowlist | Everything above, plus the staff dashboard (see Phase 4). |

Implementation notes:
- Use Firebase Auth's Google provider with the `hd: "iith.ac.in"` custom parameter for the IITH button. **Also enforce the domain in Firestore security rules.** `hd` is only a UI hint.
- **Role** is `student` if the verified email ends with `@iith.ac.in`, otherwise `external`.
- **Roll number:** default it to the email local part, uppercased, and let the user edit it once on first sign-in.
- **Admin** is a Firestore doc `config/admins` with an `emails` array. Rules check `request.auth.token.email in get(...).data.emails`. Admins are never decided in client code alone.

## Tech stack

- **Vite + vanilla JavaScript (ES modules).** No framework unless you find a strong reason. If you do want one, explain why before switching.
- **three.js** from npm for all 3D: machine models, hero carousel and the cost estimator viewer.
- **Firebase Web SDK v10+ (modular)**: `firebase/app`, `firebase/auth`, `firebase/firestore`.
- **CSS:** plain CSS with the prototype's tokens (`--ink`, `--haz` and so on). Split it into files or keep one; your call.
- **Routing:** hash-based (`#bay`, `#machine/a1`, `#cost`, `#book`, `#passes`) so GitHub Pages works without server rewrites. Deep links must work on refresh.
- **Tests:** Vitest for the pure logic: file parsers, the estimate function, the machine-finder decision function and the pricing band lookup.
- **Linting:** ESLint and Prettier with default configs.

## Suggested repo structure

```
comet-center/
├─ index.html
├─ src/
│  ├─ main.js                 # boot, router
│  ├─ styles/                 # tokens.css, base.css, components.css
│  ├─ data/
│  │  ├─ machines.js          # all 15 machines (from prototype MACHINES)
│  │  ├─ wizard.js            # questions + decide()
│  │  └─ pricing.js           # PRICING + EST config, the ONLY place rates live
│  ├─ estimator/
│  │  ├─ parsers.js           # parseSTL, parseOBJ, parseDXF
│  │  ├─ geometry.js          # meshStats, dxfStats
│  │  ├─ estimate.js          # estimate(): pure function, no DOM
│  │  └─ samples.js           # built-in sample parts
│  ├─ three/
│  │  ├─ models.js            # BUILD.* procedural machine models
│  │  ├─ renderers.js         # hero, shared thumbnail renderer, viewer
│  │  └─ estimatorView.js
│  ├─ firebase/
│  │  ├─ config.js            # reads from import.meta.env
│  │  ├─ auth.js
│  │  └─ db.js                # bookings, passes, progress helpers
│  └─ views/                  # home, bay, machine, train, cost, book, passes, admin
├─ firestore.rules
├─ firestore.indexes.json
├─ firebase.json              # rules deploy + optional hosting
├─ .env.example               # VITE_FIREBASE_* keys
├─ .github/workflows/deploy.yml
├─ reference/                 # prototype.html, posters/
├─ tests/
└─ README.md
```

Firebase web config keys aren't secret, but keep them in `.env` / repo secrets anyway and document this in `.env.example` and the README.

## Features to carry over from the prototype (Phase 1)

Port everything below. Behaviour should match the prototype.

1. **Home:** hero with a rotating 3D machine carousel (click opens the machine), a facts ticker, the five-step journey, the machine-finder wizard (four questions, then a recommendation with a 3D model) and the three access levels.
2. **Machine bay:** a grid of all 15 machines with a live 3D thumbnail each. Filter chips: 3D printing / Machining / Cutting / Robotics & joining. Each card shows status (free, in use, out of service) and whether the user holds a pass. **Use one shared WebGL renderer for all thumbnails, as the prototype does.** Browsers cap WebGL contexts at about 16.
3. **Machine station card:** large draggable 3D viewer, pre-start steps, a "stop immediately if" warning, facts, specs, allowed and never lists, and buttons to train, estimate and book.
4. **Training:** lessons, each with a video slot, marked complete one by one. Once all are complete, a quiz where every answer must be right. Passing issues an access pass with this ID format: `COMET-<CODE>-<ROLL>`.
5. **Cost estimator:** see the full spec below.
6. **Booking:** see Phase 2.
7. **My passes:** upcoming bookings (with cancel), training progress per machine, and issued pass cards.
8. **Sign-in modal:** the three options described above.

### Machines (15)

| Code | Machine | Access level |
|---|---|---|
| P-01 | Bambu Lab A1 | Self run |
| P-02 | Prusa Core One+ | Induction first |
| P-03 | Prusa XL | Induction first |
| P-04 | ELEGOO OrangeStorm Giga | Induction first |
| P-05 | Garuda3D GF500 | Induction first |
| P-06 | ELEGOO Saturn 4 Ultra 16K | Induction first |
| P-07 | B9 Elite Micro | Induction first |
| W-01 | CNC mill (BFW XTRON-433) | Induction first |
| W-02 | CNC simulator | Self run |
| W-03 | Waterjet (OMAX ProtoMAX) | Induction first |
| W-04 | CNC router | Induction first |
| W-05 | CNC lathe | Induction first |
| W-06 | Wire EDM | Staff run only |
| W-07 | FANUC robot arm cell | Induction first |
| W-08 | Laser welder | Staff run only |

Full content (specs, steps, rules, facts, lessons, quizzes) is in the prototype's `MACHINES` object. Move it to `src/data/machines.js` unchanged.

## Cost estimator spec (keep the prototype's behaviour exactly)

The estimator is **formula-based, not a real slicer.** That's intentional. It must run instantly, entirely in the browser, and the file must never be uploaded anywhere.

**Inputs**
- Machine.
- File:
  - STL (binary and ASCII) or OBJ for the 3D printers, mill and lathe.
  - DXF for the waterjet, router and wire EDM.
  - Drag-and-drop or picker, maximum 200 MB.
- Pricing tier: IITH student or external. Default it from the signed-in role.
- Material, chosen from the machine's list.
- File units: mm, cm or inch.
- Copies.
- FDM only: infill, layer height and supports.
- Resin only: layer height and hollow or solid.
- Sheet and EDM only: thickness.

**Geometry**
- **Volume** from the signed tetrahedron sum.
- **Surface area** from summed triangle areas.
- **Bounding box** from min and max coordinates.
- **DXF:** total cut length, the bounding box, and the number of contours (outlines) via union-find on endpoints. Handles LINE, ARC, CIRCLE, LWPOLYLINE (including bulges), POLYLINE/VERTEX, ELLIPSE and SPLINE. It reads `$INSUNITS`.

**Estimate per machine kind.** The formulas are in the prototype's `estimate()`. Keep them as they are.
- **FDM:** shell (area × 2.5 × nozzle) + interior × infill + support allowance gives the volume. Grams = volume × density. Time = volume ÷ flow rate + 1.5 s per layer.
- **Giga:** up to four copies print at once, one per head and tile.
- **Resin:** time depends only on layer count. Copies per plate are worked out from the footprint. Hollow parts use a 2 mm wall.
- **Mill:**
  - Stock = bounding box + 3 mm per side, rounded up to 5 mm.
  - Time = removed volume ÷ material removal rate + area ÷ finishing rate + 30 min setup.
  - Cutter wear is charged per cutting minute.
- **Lathe:**
  - Turned about the longest axis.
  - Bar stock is rounded to 5 mm.
  - Time is worked out the same way as the mill.
- **Router:**
  - Cut length × passes ÷ feed rate.
  - Sheet = bounding box + 10 mm.
  - Cutter wear per minute.
- **Waterjet:**
  - Speed scales with thickness, `v6 × (6/t)^1.15`, capped at 2540 mm/min.
  - Pierce time per contour.
  - Abrasive charged per minute.
- **Wire EDM:**
  - Cut area = cut length × thickness, divided by the cutting rate.
  - Wire charged per metre.
- Each estimate checks whether the part fits the machine's build volume, travel or bed.

**Pricing rule.** This is the core business logic. Put it in `pricing.js` and make it easy to edit.

```
price = (material + consumables) × multiplier
```

| Job time | IITH student | External |
|---|---|---|
| up to 6 h | × 2 | × 3 |
| 6–12 h | × 2.5 | × 3.5 |
| 12–24 h | × 3 | × 4 |
| over 24 h | × 4 | × 5 |

**All material rates are placeholders.** The lab will supply real per-machine material costs later. They must live in one clearly commented object, and the UI must say rates are placeholders and the final price is confirmed at the desk.

The lathe (Ø150 × 300 mm) and router (900 × 600 × 25 mm) capacities are also placeholders until confirmed.

**Outputs**
- **Big total** with a count-up animation.
- **Time, material and fit tiles.**
- **Line-item breakdown table.**
- **Rate ladder** with the active cell highlighted.
- **Notes.**
- **3D preview** with Three.js:
  - The part sits inside the build volume, which is drawn as a wireframe: green if the part fits, red if not.
  - It's drawn inside a translucent stock block (mill), bar (lathe) or sheet (cutting), with the DXF cut path drawn on the sheet.
  - Orbit by dragging, zoom with the mouse wheel.
- **Buttons:**
  - "Book N h on <machine>" prefills the booking page.
  - "Copy quote" copies with a clipboard fallback.
- **On first load,** every machine type shows a built-in sample part so the page never looks empty.
- **Wrong file type for the machine:** show a clear message plus a "use the sample" button. If a file is dropped on a machine that can't take it, auto-switch to a machine that can and show a toast.

## Phase 2: Firebase backend

This replaces every `localStorage` use in the prototype. The prototype saves bookings, passes and progress only on one device, so nobody else sees them.

### Firestore data model

```
users/{uid}
  name, email, role: "student"|"external", roll, createdAt

progress/{uid}_{machineKey}
  uid, machine, lessons: [0,1,2], passed: bool, passId, passedAt

bookings/{machineKey}_{YYYY-MM-DD}_{HH}
  uid, name, role, machine, date, hour, createdAt, status: "booked"|"cancelled"|"done"|"no-show"

machineStatus/{machineKey}
  status: "up"|"busy"|"down", note, updatedAt, updatedBy

config/admins
  emails: [...]

config/pricing   (optional, Phase 4)
  overrides for material rates, so staff can update without a redeploy
```

**One document per hourly slot,** with a deterministic ID. That makes double booking impossible: creating a doc that already exists fails. Booking several hours is a batched write.

### Security rules

Write `firestore.rules` and unit-test them with the Firebase emulator (`@firebase/rules-unit-testing`).
- **users:** a signed-in user can create and update only their own doc. `role` must match the email domain, so a user can't set themselves to `student`.
- **progress:** a user can read and write only their own docs. `passed: true` can't be set from the client without the lesson array being complete. Quiz checking stays client-side for now; note this as a known limit in the README.
- **bookings:**
  - Anyone signed in can read; guests can read too, so they see availability.
  - Create is allowed only if:
    - the doc doesn't exist yet
    - `uid == request.auth.uid`
    - the date is within the next 14 days
    - the hour is between 9 and 20
    - the role in the doc matches the email
  - Students cancel only their own bookings, and only while the slot is in the future.
  - Admins can update any booking.
- **machineStatus:** everyone can read; only admins can write.
- **config:** everyone can read pricing; only admins can write. Only admins can read `admins`.
- **Everything else** is denied.

### Client

- The booking grid uses a live `onSnapshot` query (`machine == X && date == D`). Slots taken by others show "Booked". The user's own slots show "Yours".
- Remove the prototype's fake `exampleTaken()` data.
- Machine status on cards comes from `machineStatus`, also live.
- Stay inside free-tier limits (50,000 reads and 20,000 writes a day):
  - query only the selected day and machine
  - unsubscribe listeners on view change
  - don't listen to whole collections

## Phase 3: deploy

- Write a GitHub Actions workflow that builds with Vite and deploys to GitHub Pages on every push to `main`. Firebase config comes from repo secrets.
- Set Vite's `base` correctly for a project page (`/comet-center/`). Make it configurable for a custom domain later.
- **README** must cover:
  - what the project is
  - local dev (`npm i`, `npm run dev`, emulators)
  - **step-by-step Firebase setup on the free Spark plan** with the lab's Google account: create the project, enable Google sign-in, create Firestore, deploy rules, add the authorised domain for GitHub Pages, set up the admin allowlist
  - how to edit machines, lessons and prices
  - how to deploy
  - a "never enable Blaze" warning

## Phase 4: next features (build after 1–3 work end to end)

1. **Staff dashboard** (admins only):
   - today's and the week's bookings per machine
   - mark done or no-show
   - set machine status
   - look up a student's passes by roll number
   - sign off Induction-first passes (adds `inductedBy` and `inductedAt`)
2. **1:1 mentor booking:**
   - a `mentors` collection with name, expertise and weekly slots
   - same slot-per-doc pattern as machine bookings
3. **"Print my part" request:**
   - The student fills a form: machine, material, copies, the estimate (auto-attached from the estimator), and **a Google Drive share link to their file.**
   - We can't host uploads, because Firebase Storage needs the paid plan.
   - Requests go into a `requests` collection with statuses `submitted → accepted → printing → ready → collected`.
   - Staff update the status from the dashboard; the student sees it under My passes.
4. **Pass verification page:** `#verify/<passId>` shows whether a pass is valid, so staff can scan the QR on a pass card. Generate a real QR with a small free library.
5. **Pricing overrides** from `config/pricing`, so staff can change rates without a code change.
6. 3MF support in the estimator (optional).

## Quality bar

- Small, readable modules.
- No logic duplicated between views.
- Pure functions for estimate, parsing and pricing, all unit-tested. Use the prototype's sample parts as test fixtures and assert the same numbers the prototype produces.
- Lighthouse on mobile: performance 80+, accessibility 90+. Lazy-load three.js models below the fold, and pause render loops for canvases that are off screen or hidden.
- Keyboard accessible, with a visible focus state.
- All errors are shown in plain language that says what went wrong and how to fix it.
- No secrets committed. `.env` stays in `.gitignore`.

## How to work

1. Start by reading `reference/prototype.html` fully. Then propose the file structure and a short plan before writing code.
2. Do Phase 1 first and check it matches the prototype visually and functionally. Then Phase 2, then Phase 3.
3. Use the Firebase Local Emulator Suite during development, so nothing touches the real project until it's set up.
4. Commit in small, logical steps with clear messages.
5. Ask me before adding any paid service, any new major dependency, or changing the design direction.
6. When something needs my action (Firebase console steps, GitHub repo settings, secrets), stop and give me exact click-by-click steps.

## Open items I'll supply later

- Real material rates per machine.
- Confirmed lathe and router capacities.
- Confirmed access level for each printer.
- Lesson video links.
- The admin email list.
- The lab's Firebase project config.
