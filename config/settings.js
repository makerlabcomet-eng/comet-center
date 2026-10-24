/* =====================================================================
   COMET CENTER · LAB SETTINGS
   ---------------------------------------------------------------------
   General settings for the website: who the admins are, how students
   pay, desk hours and booking rules.

   HOW TO EDIT (no coding needed)
   • Only change the text between "double quotes", numbers, or true/false.
   • Keep every comma, colon, bracket [ ] and brace { } where it is.
   • Lines starting with // are notes. The website ignores them.
   • See config/README.md for step-by-step help.
===================================================================== */

window.COMET_SETTINGS = {

  /* -------------------------------------------------------------------
     ADMINS are not set here. Sign in to the website as
     makerlab.comet@coe.iith.ac.in (always an admin), open Admin, and use
     "Staff access" to add or remove TAs. The database enforces it.
     ------------------------------------------------------------------- */

  /* -------------------------------------------------------------------
     IITH ACCOUNTS
     Emails ending in this domain, or any part of it (coe.iith.ac.in,
     cse.iith.ac.in …), count as IITH and get the IITH price.
     If you ever change this, firestore.rules must change too (ask a
     developer), or IITH users will be blocked from saving jobs.
     ------------------------------------------------------------------- */
  iithDomain: "iith.ac.in",

  /* -------------------------------------------------------------------
     PAYMENT
     The UPI QR code on every job sheet pays this account.
       upiId:       the lab's UPI ID, e.g. "cometcenter@sbi"
       payeeName:   the name the student's UPI app shows
       placeholder: keep true until the real UPI ID is in. While true,
                    the job sheet stamps "SAMPLE QR · DO NOT PAY" on
                    the QR. Set it to false once upiId is real.
     ------------------------------------------------------------------- */
  payment: {
    upiId: "comet-center-placeholder@invalid",
    payeeName: "Comet Center IITH",
    placeholder: true,
  },

  /* -------------------------------------------------------------------
     JOB DESK
     When students bring their job sheet to pay. Shown on the home page,
     the job sheet PDF, My jobs and the Admin page.
     ------------------------------------------------------------------- */
  jobDesk: {
    hours: "9–10 AM",
  },

  /* -------------------------------------------------------------------
     BOOKING
     firstHour / lastHour: the first and last one-hour slots, 24-hour clock.
                           9 and 20 mean slots from 9:00 to 21:00.
     daysAhead:            how many days students can see and book,
                           counting today.
     ------------------------------------------------------------------- */
  booking: {
    firstHour: 9,
    lastHour: 20,
    daysAhead: 7,
  },
};
