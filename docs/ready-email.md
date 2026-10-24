# "Ready to collect" emails: one-time setup

When staff move a job to **Ready to collect** on the Admin page, the student gets an email from `makerlab.comet@coe.iith.ac.in` saying their print is ready. The email has the job ID, machine, file, pickup shelf, and "collect from Maker Lab, Comet Center, IIT Hyderabad, 9–10 AM".

A small Google Apps Script sends it. It runs on the lab account for free and checks for ready jobs every minute, so the email arrives within a minute or two. Firebase's free plan can't send email itself.

## Set it up (about 5 minutes, once)

Do this signed in as **makerlab.comet@coe.iith.ac.in**.

1. Go to https://script.google.com and click **New project**.
2. Click **Untitled project** at the top and rename it **Comet Center ready emails**.
3. **Show the settings file.** Click the gear icon (**Project Settings**) on the left and tick **Show "appsscript.json" manifest file in editor**.
4. **Paste the settings.** Go back to the editor (**< >** icon). Open `appsscript.json`, delete everything in it, and paste the contents of [`tools/apps-script/appsscript.json`](../tools/apps-script/appsscript.json).
5. **Paste the script.** Open `Code.gs`, delete everything in it, and paste the contents of [`tools/apps-script/ReadyEmail.gs`](../tools/apps-script/ReadyEmail.gs).
6. Click **Save** (the disk icon).
7. **Run the setup.** In the function menu at the top, pick **setup**, then click **Run**.
8. **Allow the permissions.** Google asks for permission: **Review permissions** → choose the lab account → **Allow**. If you see "Google hasn't verified this app", click **Advanced → Go to Comet Center ready emails (unsafe)**. It's safe, because it's the lab's own script.
9. The log at the bottom shows **"Set up. The script now checks for ready jobs every minute."** That's it.

## Check it works

On the Admin page, move a test job to **Ready to collect**. Within two minutes:
- The student's inbox gets the email.
- The job on the Admin page shows **Pickup email sent**, and its history shows "Pickup email sent to …".

## Good to know

- **Each job is emailed once.** To send it again, open the job on the Admin page and click **Send it again**.
- **Changing the wording or pickup hours:** edit the settings at the top of the script (`COLLECT_HOURS`, `LAB_NAME`) on script.google.com and click **Save**.
- **If emails stop:** open the script → **Executions** (on the left) to see any errors. Running **setup** again restarts the every-minute check.
- **Limits:** Google Workspace accounts can send about 1,500 emails a day from Apps Script, far more than the lab needs.
- **Runs as the lab account:** the script reads and updates Firestore with the lab account's own permission (it owns the Firebase project). It only changes `emailSent`, `emailedAt` and the job history.
