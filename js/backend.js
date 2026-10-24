// Comet Center backend: Firebase Authentication (Google sign-in) and Cloud Firestore.
// Loaded as a module by index.html. Exposes window.Backend for the page script.
// Spark (free) plan only: no Cloud Storage, no Cloud Functions.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged,
  connectAuthEmulator, signInWithCredential, browserLocalPersistence, setPersistence,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  getFirestore, connectFirestoreEmulator, doc, getDoc, setDoc, updateDoc, deleteDoc,
  collection, query, where, orderBy, limit, onSnapshot, writeBatch, arrayUnion,
  serverTimestamp, Timestamp, getCountFromServer,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const CFG = window.COMET_FIREBASE || {};
const LAB_ADMIN = "makerlab.comet@coe.iith.ac.in";
// Local testing against the Firebase emulators: open the site with ?emulator=1
const EMU = /^(127\.0\.0\.1|localhost)$/.test(location.hostname) && new URLSearchParams(location.search).has("emulator");

const B = (window.Backend = { ready: false, emulator: EMU, error: null });

if (!CFG.apiKey && !EMU) {
  B.error = "not-configured";
} else {
  const app = initializeApp(EMU ? { apiKey: "demo-key", projectId: "demo-comet", authDomain: "localhost" } : CFG);
  const auth = getAuth(app), db = getFirestore(app);
  if (EMU) { connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true }); connectFirestoreEmulator(db, "127.0.0.1", 8085) }
  setPersistence(auth, browserLocalPersistence).catch(() => {});

  const iithRe = () => {
    const d = String((window.COMET_SETTINGS || {}).iithDomain || "iith.ac.in").toLowerCase().replace(/\./g, "\\.");
    return new RegExp("@([a-z0-9-]+\\.)*" + d + "$");
  };
  const roleOf = email => (iithRe().test(String(email).toLowerCase()) ? "student" : "external");

  /* ---------- auth ---------- */
  let current = null, userCbs = [];
  const emit = () => userCbs.forEach(cb => cb(current));
  B.onUser = cb => { userCbs.push(cb); if (B.authKnown) cb(current) };

  async function checkAdmin(email) {
    if (email === LAB_ADMIN) return true;
    try { await getDoc(doc(db, "config", "admins")); return true } // only admins may read it
    catch (e) { return false }
  }
  onAuthStateChanged(auth, async fbUser => {
    if (!fbUser) { current = null; B.authKnown = true; emit(); return }
    const email = (fbUser.email || "").toLowerCase();
    let profile = null;
    try { const s = await getDoc(doc(db, "users", fbUser.uid)); profile = s.exists() ? s.data() : null } catch (e) { console.warn("profile read failed", e) }
    current = {
      uid: fbUser.uid, email, role: roleOf(email),
      name: (profile && profile.name) || fbUser.displayName || email.split("@")[0],
      roll: profile ? profile.roll : (roleOf(email) === "student" ? email.split("@")[0].toUpperCase() : ""),
      needsProfile: !profile, isAdmin: await checkAdmin(email),
    };
    B.authKnown = true; emit();
  });

  // kind: "student" (IITH button) or "external"
  B.signIn = async kind => {
    const p = new GoogleAuthProvider();
    p.setCustomParameters({ prompt: "select_account" });
    const res = await signInWithPopup(auth, p);
    const email = (res.user.email || "").toLowerCase();
    if (kind === "student" && roleOf(email) !== "student") {
      await signOut(auth);
      throw new Error(`${email} isn't an IITH account. Use your @…iith.ac.in Google account, or choose "From outside IITH".`);
    }
    return roleOf(email);
  };
  // Emulator only: sign in as any email without a Google popup (used by tests).
  if (EMU) B.testSignIn = (email, name) => signInWithCredential(auth, GoogleAuthProvider.credential(JSON.stringify({ sub: "test-" + email, email, email_verified: true, name })));
  // A short-lived proof of who is signed in, checked by the upload script.
  B.idToken = () => auth.currentUser ? auth.currentUser.getIdToken() : Promise.reject(new Error("Sign in first."));
  B.signOut = () => signOut(auth);
  B.saveProfile = async ({ name, roll }) => {
    const u = auth.currentUser; if (!u) throw new Error("Sign in first.");
    const ref = doc(db, "users", u.uid), email = (u.email || "").toLowerCase();
    const s = await getDoc(ref);
    if (s.exists()) await updateDoc(ref, { name, roll });
    else await setDoc(ref, { name, email, role: roleOf(email), roll, createdAt: serverTimestamp() });
    Object.assign(current, { name, roll, needsProfile: false }); emit();
  };

  /* ---------- jobs ---------- */
  // Firestore can't store lists inside lists, so settings [["Material","PLA"], …]
  // are saved as [{label, value}, …] and turned back on read.
  const toDoc = job => ({ ...job, settings: (job.settings || []).map(([label, value]) => ({ label, value: String(value) })) });
  // Jobs are written by the student's browser, so a crafted one could hold anything.
  // Coerce every field to the type the page expects; the page still escapes all text.
  const txt = (v, max = 300) => (typeof v === "string" ? v : v == null ? "" : String(v)).slice(0, max);
  const num = v => (typeof v === "number" && isFinite(v) ? v : 0);
  const fromDoc = d => {
    const u = d.user || {}, m = d.machine || {};
    return {
      ...d,
      id: txt(d.id, 40), status: txt(d.status, 20), created: num(d.created),
      user: { name: txt(u.name, 80), email: txt(u.email, 120), roll: txt(u.roll, 30), role: u.role === "external" ? "external" : "student" },
      machine: { key: txt(m.key, 20), code: txt(m.code, 20), name: txt(m.name, 80), tier: ["A", "B", "C"].includes(m.tier) ? m.tier : "A" },
      file: txt(d.file, 200), link: txt(d.link, 500), note: txt(d.note, 300), fitMsg: txt(d.fitMsg), extra: txt(d.extra), band: txt(d.band, 60),
      txn: txt(d.txn, 40), shelf: txt(d.shelf, 40), verifiedBy: txt(d.verifiedBy, 120),
      settings: (Array.isArray(d.settings) ? d.settings : []).slice(0, 20).map(s => Array.isArray(s) ? [txt(s[0], 40), txt(s[1], 80)] : [txt(s && s.label, 40), txt(s && s.value, 80)]),
      dims: (Array.isArray(d.dims) ? d.dims : []).slice(0, 3).map(num),
      lines: (Array.isArray(d.lines) ? d.lines : []).slice(0, 20).map(l => ({ l: txt(l && l.l, 80), d: txt(l && l.d), a: num(l && l.a) })),
      log: (Array.isArray(d.log) ? d.log : []).map(l => ({ at: num(l && l.at), by: txt(l && l.by, 120), t: txt(l && l.t) })),
      hours: num(d.hours), grams: num(d.grams), base: num(d.base), mult: num(d.mult), total: num(d.total),
      fits: d.fits === true, verifiedAt: num(d.verifiedAt), emailedAt: num(d.emailedAt),
      // only a real JPEG data URL is ever put in an <img src>
      img: typeof d.img === "string" && /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(d.img) ? d.img : "",
    };
  };
  B.createJob = job => setDoc(doc(db, "jobs", job.id), { ...toDoc(job), uid: auth.currentUser.uid });
  B.watchMyJobs = (uid, cb, onErr) => onSnapshot(query(collection(db, "jobs"), where("uid", "==", uid)),
    s => cb(s.docs.map(d => fromDoc(d.data())).sort((a, b) => b.created - a.created)), onErr);
  // Replaced by watchOpenJobs + watchRecentJobs, so open jobs never drop off the Admin list:
  // B.watchAllJobs = (cb, onErr) => onSnapshot(query(collection(db, "jobs"), orderBy("created", "desc"), limit(500)),
  //   s => cb(s.docs.map(d => fromDoc(d.data()))), onErr);
  // Every job still in progress, however old. There are only ever a few dozen.
  B.watchOpenJobs = (cb, onErr) => onSnapshot(query(collection(db, "jobs"), where("status", "in", ["awaiting", "verified", "printing", "ready"])),
    s => cb(s.docs.map(d => fromDoc(d.data()))), onErr);
  // The newest n jobs of any status; the Admin page raises n with "Load older jobs".
  B.watchRecentJobs = (n, cb, onErr) => onSnapshot(query(collection(db, "jobs"), orderBy("created", "desc"), limit(n)),
    s => cb(s.docs.map(d => fromDoc(d.data()))), onErr);
  // Totals without downloading the jobs (1 read per 1,000 jobs counted).
  B.countJobs = async () => {
    const jobs = collection(db, "jobs");
    const [all, collected] = await Promise.all([getCountFromServer(jobs), getCountFromServer(query(jobs, where("status", "==", "collected")))]);
    return { all: all.data().count, collected: collected.data().count };
  };
  B.updateJob = (id, patch, logEntry) => updateDoc(doc(db, "jobs", id), { ...patch, log: arrayUnion(logEntry) });

  /* ---------- bookings ---------- */
  const slotId = (m, date, h) => `${m}_${date}_${h}`;
  const startOf = (date, h) => { const [y, mo, d] = date.split("-").map(Number); return Timestamp.fromDate(new Date(y, mo - 1, d, h)) };
  B.watchSlots = (machine, date, cb, onErr) => onSnapshot(query(collection(db, "bookings"), where("machine", "==", machine), where("date", "==", date)),
    s => cb(s.docs.map(d => d.data())), onErr);
  B.watchMyBookings = (uid, cb, onErr) => onSnapshot(query(collection(db, "bookings"), where("uid", "==", uid)),
    s => cb(s.docs.map(d => ({ id: d.id, ...d.data() }))), onErr);
  B.book = async (machine, date, hours) => {
    const u = auth.currentUser, email = (u.email || "").toLowerCase(), batch = writeBatch(db);
    hours.forEach(h => batch.set(doc(db, "bookings", slotId(machine, date, h)),
      { uid: u.uid, role: roleOf(email), machine, date, hour: h, start: startOf(date, h), createdAt: serverTimestamp() }));
    await batch.commit();
  };
  B.cancelBookings = async ids => { const batch = writeBatch(db); ids.forEach(id => batch.delete(doc(db, "bookings", id))); await batch.commit() };

  /* ---------- staff list ---------- */
  B.labAdmin = LAB_ADMIN;
  B.getAdmins = async () => { const s = await getDoc(doc(db, "config", "admins")); return s.exists() ? (s.data().emails || []) : [] };
  B.setAdmins = emails => setDoc(doc(db, "config", "admins"), { emails, updatedAt: serverTimestamp(), updatedBy: auth.currentUser.email });

  B.ready = true;
}
// Tell the page the backend module has loaded (or failed to configure).
window.dispatchEvent(new Event("backend-ready"));
