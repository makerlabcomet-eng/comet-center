/* =====================================================================
   COMET CENTER · PRICES AND COST ESTIMATOR
   ---------------------------------------------------------------------
   Every number the cost estimator uses lives in this file.

   ⚠ ALL MATERIAL PRICES BELOW ARE PLACEHOLDERS until the lab fixes its
     price list. The website tells students the final price is confirmed
     at the desk.

   HOW THE PRICE IS WORKED OUT
     price = (material + consumables) × multiplier
     The multiplier depends on how long the job runs and who it's for.

   HOW TO EDIT (no coding needed)
   • Only change numbers, or text between "double quotes".
   • Use a dot for decimals (2.5, not 2,5). No ₹ signs, no commas in numbers.
   • Keep every comma, colon, bracket [ ] and brace { } where it is.
   • Lines starting with // are notes. The website ignores them.
   • See config/README.md for step-by-step help.
===================================================================== */

window.COMET_PRICING = {

  /* -------------------------------------------------------------------
     MULTIPLIERS BY JOB LENGTH
     upToHours: the band covers jobs up to this many hours.
                The last band uses null, meaning "anything longer".
     iith / external: the multiplier for each kind of user.
     ------------------------------------------------------------------- */
  multipliers: [
    { upToHours: 6, label: "Up to 6 h", iith: 2, external: 3 },
    { upToHours: 12, label: "6 – 12 h", iith: 2.5, external: 3.5 },
    { upToHours: 24, label: "12 – 24 h", iith: 3, external: 4 },
    { upToHours: null, label: "Over 24 h", iith: 4, external: 5 },
  ],

  /* -------------------------------------------------------------------
     MATERIALS
     pricePerKg: what the lab charges per kilogram, in rupees (PLACEHOLDER)
     density:    grams per cm³. Used to turn volume into weight.
                 Only change this if the material itself changes.
     A material name here must match the name used in "materials" lists
     further down, letter for letter.
     ------------------------------------------------------------------- */
  materials: {
    "PLA": { pricePerKg: 1200, density: 1.24 },
    "PETG": { pricePerKg: 1400, density: 1.27 },
    "TPU": { pricePerKg: 2500, density: 1.21 },
    "PVA": { pricePerKg: 6000, density: 1.23 },
    "ASA": { pricePerKg: 1800, density: 1.07 },
    "ABS": { pricePerKg: 1600, density: 1.04 },
    "PC": { pricePerKg: 3000, density: 1.2 },
    "PA nylon": { pricePerKg: 4000, density: 1.14 },
    "PLA-CF": { pricePerKg: 3500, density: 1.3 },
    "PLA pellets": { pricePerKg: 350, density: 1.24 },
    "ABS pellets": { pricePerKg: 400, density: 1.04 },
    "PETG pellets": { pricePerKg: 400, density: 1.27 },
    "HIPS pellets": { pricePerKg: 350, density: 1.04 },
    "PPGF pellets": { pricePerKg: 800, density: 1.12 },
    "PPCF pellets": { pricePerKg: 1200, density: 1.05 },
    "Standard resin": { pricePerKg: 3500, density: 1.12 },
    "ABS-like resin": { pricePerKg: 4500, density: 1.12 },
    "Water-washable resin": { pricePerKg: 4000, density: 1.1 },
    "B9 Onyx": { pricePerKg: 25000, density: 1.12 },
    "B9 Transparent": { pricePerKg: 25000, density: 1.12 },
    "B9 HD Slate": { pricePerKg: 25000, density: 1.12 },
    "B9 HD Clear": { pricePerKg: 27000, density: 1.12 },
    "B9 Robust ABS/PC": { pricePerKg: 30000, density: 1.15 },
    "Aluminium 6061": { pricePerKg: 450, density: 2.7 },
    "Mild steel": { pricePerKg: 90, density: 7.85 },
    "Stainless steel": { pricePerKg: 300, density: 8 },
    "Brass": { pricePerKg: 800, density: 8.5 },
    "Copper": { pricePerKg: 1000, density: 8.96 },
    "Tool steel (D2)": { pricePerKg: 400, density: 7.7 },
    "Delrin (POM)": { pricePerKg: 600, density: 1.41 },
    "Cast acrylic": { pricePerKg: 350, density: 1.19 },
    "Plywood": { pricePerKg: 80, density: 0.6 },
    "MDF": { pricePerKg: 50, density: 0.75 },
    "HDPE": { pricePerKg: 300, density: 0.95 },
    "Glass": { pricePerKg: 50, density: 2.5 },
    "Granite": { pricePerKg: 40, density: 2.7 },
    "Carbon fibre sheet": { pricePerKg: 3000, density: 1.6 },
  },

  /* -------------------------------------------------------------------
     CONSUMABLES (rupees)
     ------------------------------------------------------------------- */
  consumables: {
    cutterPerMinute: 3,     // cutter and insert wear, per cutting minute (mill, lathe, router)
    abrasivePerMinute: 12,  // garnet abrasive, per minute the waterjet is cutting
    edmWirePerMetre: 0.45,     // 0.25 mm brass wire, per metre used
  },

  /* -------------------------------------------------------------------
     ESTIMATOR SETTINGS PER MACHINE
     kind      How the job is estimated. Don't change it.
     capacity  The biggest job the machine takes. Parts bigger than this
               show "Too big" in red. (Lathe and router sizes are
               placeholders until confirmed.)
     materials The materials students can pick, in order. Each name must
               exist in MATERIALS above.
     The other numbers are typical machine speeds. Change them only if
     estimates keep coming out too long or too short.
     ------------------------------------------------------------------- */
  estimator: {
    a1: {   // P-01 · Bambu Lab A1
      kind: "fdm",
      capacity: [256, 256, 256],   // build volume X × Y × Z (mm)
      materials: ["PLA", "PETG", "TPU", "PVA"],
      flowRate: 9,          // mm³ of plastic per second at the default layer height
      nozzle: 0.4,          // nozzle size in mm
      layerHeights: [0.12, 0.2, 0.28],   // choices offered, mm
      defaultLayerHeight: 0.2,
    },
    core: {   // P-02 · Prusa Core One+
      kind: "fdm",
      capacity: [250, 220, 270],   // build volume X × Y × Z (mm)
      materials: ["PLA", "PETG", "ASA", "ABS", "PC", "PA nylon", "PLA-CF"],
      flowRate: 8,          // mm³ of plastic per second at the default layer height
      nozzle: 0.4,          // nozzle size in mm
      layerHeights: [0.1, 0.2, 0.3],   // choices offered, mm
      defaultLayerHeight: 0.2,
    },
    xl: {   // P-03 · Prusa XL
      kind: "fdm",
      capacity: [360, 360, 360],   // build volume X × Y × Z (mm)
      materials: ["PLA", "PETG", "ASA", "PC", "PA nylon", "PVA"],
      flowRate: 9,          // mm³ of plastic per second at the default layer height
      nozzle: 0.4,          // nozzle size in mm
      layerHeights: [0.1, 0.2, 0.3],   // choices offered, mm
      defaultLayerHeight: 0.2,
    },
    giga: {   // P-04 · ELEGOO OrangeStorm Giga
      kind: "fdm",
      capacity: [800, 800, 1000],   // build volume X × Y × Z (mm)
      materials: ["PLA", "PETG", "TPU"],
      flowRate: 20,          // mm³ of plastic per second at the default layer height
      nozzle: 0.6,          // nozzle size in mm
      layerHeights: [0.2, 0.3, 0.4],   // choices offered, mm
      defaultLayerHeight: 0.3,
      heads: 4,            // print heads that can run copies at once
      tileSize: 410,       // mm of bed per head
    },
    garuda: {   // P-05 · Garuda3D GF500
      kind: "fdm",
      capacity: [500, 500, 500],   // build volume X × Y × Z (mm)
      materials: ["PLA pellets", "ABS pellets", "PETG pellets", "HIPS pellets", "PPGF pellets", "PPCF pellets"],
      flowRate: 35,          // mm³ of plastic per second at the default layer height
      nozzle: 1,          // nozzle size in mm
      layerHeights: [0.5, 0.8],   // choices offered, mm
      defaultLayerHeight: 0.5,
    },
    saturn: {   // P-06 · ELEGOO Saturn 4 Ultra 16K
      kind: "resin",
      capacity: [211.68, 118.37, 220],   // build volume X × Y × Z (mm)
      materials: ["Standard resin", "ABS-like resin", "Water-washable resin"],
      layerHeights: [0.03, 0.05],   // choices offered, mm
      defaultLayerHeight: 0.05,
      secondsPerLayer: 5.5,
    },
    b9: {   // P-07 · B9 Elite Micro
      kind: "resin",
      capacity: [38.4, 21.6, 127],   // build volume X × Y × Z (mm)
      materials: ["B9 Onyx", "B9 Transparent", "B9 HD Slate", "B9 HD Clear", "B9 Robust ABS/PC"],
      layerHeights: [0.01, 0.02],   // choices offered, mm
      defaultLayerHeight: 0.01,
      secondsPerLayer: 9,
    },
    mill: {   // W-01 · CNC milling machine (BFW XTRON 544)
      kind: "mill",
      capacity: [500, 400, 400],   // machine travel X × Y × Z (mm), XTRON 544 SOP
      materials: ["Aluminium 6061", "Brass", "Mild steel", "Delrin (POM)"],
      roughingRate: {   // cm³ of material removed per minute
        "Aluminium 6061": 6,
        "Brass": 4,
        "Mild steel": 2,
        "Delrin (POM)": 10,
      },
      finishingRate: {   // mm² of surface finished per minute
        "Aluminium 6061": 450,
        "Brass": 350,
        "Mild steel": 200,
        "Delrin (POM)": 600,
      },
    },
    lathe: {   // W-05 · CNC lathe
      kind: "lathe",
      capacity: [150, 300],   // max bar diameter, max length (mm)
      materials: ["Aluminium 6061", "Brass", "Mild steel", "Delrin (POM)"],
      roughingRate: {   // cm³ of material removed per minute
        "Aluminium 6061": 15,
        "Brass": 10,
        "Mild steel": 5,
        "Delrin (POM)": 20,
      },
      finishingRate: {   // mm² of surface finished per minute
        "Aluminium 6061": 900,
        "Brass": 700,
        "Mild steel": 400,
        "Delrin (POM)": 1200,
      },
    },
    router: {   // W-04 · CNC router
      kind: "sheet",
      capacity: [900, 600, 25],   // bed X × Y, max thickness (mm)
      materials: ["Cast acrylic", "Plywood", "MDF", "HDPE", "Aluminium 6061"],
      feedRate: {   // mm per minute
        "Cast acrylic": 1500,
        "Plywood": 2000,
        "MDF": 2500,
        "HDPE": 1800,
        "Aluminium 6061": 600,
      },
      depthPerPass: {   // mm cut per pass
        "Cast acrylic": 3,
        "Plywood": 4,
        "MDF": 5,
        "HDPE": 3,
        "Aluminium 6061": 0.5,
      },
      defaultThickness: 6,   // mm
    },
    waterjet: {   // W-03 · Waterjet cutter
      kind: "sheet",
      capacity: [304, 304, 25],   // bed X × Y, max thickness (mm)
      materials: ["Aluminium 6061", "Mild steel", "Stainless steel", "Brass", "Cast acrylic", "Glass", "Granite", "Carbon fibre sheet"],
      speedAt6mm: {   // cutting speed in 6 mm stock, mm per minute (thicker is slower)
        "Aluminium 6061": 300,
        "Mild steel": 140,
        "Stainless steel": 120,
        "Brass": 190,
        "Cast acrylic": 900,
        "Glass": 500,
        "Granite": 300,
        "Carbon fibre sheet": 400,
      },
      defaultThickness: 6,   // mm
    },
    edm: {   // W-06 · Wire EDM
      kind: "edm",
      capacity: [300, 400, 200],   // travel X × Y, max job height (mm)
      materials: ["Tool steel (D2)", "Mild steel", "Stainless steel", "Aluminium 6061", "Copper", "Brass"],
      cutRate: {   // mm² of cut face per minute
        "Tool steel (D2)": 45,
        "Mild steel": 60,
        "Stainless steel": 50,
        "Aluminium 6061": 120,
        "Copper": 40,
        "Brass": 70,
      },
      defaultThickness: 20,   // mm
    },
  },
};
