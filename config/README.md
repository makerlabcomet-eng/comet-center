# Editing the website's content

Everything that changes over time is in this `config` folder. You can edit it on GitHub in your browser. You don't need to install anything or know how to code.

| File | What's in it |
|---|---|
| [`settings.js`](settings.js) | Admin emails, the UPI ID for payments, job desk hours, the IITH email domain, booking hours |
| [`machines.js`](machines.js) | Every machine: name, specs, rules, safety steps, **SOP folder link**, **videos** |
| [`pricing.js`](pricing.js) | Material prices per kg, multipliers by job length, consumable costs, machine sizes for the cost estimator |

## How to make a change

1. Sign in to GitHub with the lab account.
2. Open the repo, then the `config` folder, then the file you want.
3. Click the **pencil icon** (Edit this file) at the top right of the file.
4. Make your change. Use **Ctrl+F** to find the machine or setting.
5. Click **Commit changes…**. Write a short note about what you changed, for example "Add SOP link for Bambu A1". Leave **Commit directly to the main branch** selected, then click **Commit changes**.
6. Wait about 2 minutes, then open the website and check your change. Press **Ctrl+F5** to skip the browser's cache.

## The four rules

1. **Only change text inside "double quotes", numbers, or `true`/`false`.**
2. **Don't delete commas, colons, brackets `[ ]` or braces `{ }`.** Every item in a list ends with a comma.
3. **Lines that start with `//` are notes.** The website ignores them.
4. **Numbers have no ₹ signs and no commas:** write `1200`, not `₹1,200`. Use a dot for decimals: `2.5`.

## Common changes

**Add or update an SOP.** Each machine links to its own **SOP folder** in the lab Drive (for example `SOP_Bamboo_A1`). To add or replace a document, put it in that folder. The website shows whatever is in the folder, so you don't need to edit anything here. New files take the folder's sharing setting.

To point a machine at a different folder: in Google Drive, right-click the folder → Share → set General access to **Anyone with the link** → Copy link. In `machines.js`, find the machine and paste the link between the quotes:

```js
sop: "https://drive.google.com/drive/folders/1AbCdEf...",
```

**Change a video.** Copy the YouTube link. The ID is the 11 characters after `watch?v=`. For `https://www.youtube.com/watch?v=pGc2QnFX4vE` the ID is `pGc2QnFX4vE`.

```js
videos: [
  { youtube: "pGc2QnFX4vE", title: "Bambu Lab A1 setup", channel: "3D Print Dood" },
  { youtube: "Pd6tnFklBk4", title: "Unbox and set up the A1", channel: "Micro Center" },
],
```

To add a video, copy a whole `{ youtube: ... },` line and paste it underneath, then change it. Keep the comma at the end.

**Mark a machine out of service.** In `machines.js`, change `status: "up",` to `status: "down",`. Use `"busy"` for In use.

**Add an admin (TA).** In `settings.js`:

```js
admins: [
  "makerlab.comet@coe.iith.ac.in",
  "new.ta@iith.ac.in",
],
```

**Change a material price.** In `pricing.js`, under `materials`, change the `pricePerKg` number.

**Put in the real UPI ID.** In `settings.js`, set `upiId` to the lab's UPI ID and change `placeholder: true` to `placeholder: false`.

## If something goes wrong

Every change is checked automatically on GitHub before it goes live.

- **Green ✔ next to your commit:** the change is live in about a minute.
- **Red ✖ next to your commit:** there's a mistake, and **the live site keeps the previous version**. Click the ✖, then **Details**, to see a message like:

  ```
  ✖ Found 1 problem in the config files:
    • machines.js: line 88: Unexpected string. Usually a missing comma, quote or bracket on that line or the line above.
  ```

  Open the file, go to that line, fix it and commit again.

**To undo a change completely:** open the file on GitHub → **History** → click the commit → **⋯** → **Revert**. Or ask someone to do it.

## What you can't change here

- **Adding a brand-new machine** needs a developer, because each machine has a hand-built 3D model.
- **The machine-finder questions** on the home page are tied to how recommendations are worked out, so they live in `index.html`.
