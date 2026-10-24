/**
 * Comet Center: "ready to collect" emails.
 *
 * Runs in Google Apps Script on the lab account (makerlab.comet@coe.iith.ac.in),
 * so emails come from the lab's own address. Every minute it looks in Firestore
 * for jobs that staff moved to "Ready to collect", emails the student, and marks
 * the job as emailed so nobody gets the same email twice.
 *
 * Free: no Firebase Blaze plan needed. Setup steps: docs/ready-email.md
 */

// ---------------- settings (safe to edit) ----------------
var PROJECT_ID = 'comet-center-iith';
var LAB_NAME = 'Maker Lab, Comet Center, IIT Hyderabad';
var COLLECT_HOURS = '9–10 AM';
var SITE_URL = 'https://makerlabcomet-eng.github.io/comet-center/#dash';
var REPLY_TO = 'makerlab.comet@coe.iith.ac.in';
// ---------------------------------------------------------

var BASE = 'https://firestore.googleapis.com/v1/projects/' + PROJECT_ID + '/databases/(default)/documents';

/** Run this once by hand: it asks for permission and starts the every-minute check. */
function setup() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'sendReadyEmails') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('sendReadyEmails').timeBased().everyMinutes(1).create();
  sendReadyEmails();
  Logger.log('Set up. The script now checks for ready jobs every minute.');
}

/** Finds ready jobs that haven't been emailed yet, and emails each student. */
function sendReadyEmails() {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return; // the previous run is still going
  try {
    var jobs = findReadyJobs();
    jobs.forEach(function (job) {
      try {
        sendEmail(job);
        markEmailed(job.name, job.data.user.email);
      } catch (e) {
        Logger.log('Could not email ' + (job.data.id || job.name) + ': ' + e);
      }
    });
    if (jobs.length) Logger.log('Emailed ' + jobs.length + ' student(s).');
  } finally {
    lock.releaseLock();
  }
}

function findReadyJobs() {
  var body = {
    structuredQuery: {
      from: [{ collectionId: 'jobs' }],
      where: {
        compositeFilter: {
          op: 'AND',
          filters: [
            { fieldFilter: { field: { fieldPath: 'status' }, op: 'EQUAL', value: { stringValue: 'ready' } } },
            { fieldFilter: { field: { fieldPath: 'emailSent' }, op: 'EQUAL', value: { booleanValue: false } } }
          ]
        }
      },
      limit: 50
    }
  };
  var res = call('post', BASE + ':runQuery', body);
  return res.filter(function (r) { return r.document; }).map(function (r) {
    return { name: r.document.name, data: fromFirestore({ mapValue: { fields: r.document.fields } }) };
  });
}

function sendEmail(job) {
  var j = job.data, u = j.user || {}, m = j.machine || {};
  var first = String(u.name || 'there').split(' ')[0];
  var shelf = j.shelf ? ' from <b>' + esc(j.shelf) + '</b>' : '';
  var subject = 'Your print is ready to collect · ' + j.id;
  var html =
    '<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#1a1d24;max-width:560px">' +
    '<p>Hi ' + esc(first) + ',</p>' +
    '<p>Your job <b>' + esc(j.id) + '</b> is ready. Collect it' + shelf + ' at <b>' + esc(LAB_NAME) + '</b>, between <b>' + esc(COLLECT_HOURS) + '</b>.</p>' +
    '<table style="border-collapse:collapse;font-size:14px;margin:14px 0">' +
    row('Job', j.id) + row('Machine', (m.code || '') + ' · ' + (m.name || '')) + row('File', j.file) +
    (j.shelf ? row('Pickup shelf', j.shelf) : '') + row('Collect', COLLECT_HOURS + ', ' + LAB_NAME) +
    '</table>' +
    '<p>Bring your job sheet or tell staff your job ID. You can check the status any time under <a href="' + SITE_URL + '">My jobs</a>.</p>' +
    '<p>Thanks,<br>' + esc(LAB_NAME) + '</p>' +
    '<p style="font-size:12px;color:#6a7488">This email was sent automatically when your job was marked ready.</p></div>';
  var text = 'Hi ' + first + ',\n\nYour job ' + j.id + ' is ready. Collect it' + (j.shelf ? ' from ' + j.shelf : '') +
    ' at ' + LAB_NAME + ', between ' + COLLECT_HOURS + '.\n\nMachine: ' + (m.code || '') + ' ' + (m.name || '') +
    '\nFile: ' + (j.file || '') + '\n\nCheck the status any time: ' + SITE_URL + '\n\nThanks,\n' + LAB_NAME;
  MailApp.sendEmail({ to: u.email, subject: subject, body: text, htmlBody: html, name: 'Comet Center Maker Lab', replyTo: REPLY_TO });
}

/** Sets emailSent and adds a line to the job's history. */
function markEmailed(docName, to) {
  var now = Date.now();
  var body = {
    writes: [{
      update: { name: docName, fields: { emailSent: { booleanValue: true }, emailedAt: { integerValue: String(now) } } },
      updateMask: { fieldPaths: ['emailSent', 'emailedAt'] },
      updateTransforms: [{
        fieldPath: 'log',
        appendMissingElements: { values: [toFirestore({ at: now, by: 'Email script', t: 'Pickup email sent to ' + to })] }
      }],
      currentDocument: { exists: true }
    }]
  };
  call('post', BASE + ':commit', body);
}

// ---------------- helpers ----------------
function call(method, url, payload) {
  var res = UrlFetchApp.fetch(url, {
    method: method, contentType: 'application/json', muteHttpExceptions: true,
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() },
    payload: payload ? JSON.stringify(payload) : undefined
  });
  var code = res.getResponseCode();
  if (code >= 300) throw new Error('Firestore ' + code + ': ' + res.getContentText().slice(0, 300));
  return JSON.parse(res.getContentText() || '{}');
}
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
    Object.keys(f).forEach(function (k) { o[k] = fromFirestore(f[k]); });
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
  Object.keys(x).forEach(function (k) { fields[k] = toFirestore(x[k]); });
  return { mapValue: { fields: fields } };
}
function row(a, b) {
  return '<tr><td style="padding:4px 14px 4px 0;color:#6a7488">' + esc(a) + '</td><td style="padding:4px 0"><b>' + esc(b) + '</b></td></tr>';
}
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}
