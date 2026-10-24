// Security rule tests. Run with: npm run test:rules (starts the Firestore emulator).
import { test, before, after, beforeEach } from "node:test";
import { readFileSync } from "node:fs";
import { initializeTestEnvironment, assertSucceeds, assertFails } from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";

let env;
const LAB = "makerlab.comet@coe.iith.ac.in";
const as = (uid, email) => env.authenticatedContext(uid, { email, email_verified: true }).firestore();
const student = () => as("stu", "cs22btech11001@iith.ac.in");
const external = () => as("ext", "someone@gmail.com");
const lab = () => as("lab", LAB);
const ta = () => as("ta", "ta.one@iith.ac.in");
const anon = () => env.unauthenticatedContext().firestore();

const JID = "CMT-261024-AB12";
const job = (over = {}) => ({
  id: JID, uid: "stu", status: "awaiting", txn: "", shelf: "", total: 26, base: 13, mult: 2, hours: 1.5, grams: 20, created: 1,
  img: "", link: "", note: "", file: "bracket.stl", fits: true, fitMsg: "Fits", extra: "", band: "Under 2 h",
  settings: [{ label: "Material", value: "PLA" }], dims: [20, 30, 10], lines: [{ l: "PLA", d: "20 g", a: 13 }],
  user: { name: "Ananya", email: "cs22btech11001@iith.ac.in", roll: "CS22BTECH11001", role: "student" },
  machine: { key: "a1", code: "P-01", name: "Bambu Lab A1", tier: "A" }, log: [{ at: 1, by: "x", t: "Job generated" }], ...over,
});
const inDays = (d, h = 10) => { const t = new Date(); t.setDate(t.getDate() + d); t.setHours(h, 0, 0, 0); return t };
const isoOf = t => `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
const slot = (uid, role, d = 2, h = 10, machine = "a1") => {
  const t = inDays(d, h);
  return [`${machine}_${isoOf(t)}_${h}`, { uid, role, machine, date: isoOf(t), hour: h, start: Timestamp.fromDate(t), createdAt: Timestamp.now() }];
};

before(async () => {
  env = await initializeTestEnvironment({ projectId: "demo-comet", firestore: { rules: readFileSync("firestore.rules", "utf8"), host: "127.0.0.1", port: 8085 } });
});
after(() => env.cleanup());
beforeEach(() => env.clearFirestore());

/* users */
test("users: create own profile with the right role", async () => {
  await assertSucceeds(setDoc(doc(student(), "users/stu"), { name: "A", email: "cs22btech11001@iith.ac.in", role: "student", roll: "CS22", createdAt: 1 }));
  await assertSucceeds(setDoc(doc(external(), "users/ext"), { name: "B", email: "someone@gmail.com", role: "external", roll: "", createdAt: 1 }));
});
test("users: can't claim the student role with a non-IITH email", async () => {
  await assertFails(setDoc(doc(external(), "users/ext"), { name: "B", email: "someone@gmail.com", role: "student", roll: "", createdAt: 1 }));
});
test("users: subdomains like coe.iith.ac.in count as IITH", async () => {
  await assertSucceeds(setDoc(doc(lab(), "users/lab"), { name: "Lab", email: LAB, role: "student", roll: "", createdAt: 1 }));
});
test("users: can't write someone else's profile, or read it", async () => {
  await assertFails(setDoc(doc(external(), "users/stu"), { name: "X", email: "someone@gmail.com", role: "external", roll: "", createdAt: 1 }));
  await env.withSecurityRulesDisabled(c => setDoc(doc(c.firestore(), "users/stu"), { name: "A" }));
  await assertFails(getDoc(doc(external(), "users/stu")));
  await assertSucceeds(getDoc(doc(lab(), "users/stu")));
});

/* jobs */
test("jobs: student creates own awaiting job", async () => {
  await assertSucceeds(setDoc(doc(student(), `jobs/${JID}`), job()));
});
test("jobs: can't create a job already marked paid, or for someone else, or with the wrong rate", async () => {
  await assertFails(setDoc(doc(student(), `jobs/${JID}`), job({ status: "verified" })));
  await assertFails(setDoc(doc(student(), `jobs/${JID}`), job({ txn: "123456" })));
  await assertFails(setDoc(doc(external(), `jobs/${JID}`), job()));
  await assertFails(setDoc(doc(external(), `jobs/${JID}`), job({ uid: "ext", user: { name: "B", email: "someone@gmail.com", role: "student" } })));
  await assertFails(setDoc(doc(anon(), `jobs/${JID}`), job()));
});
test("jobs: students can't attach an upload or mark emails themselves", async () => {
  await assertFails(setDoc(doc(student(), `jobs/${JID}`), job({ upload: { fileId: "x" } })));
  await assertFails(setDoc(doc(student(), `jobs/${JID}`), job({ emailSent: true })));
  await env.withSecurityRulesDisabled(c => setDoc(doc(c.firestore(), `jobs/${JID}`), job()));
  await assertFails(updateDoc(doc(student(), `jobs/${JID}`), { upload: { fileId: "x" } }));
  await assertFails(updateDoc(doc(lab(), `jobs/${JID}`), { upload: { fileId: "x" } }));
});
test("jobs: crafted jobs that could inject code into the Admin page are refused", async () => {
  const bad = (o, id = JID) => assertFails(setDoc(doc(student(), "jobs", id), job({ id, ...o })));
  await bad({}, '<img src=x onerror=alert(1)>');
  await bad({}, "CMT-1");
  await bad({ machine: { key: "a1", code: "<img src=x onerror=alert(1)>", name: "A1", tier: "A" } });
  await bad({ machine: { key: "a1", code: "P-01", name: "A1", tier: "X\" onmouseover=\"" } });
  await bad({ img: 'x" onerror="alert(1)' });
  await bad({ img: 'data:image/jpeg;base64,AAAA" onerror="alert(1)' });
  await bad({ link: "javascript:alert(1)" });
  await bad({ link: 'https://x.com/" onclick="alert(1)' });
  await bad({ hours: "lots" });
  await bad({ total: -5 });
  await bad({ extraField: 1 });
  await bad({ user: { name: "A", email: "cs22btech11001@iith.ac.in", roll: "R", role: "student", isAdmin: true } });
  await assertSucceeds(setDoc(doc(student(), "jobs", JID), job({ img: "data:image/jpeg;base64,/9j/4AAQSkZJRg==", link: "https://drive.google.com/file/d/abc/view" })));
});
test("jobs: owner and admins can read, others can't", async () => {
  await env.withSecurityRulesDisabled(c => setDoc(doc(c.firestore(), `jobs/${JID}`), job()));
  await assertSucceeds(getDoc(doc(student(), `jobs/${JID}`)));
  await assertSucceeds(getDoc(doc(lab(), `jobs/${JID}`)));
  await assertFails(getDoc(doc(external(), `jobs/${JID}`)));
  await assertFails(getDoc(doc(anon(), `jobs/${JID}`)));
});
test("jobs: only admins mark paid; students can't change their own job", async () => {
  await env.withSecurityRulesDisabled(c => setDoc(doc(c.firestore(), `jobs/${JID}`), job()));
  await assertFails(updateDoc(doc(student(), `jobs/${JID}`), { status: "verified", txn: "412345678901" }));
  await assertSucceeds(updateDoc(doc(lab(), `jobs/${JID}`), { status: "verified", txn: "412345678901", verifiedBy: LAB, verifiedAt: 2 }));
  await assertFails(updateDoc(doc(lab(), `jobs/${JID}`), { total: 1 }));
  await assertFails(deleteDoc(doc(lab(), `jobs/${JID}`)));
});

test("jobs: staff queue the pickup email (emailSent false) but can't fake it as sent", async () => {
  await env.withSecurityRulesDisabled(c => setDoc(doc(c.firestore(), `jobs/${JID}`), job({ status: "printing" })));
  await assertSucceeds(updateDoc(doc(lab(), `jobs/${JID}`), { status: "ready", shelf: "B3", emailSent: false }));
  await assertFails(updateDoc(doc(lab(), `jobs/${JID}`), { emailSent: true }));
  await assertFails(updateDoc(doc(lab(), `jobs/${JID}`), { emailedAt: 5 }));
  await assertFails(updateDoc(doc(student(), `jobs/${JID}`), { emailSent: false }));
});

/* admins */
test("admins: TAs get access only once listed, and only admins see the list", async () => {
  await assertFails(getDoc(doc(ta(), "config/admins")));
  await assertSucceeds(setDoc(doc(lab(), "config/admins"), { emails: ["ta.one@iith.ac.in"] }));
  await assertSucceeds(getDoc(doc(ta(), "config/admins")));
  await assertFails(getDoc(doc(student(), "config/admins")));
  await assertFails(getDoc(doc(anon(), "config/admins")));
  await assertFails(setDoc(doc(student(), "config/admins"), { emails: ["cs22btech11001@iith.ac.in"] }));
  await env.withSecurityRulesDisabled(c => setDoc(doc(c.firestore(), `jobs/${JID}`), job()));
  await assertSucceeds(updateDoc(doc(ta(), `jobs/${JID}`), { status: "verified", txn: "412345678901" }));
});
test("admins: only the lab account can add or remove staff, not other admins", async () => {
  await env.withSecurityRulesDisabled(c => setDoc(doc(c.firestore(), "config/admins"), { emails: ["ta.one@iith.ac.in"] }));
  await assertFails(setDoc(doc(ta(), "config/admins"), { emails: ["ta.one@iith.ac.in", "friend@iith.ac.in"] }));
  await assertFails(setDoc(doc(ta(), "config/admins"), { emails: [] }));
  await assertSucceeds(setDoc(doc(lab(), "config/admins"), { emails: [] }));
});

/* bookings */
// Booking is switched off: firestore.rules refuses new bookings. The old tests are
// kept below (commented) for when it's switched back on.
test("bookings: no new bookings while booking is switched off", async () => {
  const [id, data] = slot("stu", "student");
  await assertFails(setDoc(doc(student(), "bookings", id), data));
});
/*
test("bookings: anyone can see slots; a signed-in user books a free future slot", async () => {
  const [id, data] = slot("stu", "student");
  await assertSucceeds(setDoc(doc(student(), "bookings", id), data));
  await assertSucceeds(getDoc(doc(anon(), "bookings", id)));
});
test("bookings: no double booking, no booking for others, no past or far-future slots", async () => {
  const [id, data] = slot("stu", "student");
  await env.withSecurityRulesDisabled(c => setDoc(doc(c.firestore(), "bookings", id), data));
  await assertFails(setDoc(doc(external(), "bookings", id), { ...data, uid: "ext", role: "external" }));
  const [id2, d2] = slot("stu", "student", 3);
  await assertFails(setDoc(doc(external(), "bookings", id2), d2));
  const [id3, d3] = slot("ext", "external", -1);
  await assertFails(setDoc(doc(external(), "bookings", id3), d3));
  const [id4, d4] = slot("ext", "external", 20);
  await assertFails(setDoc(doc(external(), "bookings", id4), d4));
  const [, d5] = slot("ext", "external", 4);
  await assertFails(setDoc(doc(external(), "bookings", "a1_2099-01-01_10"), d5)); // ID doesn't match the slot
});
*/
test("bookings: owner cancels a future slot; others can't", async () => {
  const [id, data] = slot("stu", "student");
  await env.withSecurityRulesDisabled(c => setDoc(doc(c.firestore(), "bookings", id), data));
  await assertFails(deleteDoc(doc(external(), "bookings", id)));
  await assertSucceeds(deleteDoc(doc(student(), "bookings", id)));
});

/* everything else */
test("unknown collections are closed", async () => {
  await assertFails(setDoc(doc(student(), "secrets/x"), { a: 1 }));
  await assertFails(getDoc(doc(anon(), "secrets/x")));
});
