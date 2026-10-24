/**
 * Comet Center: job file uploads.
 *
 * Runs in Google Apps Script on the lab account (makerlab.comet@coe.iith.ac.in),
 * deployed as a web app that "Anyone" can reach. When a student generates a job,
 * the website sends their STL/OBJ/DXF here in small parts. The script checks the
 * student's sign-in and that the job is theirs, then saves the file to the lab Drive:
 *
 *   Comet Center upload test / 2026-10-24 / CMT-261024-AB12 / bracket.stl
 *
 * It writes the Drive file onto the job so staff can download it from the Admin page.
 * Once a day it deletes files 30 days after the job is collected or cancelled
 * (or 30 days after creation if never paid). Every hour it shares the folder with
 * the staff list from the Admin page.
 *
 * Free: no Firebase Blaze plan needed. Setup steps: docs/file-uploads.md
 */

// ---------------- settings (safe to edit) ----------------
var PROJECT_ID = 'comet-center-iith';
var API_KEY = 'AIzaSyCvXKVFxMlDnzyOisEwFevvOfi2xDiqIqQ'; // the website's public Firebase key (config/firebase.js)
var ROOT_NAME = 'Comet Center upload test';               // the Drive folder everything goes in
var KEEP_DAYS = 30;
// ---------------------------------------------------------

var BASE = 'https://firestore.googleapis.com/v1/projects/' + PROJECT_ID + '/databases/(default)/documents';
var MAX_PARTS = 12;                 // 3 MB each, so about 36 MB after compression
var UNZIP_LIMIT = 45 * 1024 * 1024; // bigger originals are saved still compressed (.gz)
var DAY = 24 * 60 * 60 * 1000;

/** Run this once by hand: it asks for permission and starts the daily and hourly jobs. */
function setup() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (['cleanupUploads', 'shareWithStaff'].indexOf(t.getHandlerFunction()) >= 0) ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('cleanupUploads').timeBased().everyDays(1).atHour(3).create();
  ScriptApp.newTrigger('shareWithStaff').timeBased().everyHours(1).create();
  rootFolder();
  shareWithStaff();
  Logger.log('Set up. Uploads go to "' + ROOT_NAME + '". Cleanup runs daily, staff sharing every hour.');
}

function doGet() {
  return out({ ok: true, service: 'Comet Center uploads' });
}

/**
 * One part of a file. The website sends:
 *   { idToken, jobId, session, i, n, name, size, gz, data }
 * data is base64; every part except the last is a whole number of 3-byte groups,
 * so the parts join back together as one base64 string.
 */
function doPost(e) {
  try {
    var p = JSON.parse(e.postData.contents);
    var name = String(p.name || '').replace(/[\\\/:*?"<>|]+/g, '_').slice(0, 120);
    if (!/^CMT-[A-Z0-9-]{4,30}$/.test(p.jobId || '')) throw new Error('Bad job ID.');
    if (!/^[a-z0-9]{6,20}$/.test(p.session || '')) throw new Error('Bad upload session.');
    if (!(p.n >= 1 && p.n <= MAX_PARTS && p.i >= 0 && p.i < p.n && p.i % 1 === 0 && p.n % 1 === 0)) throw new Error('The file is too big to upload. Paste a Google Drive link instead.');
    if (!/\.(stl|obj|dxf)$/i.test(name)) throw new Error('Only STL, OBJ and DXF files can be uploaded.');
    if (typeof p.data !== 'string' || !/^[A-Za-z0-9+\/=]*$/.test(p.data)) throw new Error('Bad file data.');

    var user = checkUser(p.idToken);
    var job = getJob(p.jobId);
    if (!job) throw new Error('Job ' + p.jobId + ' was not found.');
    if (job.uid !== user.uid) throw new Error('This job belongs to another account.');
    if (job.upload) throw new Error('This job already has a file.');
    if (job.status === 'collected' || job.status === 'cancelled') throw new Error('This job is closed.');

    var incoming = folderAt([ROOT_NAME, '_incoming']);
    var key = p.jobId + '_' + p.session + '_';
    removeFiles(incoming.getFilesByName(key + p.i)); // a retried part replaces the old one
    incoming.createFile(key + p.i, p.data, MimeType.PLAIN_TEXT);
    if (p.i < p.n - 1) return out({ ok: true, done: false });

    // Last part: join the parts, unpack and save
    var parts = [], files = [];
    for (var k = 0; k < p.n; k++) {
      var it = incoming.getFilesByName(key + k);
      if (!it.hasNext()) throw new Error('Part ' + (k + 1) + ' of the upload is missing. Try again.');
      var f = it.next();
      files.push(f);
      parts.push(f.getBlob().getDataAsString());
    }
    var blob = Utilities.newBlob(Utilities.base64Decode(parts.join('')), 'application/octet-stream', name);
    parts = null;
    var packed = !!p.gz;
    if (packed && p.size <= UNZIP_LIMIT) {
      blob.setContentType('application/x-gzip');
      blob = Utilities.ungzip(blob);
      packed = false;
    }
    blob.setName(packed ? name + '.gz' : name);

    var day = Utilities.formatDate(new Date(job.created || Date.now()), 'Asia/Kolkata', 'yyyy-MM-dd');
    var dir = folderAt([ROOT_NAME, day, p.jobId]);
    var saved = dir.createFile(blob);
    var upload = { fileId: saved.getId(), folderId: dir.getId(), name: saved.getName(), size: saved.getSize(), gz: packed, at: Date.now() };
    updateJob(p.jobId, { upload: upload }, 'File uploaded · ' + upload.name + ' (' + mb(upload.size) + ')', 'Student');
    files.forEach(function (f) { removeFile(f.getId()) });
    return out({ ok: true, done: true, upload: upload });
  } catch (err) {
    return out({ ok: false, error: String(err && err.message || err) });
  }
}

/** Daily: deletes files that are past the 30 days, and leftover parts of failed uploads. */
function cleanupUploads() {
  var now = Date.now(), removed = 0;
  findUploadedJobs().forEach(function (j) {
    if (j.fileDeletedAt) return;
    var from = null;
    if (j.status === 'collected' || j.status === 'cancelled') {
      (j.log || []).forEach(function (l) { if (/^(Collected|Cancelled)/.test(l.t || '')) from = l.at });
      if (!from) from = j.created;
    } else if (j.status === 'awaiting') {
      from = j.created; // never paid
    }
    if (!from || now - from < KEEP_DAYS * DAY) return;
    try { DriveApp.getFolderById(j.upload.folderId).setTrashed(true) } catch (e) { /* already gone */ }
    updateJob(j.id, { fileDeletedAt: now }, 'Uploaded file deleted (' + KEEP_DAYS + ' days)', 'Cleanup script');
    removed++;
  });
  var incoming = folderAt([ROOT_NAME, '_incoming']), files = incoming.getFiles();
  while (files.hasNext()) {
    var f = files.next();
    if (now - f.getDateCreated().getTime() > DAY) removeFile(f.getId());
  }
  Logger.log('Cleanup done. Deleted files of ' + removed + ' job(s).');
}

/** Hourly: the folder is shared (view and download) with exactly the staff on the Admin page. */
function shareWithStaff() {
  var doc = call('get', BASE + '/config/admins', null, true);
  var staff = doc && doc.fields ? fromFirestore({ mapValue: { fields: doc.fields } }).emails || [] : [];
  staff = staff.map(function (s) { return String(s).toLowerCase() });
  var root = rootFolder(), me = root.getOwner().getEmail().toLowerCase();
  var have = root.getViewers().map(function (u) { return u.getEmail().toLowerCase() });
  staff.forEach(function (s) {
    if (s !== me && have.indexOf(s) < 0) {
      try { root.addViewer(s) } catch (e) { Logger.log('Could not share with ' + s + ': ' + e) }
    }
  });
  have.forEach(function (s) {
    if (staff.indexOf(s) < 0) { try { root.removeViewer(s) } catch (e) { } }
  });
}

// ---------------- Firestore and sign-in ----------------
function checkUser(idToken) {
  if (!idToken) throw new Error('Sign in again, then retry.');
  var res = UrlFetchApp.fetch('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' + API_KEY, {
    method: 'post', contentType: 'application/json', muteHttpExceptions: true,
    payload: JSON.stringify({ idToken: idToken })
  });
  var u = res.getResponseCode() === 200 && (JSON.parse(res.getContentText()).users || [])[0];
  if (!u || !u.emailVerified) throw new Error('Your sign-in has expired. Sign in again, then retry.');
  return { uid: u.localId, email: u.email };
}
function getJob(id) {
  var d = call('get', BASE + '/jobs/' + encodeURIComponent(id), null, true);
  return d && d.fields ? fromFirestore({ mapValue: { fields: d.fields } }) : null;
}
function findUploadedJobs() {
  var res = call('post', BASE + ':runQuery', {
    structuredQuery: { from: [{ collectionId: 'jobs' }], orderBy: [{ field: { fieldPath: 'upload.at' }, direction: 'ASCENDING' }], limit: 1000 }
  });
  return res.filter(function (r) { return r.document }).map(function (r) {
    return fromFirestore({ mapValue: { fields: r.document.fields } });
  });
}
/** Sets fields on a job and adds a line to its history. */
function updateJob(id, fields, logText, by) {
  var f = {};
  Object.keys(fields).forEach(function (k) { f[k] = toFirestore(fields[k]) });
  call('post', BASE + ':commit', {
    writes: [{
      update: { name: 'projects/' + PROJECT_ID + '/databases/(default)/documents/jobs/' + id, fields: f },
      updateMask: { fieldPaths: Object.keys(fields) },
      updateTransforms: [{ fieldPath: 'log', appendMissingElements: { values: [toFirestore({ at: Date.now(), by: by, t: logText })] } }],
      currentDocument: { exists: true }
    }]
  });
}

// ---------------- Drive ----------------
function rootFolder() {
  var props = PropertiesService.getScriptProperties(), id = props.getProperty('rootId');
  if (id) { try { var f = DriveApp.getFolderById(id); if (!f.isTrashed()) return f } catch (e) { } }
  var it = DriveApp.getRootFolder().getFoldersByName(ROOT_NAME);
  var root = it.hasNext() ? it.next() : DriveApp.getRootFolder().createFolder(ROOT_NAME);
  props.setProperty('rootId', root.getId());
  return root;
}
/** Finds or makes nested folders. Locked so two uploads at once don't make the same folder twice. */
function folderAt(path) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var dir = rootFolder();
    for (var i = 1; i < path.length; i++) {
      var it = dir.getFoldersByName(path[i]);
      dir = it.hasNext() ? it.next() : dir.createFolder(path[i]);
    }
    return dir;
  } finally {
    lock.releaseLock();
  }
}
// Upload parts are deleted for good (not to the bin), so they don't use up the Drive space.
function removeFile(id) { try { Drive.Files.remove(id) } catch (e) { try { DriveApp.getFileById(id).setTrashed(true) } catch (e2) { } } }
function removeFiles(it) { while (it.hasNext()) removeFile(it.next().getId()) }

// ---------------- helpers ----------------
function call(method, url, payload, allow404) {
  var res = UrlFetchApp.fetch(url, {
    method: method, contentType: 'application/json', muteHttpExceptions: true,
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() },
    payload: payload ? JSON.stringify(payload) : undefined
  });
  var code = res.getResponseCode();
  if (allow404 && code === 404) return null;
  if (code >= 300) throw new Error('Firestore ' + code + ': ' + res.getContentText().slice(0, 300));
  return JSON.parse(res.getContentText() || '{}');
}
function out(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
function mb(n) { return (n / 1048576).toFixed(n < 10485760 ? 1 : 0) + ' MB' }
function fromFirestore(v) {
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return v.doubleValue;
  if ('booleanValue' in v) return v.booleanValue;
  if ('nullValue' in v) return null;
  if ('timestampValue' in v) return v.timestampValue;
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(fromFirestore);
  if ('mapValue' in v) {
    var o = {}, f = v.mapValue.fields || {};
    Object.keys(f).forEach(function (k) { o[k] = fromFirestore(f[k]) });
    return o;
  }
  return null;
}
function toFirestore(x) {
  if (x === null || x === undefined) return { nullValue: null };
  if (typeof x === 'boolean') return { booleanValue: x };
  if (typeof x === 'number') return Number.isInteger(x) ? { integerValue: String(x) } : { doubleValue: x };
  if (typeof x === 'string') return { stringValue: x };
  if (Array.isArray(x)) return { arrayValue: { values: x.map(toFirestore) } };
  var fields = {};
  Object.keys(x).forEach(function (k) { fields[k] = toFirestore(x[k]) });
  return { mapValue: { fields: fields } };
}
