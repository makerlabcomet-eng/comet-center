// Checks the files in config/ for mistakes and explains them in plain words.
// Runs on GitHub after every change (see .github/workflows/deploy.yml).
// Run it yourself with:  node tools/check-config.js
const fs = require("fs"), path = require("path"), vm = require("vm");
const dir = path.join(__dirname, "..", "config");
const errors = [], warnings = [];
const err = (file, msg) => errors.push(`${file}: ${msg}`);
const warn = (file, msg) => warnings.push(`${file}: ${msg}`);

// Machines that have a 3D model in index.html. A new key needs a developer.
const MODEL_KEYS = ["a1", "core", "xl", "giga", "garuda", "saturn", "b9", "mill", "sim", "waterjet", "router", "lathe", "edm", "robot", "weld"];
const KINDS = ["fdm", "resin", "mill", "lathe", "sheet", "edm"];

function load(name, global) {
  const file = path.join(dir, name), sandbox = { window: {} };
  let code;
  try { code = fs.readFileSync(file, "utf8") } catch (e) { err(name, "file is missing"); return null }
  try { vm.runInNewContext(code, sandbox, { filename: name }) }
  catch (e) {
    const where = (e.stack || "").match(new RegExp(name.replace(".", "\\.") + ":(\\d+)"));
    err(name, `${where ? "line " + where[1] + ": " : ""}${e.message}. Usually a missing comma, quote or bracket on that line or the line above.`);
    return null;
  }
  if (!sandbox.window[global]) { err(name, `doesn't set window.${global}. The first line of settings was changed.`); return null }
  return sandbox.window[global];
}
const isStr = v => typeof v === "string";
const isNum = v => typeof v === "number" && isFinite(v);
const strList = (f, where, v) => { if (!Array.isArray(v) || v.some(x => !isStr(x))) err(f, `${where} must be a list of "text" items in [ ]`) };

/* ---------- settings.js ---------- */
const S = load("settings.js", "COMET_SETTINGS");
if (S) {
  const f = "settings.js";
  if (!Array.isArray(S.admins) || !S.admins.length) err(f, "admins must list at least one email");
  else S.admins.forEach(e => { if (!isStr(e) || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) err(f, `admins: "${e}" isn't a valid email`) });
  if (!isStr(S.iithDomain) || !/^[a-z0-9.-]+\.[a-z]+$/i.test(S.iithDomain)) err(f, "iithDomain must look like \"iith.ac.in\"");
  const p = S.payment || {};
  if (!isStr(p.upiId) || !p.upiId.includes("@")) err(f, "payment.upiId must look like \"name@bank\"");
  if (!isStr(p.payeeName) || !p.payeeName) err(f, "payment.payeeName is empty");
  if (typeof p.placeholder !== "boolean") err(f, "payment.placeholder must be true or false (no quotes)");
  if (p.placeholder === false && /placeholder|invalid/i.test(p.upiId || "")) err(f, "payment.placeholder is false but upiId is still the placeholder");
  if (!S.jobDesk || !isStr(S.jobDesk.hours) || !S.jobDesk.hours) err(f, "jobDesk.hours is empty");
  const b = S.booking || {};
  if (![b.firstHour, b.lastHour].every(h => Number.isInteger(h) && h >= 0 && h <= 23)) err(f, "booking.firstHour and lastHour must be whole hours from 0 to 23");
  else if (b.firstHour > b.lastHour) err(f, "booking.firstHour is later than lastHour");
  if (!Number.isInteger(b.daysAhead) || b.daysAhead < 1 || b.daysAhead > 30) err(f, "booking.daysAhead must be a whole number from 1 to 30");
}

/* ---------- machines.js ---------- */
const M = load("machines.js", "COMET_MACHINES");
if (M) {
  const f = "machines.js", fams = M.families || {}, codes = {};
  if (!M.machines) err(f, "the machines list is missing");
  Object.entries(M.machines || {}).forEach(([k, m]) => {
    const w = `machine "${k}"`;
    if (!MODEL_KEYS.includes(k)) err(f, `${w} has no 3D model in the website. Adding a machine needs a developer.`);
    ["code", "name", "model", "summary", "goodFor", "stopIf"].forEach(x => { if (!isStr(m[x]) || !m[x].trim()) err(f, `${w}: ${x} is empty`) });
    if (codes[m.code]) err(f, `${w}: code ${m.code} is also used by "${codes[m.code]}"`); codes[m.code] = k;
    if (!fams[m.family]) err(f, `${w}: family "${m.family}" must be one of ${Object.keys(fams).map(x => `"${x}"`).join(", ")}`);
    if (!["self", "induction", "staff"].includes(m.access)) err(f, `${w}: access must be "self", "induction" or "staff"`);
    if (!["up", "busy", "down"].includes(m.status)) err(f, `${w}: status must be "up", "busy" or "down"`);
    if (!m.specs || typeof m.specs !== "object" || Object.values(m.specs).some(v => !isStr(v))) err(f, `${w}: every spec value must be "text"`);
    ["allowed", "never", "steps", "facts"].forEach(x => strList(f, `${w}: ${x}`, m[x]));
    if (Array.isArray(m.facts) && m.facts.length < 2) warn(f, `${w}: add at least 2 facts so the home page ticker has something to show`);
    if (!isStr(m.sop)) err(f, `${w}: sop must be "" or a link in quotes`);
    else if (m.sop && !/^https:\/\//.test(m.sop)) err(f, `${w}: sop link must start with https://`);
    if (!Array.isArray(m.videos)) err(f, `${w}: videos must be a list in [ ]`);
    else m.videos.forEach((v, i) => {
      if (!v || !/^[A-Za-z0-9_-]{11}$/.test(v.youtube || "")) err(f, `${w}: video ${i + 1} youtube ID must be the 11 characters after "watch?v=", not the whole link`);
      if (!v || !isStr(v.title) || !v.title) err(f, `${w}: video ${i + 1} has no title`);
    });
    (m.quiz || []).forEach((x, i) => {
      if (!Array.isArray(x.answers) || !Number.isInteger(x.correct) || x.correct < 1 || x.correct > x.answers.length) err(f, `${w}: quiz question ${i + 1}: correct must be a number from 1 to ${(x.answers || []).length}`);
    });
  });
  MODEL_KEYS.forEach(k => { if (M.machines && !M.machines[k]) warn(f, `machine "${k}" was removed. Its 3D model and estimator entry stay unused.`) });
}

/* ---------- pricing.js ---------- */
const P = load("pricing.js", "COMET_PRICING");
if (P) {
  const f = "pricing.js";
  const bands = P.multipliers || [];
  if (!bands.length) err(f, "multipliers list is empty");
  bands.forEach((b, i) => {
    const last = i === bands.length - 1;
    if (last ? b.upToHours !== null : !isNum(b.upToHours)) err(f, `multiplier ${i + 1}: upToHours must be ${last ? "null (the last band covers everything longer)" : "a number of hours"}`);
    if (i && !last && isNum(b.upToHours) && b.upToHours <= bands[i - 1].upToHours) err(f, `multiplier ${i + 1}: upToHours must be bigger than the band before it`);
    if (!isNum(b.iith) || b.iith <= 0 || !isNum(b.external) || b.external <= 0) err(f, `multiplier ${i + 1}: iith and external must be numbers above 0`);
    if (!isStr(b.label) || !b.label) err(f, `multiplier ${i + 1}: label is empty`);
  });
  const mats = P.materials || {};
  Object.entries(mats).forEach(([n, v]) => {
    if (!v || !isNum(v.pricePerKg) || v.pricePerKg < 0) err(f, `material "${n}": pricePerKg must be a number (no ₹ sign, no commas)`);
    if (!v || !isNum(v.density) || v.density <= 0) err(f, `material "${n}": density must be a number above 0`);
  });
  const c = P.consumables || {};
  ["cutterPerMinute", "abrasivePerMinute", "edmWirePerMetre"].forEach(x => { if (!isNum(c[x]) || c[x] < 0) err(f, `consumables.${x} must be a number`) });
  Object.entries(P.estimator || {}).forEach(([k, e]) => {
    const w = `estimator "${k}"`;
    if (M && M.machines && !M.machines[k]) err(f, `${w} has no matching machine in machines.js`);
    if (!KINDS.includes(e.kind)) err(f, `${w}: kind was changed. Put it back.`);
    if (!Array.isArray(e.capacity) || e.capacity.some(x => !isNum(x) || x <= 0)) err(f, `${w}: capacity must be numbers in [ ]`);
    if (!Array.isArray(e.materials) || !e.materials.length) err(f, `${w}: materials list is empty`);
    else e.materials.forEach(n => {
      if (!mats[n]) err(f, `${w}: material "${n}" isn't in the materials list. Check the spelling, letter for letter.`);
      ["roughingRate", "finishingRate", "feedRate", "depthPerPass", "speedAt6mm", "cutRate"].forEach(r => { if (e[r] && !isNum(e[r][n])) err(f, `${w}: ${r} has no number for "${n}"`) });
    });
    if (e.layerHeights && e.defaultLayerHeight != null && !e.layerHeights.includes(e.defaultLayerHeight)) err(f, `${w}: defaultLayerHeight must be one of layerHeights`);
  });
}

/* ---------- report ---------- */
warnings.forEach(w => console.log("⚠ " + w));
if (errors.length) {
  console.log(`\n✖ Found ${errors.length} problem${errors.length > 1 ? "s" : ""} in the config files:\n`);
  errors.forEach(e => console.log("  • " + e));
  console.log("\nFix them on GitHub, or undo the last change (History → the commit → Revert). Help: config/README.md");
  process.exit(1);
}
console.log("✔ Config files look good.");
