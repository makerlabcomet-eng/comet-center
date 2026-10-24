# Job file uploads: one-time setup

When a student generates a job, the website uploads their STL, OBJ or DXF file to the lab Google Drive. Staff then download it from the job on the Admin page. Files are saved like this:

```
Comet Center upload test / 2026-10-24 / CMT-261024-AB12 / bracket.stl
                           job date     job ID            the student's file
```

A Google Apps Script on the lab account does the saving for free. It's the **Upload test** project, the same one used for the upload test, so its web link stays the same. Firebase's free plan has no file storage.

## Set it up (about 5 minutes, once)

Do this signed in **only** as **makerlab.comet@coe.iith.ac.in**. An Incognito window with just that account avoids "Access denied".

1. Open https://script.google.com and open the **Upload test** project.
2. **Show the settings file** if it isn't showing: click the **gear icon (Project Settings)** on the left and tick **Show "appsscript.json" manifest file in editor**. Go back with the **< >** icon.
3. **Paste the settings.** Open `appsscript.json`, delete everything in it, and paste [`tools/apps-script/uploads/appsscript.json`](../tools/apps-script/uploads/appsscript.json).
4. **Paste the script.** Open `Code.gs`, delete everything in it, and paste [`tools/apps-script/uploads/Uploads.gs`](../tools/apps-script/uploads/Uploads.gs).
5. Click **Save** (the disk icon).
6. **Run the setup.** In the function menu at the top, pick **setup**, then click **Run**. Allow the permissions: **Review permissions** → the lab account → **Advanced → Go to Upload test (unsafe)** → **Allow**. The log shows **"Set up. Uploads go to …"**.
7. **Publish the new version, keeping the same link.** Click **Deploy → Manage deployments**. Click the **pencil** icon, set **Version** to **New version**, keep **Who has access: Anyone**, and click **Deploy**.

Don't use **Deploy → New deployment** for this. That makes a new link, and the website would keep calling the old one. If that happens, copy the new `/exec` link into `uploads.url` in `config/settings.js`.

## Check it works

1. Sign in on the website as a student, price a part in the cost estimator, and click **Generate your job**.
2. The job box shows **Uploading your file… %**, then **File uploaded**. My jobs shows **✓ File uploaded**.
3. On the Admin page, open the job. **Uploaded file** has **Download** and **Open in Drive** links.
4. In the lab Drive, the file is in **Comet Center upload test / date / job ID /**.

## How it works

- **Compression:** the browser compresses the file (STLs shrink 3–5×) and sends it in 3 MB parts with a progress bar. The script unpacks it, so Drive holds the normal `.stl`/`.dxf`. Originals over about 45 MB are kept compressed as `.stl.gz`; open them with Windows **Extract all** or 7-Zip.
- **Size limit:** the limit is **30 MB after compression** (about a 100 MB STL), set by `uploads.maxMB` in `config/settings.js`. Bigger files need a Google Drive link in the job box.
- **Checks:** the script only saves a file when the sign-in is valid and the job belongs to that account. It refuses a second file for the same job, and closed jobs.
- **If an upload fails:** the job is still saved. My jobs shows **Retry upload**; the student picks the same file again.
- **Staff access:** every hour the folder is shared (view and download) with the staff list on the Admin page. Removed staff lose access within the hour. The lab account owns everything.

## Automatic cleanup

Once a day (around 3 AM) the script deletes a job's folder:
- 30 days after the job is **collected** or **cancelled**, or
- 30 days after it was **created**, if it was never paid.

Jobs that are paid, printing or ready to collect keep their files. Deleted folders go to the lab Drive's **Bin**, where Google keeps them 30 more days before removing them for good. The job's history notes "Uploaded file deleted". Parts of failed uploads are removed after a day.

## If something goes wrong

- **Students see "The lab's upload service isn't set up yet":** step 7 wasn't done, or the website points at another link. Check `uploads.url` in `config/settings.js`.
- **Other errors:** open the script → **Executions** (left side) to see them.
- **Turn uploads off:** set `url: ""` under `uploads` in `config/settings.js`. Students then paste a Drive link as before.
- **Change how long files are kept:** edit `KEEP_DAYS` at the top of the script, click **Save**, then repeat step 7.
