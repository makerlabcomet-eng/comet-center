/* =====================================================================
   COMET CENTER · MACHINES
   ---------------------------------------------------------------------
   Everything the website says about each machine lives in this file:
   names, specs, rules, safety steps, the SOP link and the videos.

   HOW TO EDIT (no coding needed)
   • Only change the text between "double quotes", or numbers.
   • Keep every comma, colon, bracket [ ] and brace { } exactly where it is.
   • A line that starts with // is a note for humans. The website ignores it.
   • To use a double quote inside text, write \" (or use ' instead).
   • After you save, check the live site. If a page goes blank, undo your
     last change on GitHub (History → the commit → Revert), or ask for help.
   • The safety check runs automatically on GitHub and tells you which
     line is wrong if something breaks. See config/README.md.

   FIELDS IN EACH MACHINE
     code       Short code on the poster, e.g. "P-01". Keep it unique.
     name       Machine name shown on cards.
     model      Make and model line, shown in small text.
     family     Which filter chip it sits under. One of:
                  "print"  = 3D printing      "machine" = Machining
                  "cut"    = Cutting          "robot"   = Robotics & joining
     access     Coloured access band. One of:
                  "self"      = Self run (green)
                  "induction" = Induction first (orange)
                  "staff"     = Staff run only (red)
     status     Shown on the card. "up" = Free now, "busy" = In use,
                "down" = Out of service.
     summary    One or two sentences on the card and machine page.
     goodFor    What students typically make on it.
     specs      Specification table. Each line is "Label": "Value".
     allowed    Materials or uses that are OK (green list).
     never      Things never to do (red "Safety · never do this" list).
     steps      "Important instructions · before you hit start", in order.
     stopIf     The red "Safety · stop immediately if" box.
     facts      Fun facts. The first two also scroll on the home page.
     sop        Link to the machine's SOP FOLDER in Google Drive (shared as
                "anyone with the link can view"). Students see every file in
                the folder, so new documents show up without editing this
                file. Leave "" to show "SOP coming soon".
     videos     YouTube videos on the machine page. For each video:
                  youtube: the ID after "watch?v=" in the YouTube link
                           (https://www.youtube.com/watch?v=pGc2QnFX4vE
                            → "pGc2QnFX4vE")
                  title:   what students see
                  channel: who made the video
     lessons    Training lessons. Training is switched off right now, so
                these only show as "coming soon" rows if a machine has no
                videos. Each: title, length, points (bullet list).
     quiz       Safety-check questions (also switched off right now).
                correct = which answer is right, counting from 1.
                why     = shown after the student answers.

   ADDING A NEW MACHINE: ask a developer. It also needs a 3D model and,
   if it should appear in the cost estimator, an entry in pricing.js.
===================================================================== */

window.COMET_MACHINES = {

  // Names of the filter chips on the Machines page.
  families: {
    print: "3D printing",
    machine: "Machining",
    cut: "Cutting",
    robot: "Robotics & joining",
  },

  machines: {

    /* ---------------------------------------------------------------
       P-01 · Bambu Lab A1
       --------------------------------------------------------------- */
    a1: {
      code: "P-01",
      name: "Bambu Lab A1",
      model: "Bambu Lab A1 · open-frame FDM",
      family: "print",
      access: "self",
      status: "up",

      summary: "Melts filament and draws your part one 0.2 mm layer at a time. Where almost everyone starts.",
      goodFor: "Brackets, phone stands, enclosures, nuts and bolts, first prototypes",

      specs: {
        "Build volume": "256 × 256 × 256 mm",
        "Nozzle": "0.4 mm, up to 300 °C",
        "Bed": "Textured PEI, up to 100 °C",
        "Top speed": "500 mm/s",
        "Slicer": "Bambu Studio",
      },

      allowed: [
        "PLA, the default. Cheap and forgiving",
        "PETG, tougher with a little flex",
        "TPU, for flexible parts",
        "PVA, as dissolvable support",
      ],

      never: [
        "ABS and ASA. They warp on an open frame, so use the Core One+",
        "Any spool from outside until staff check it",
        "Nails, knives or anything but the scraper on the plate",
      ],

      steps: [
        "Slice in Bambu Studio with the Comet Center A1 profile.",
        "Wipe the plate with IPA, edge to edge. No fingerprints after that.",
        "Clear the bed: old print, blobs and the scraper all come off.",
        "Check the filament: enough left, dry, not tangled on the spool.",
        "Send the job and let the auto mesh run. It takes a minute.",
        "Watch layer one go down. Loose or stringy means stop.",
        "Leave it alone while it moves. Never reach in.",
        "When it's done, lift the whole plate off and flex it. The part pops free.",
        "Log the job, put the plate back and leave the bed clear.",
      ],

      stopIf: "The first layer isn't sticking, plastic is balling up on the nozzle, or the part breaks loose. Stop from the screen and tell the lab staff.",

      facts: [
        "10,000 mm/s² of acceleration, about 1 g, the same shove as a launching coaster.",
        "One 1 kg spool is about 330 m of plastic. Your print is a single continuous line of it.",
        "The ISS has been printing its own spare parts since 2014. You're on the same tech.",
      ],

      // SOP and videos
      sop: "https://drive.google.com/drive/folders/17XJkhg1kNWXBJ90SPkW1xEcgKQ-vubQ7",
      videos: [
        { youtube: "pGc2QnFX4vE", title: "Bambu Lab A1 setup: assemble and start printing", channel: "3D Print Dood" },
        { youtube: "Pd6tnFklBk4", title: "How to unbox and set up a Bambu Lab A1", channel: "Micro Center" },
      ],

      // Training (switched off for now)
      lessons: [
        { title: "How FDM works", length: "4 min", points: [
          "Model, slice, print, clean up: the four moves",
          "Why layers bond, and why parts are weakest across them",
          "Reading the slice preview before you commit four hours",
        ] },
        { title: "The plate and the first layer", length: "5 min", points: [
          "IPA wipe and why skin oil ruins adhesion",
          "What the auto mesh is measuring",
          "Too high, too low, just right: reading layer one",
        ] },
        { title: "Getting the part off and leaving it clean", length: "3 min", points: [
          "Scraper only, and flexing the plate",
          "Removing supports without snapping detail",
          "What the next person should find",
        ] },
      ],
      quiz: [
        {
          question: "Why shouldn't you touch the build plate with your fingers?",
          answers: [
            "It's always hot enough to burn you",
            "Skin oil stops the next print from sticking",
            "It knocks the bed out of level",
            "It voids the warranty",
          ],
          correct: 2,
          why: "Palm oil on PEI is the most common reason a first layer won't stick. Wipe with IPA and hold the plate by its edges.",
        },
        {
          question: "Your first layer looks like loose spaghetti. What do you do?",
          answers: [
            "Let it run, it usually recovers",
            "Stop the print, clean the plate and start again",
            "Speed the print up",
            "Open a window to cool it",
          ],
          correct: 2,
          why: "A bad first layer never recovers. Stopping costs five minutes. Not stopping costs the job and often a blob on the nozzle.",
        },
        {
          question: "A finished part is stuck hard to the plate. What's the right move?",
          answers: [
            "Pry it off with a knife",
            "Lift the whole plate off and flex it",
            "Heat the bed back up to 100 °C",
            "Leave it for the next person",
          ],
          correct: 2,
          why: "The flexible plate is designed for this. Flex it and the part pops off with no tools and no scratched PEI.",
        },
        {
          question: "You need an ABS part. Which machine do you book?",
          answers: [
            "The A1, at a higher temperature",
            "The Core One+ with its enclosure",
            "The Giga",
            "Any of them",
          ],
          correct: 2,
          why: "ABS and ASA curl and crack as they cool on an open frame. The Core One+ keeps warm air around the part so the layers stay bonded.",
        },
      ],
    },

    /* ---------------------------------------------------------------
       P-02 · Prusa Core One+
       --------------------------------------------------------------- */
    core: {
      code: "P-02",
      name: "Prusa Core One+",
      model: "Original Prusa CORE One+ · enclosed CoreXY",
      family: "print",
      access: "induction",
      status: "up",

      summary: "The box is the point. A warm chamber lets it print the ABS, ASA, PC and nylon that crack on open machines.",
      goodFor: "Heat-resistant housings, snap fits in ASA, nylon gears, carbon-fibre brackets",

      specs: {
        "Build volume": "250 × 220 × 270 mm",
        "Chamber": "Actively held, up to 55 °C",
        "Nozzle": "0.4 mm, up to 290 °C",
        "Bed": "Smooth PEI, up to 120 °C",
        "Layers": "0.05 – 0.30 mm",
        "Slicer": "PrusaSlicer",
      },

      allowed: [
        "PLA and PETG. Door can stay shut, vents handle it",
        "ASA and ABS. This is the machine for them",
        "PC and PA nylon. Slow down, keep the chamber hot",
        "Carbon-fibre composites, with the hardened nozzle",
      ],

      never: [
        "Opening the door mid-print. It cracks the part",
        "CF filament on a brass nozzle. It wears through fast",
        "Skipping the chamber warm-up for ASA or PC",
      ],

      steps: [
        "Slice in PrusaSlicer with the Comet Center Core One+ profile.",
        "Check the sheet is clean and seated on the magnets.",
        "Load filament from the right-side spool bay and watch it purge.",
        "For ASA or PC, preheat until the chamber reaches temperature.",
        "Shut the door and start. It stays shut for the whole job.",
        "Watch the first layer through the glass.",
        "Never reach in. The head moves without warning.",
        "Let the part cool in the chamber, then lift the sheet out and flex it once.",
        "Log the material on the sheet, especially nylon and PC runs.",
      ],

      stopIf: "Cracking sounds, layers splitting, or the head hitting the part. Pause from the screen and call staff. Don't open the door on a hot ABS part.",

      facts: [
        "There's no chamber heater. Two fans push the bed's own heat around the box and vents open by themselves for PLA.",
        "Every panel is screwed, not glued, and the CAD is public. The printer can print its own upgrades.",
        "CoreXY means the bed never moves sideways, so tall prints stay steady.",
      ],

      // SOP and videos
      sop: "https://drive.google.com/drive/folders/1MbWO1FIESjvNq0AU5lolo56JW_oLebAI",
      videos: [
        { youtube: "dhVFSwUK4aE", title: "Prusa Core One: setup, calibration, PrusaSlicer", channel: "3DRundown" },
        { youtube: "7wO0F5S-fm0", title: "Hands-on with Prusa Core One: setup and first print", channel: "Jeremy Cook Builds" },
      ],

      // Training (switched off for now)
      lessons: [
        { title: "Why the box matters", length: "4 min", points: [
          "How cooling layers pull a part into a curl",
          "What 55 °C of chamber air does for ABS and ASA",
          "Fumes and noise stay inside too",
        ] },
        { title: "Materials by chamber temperature", length: "5 min", points: [
          "PLA and PETG: door shut, vents open",
          "ASA and ABS: enclosure only",
          "PC, nylon and CF: slow, hot and a hardened nozzle",
        ] },
        { title: "Door discipline and taking parts off", length: "3 min", points: [
          "Why opening the door mid-print cracks the part",
          "Letting it cool in the chamber",
          "Flexing the sheet, and logging the material",
        ] },
      ],
      quiz: [
        {
          question: "Why does ABS crack on an open-frame printer?",
          answers: [
            "The nozzle is too hot",
            "Layers cool unevenly and pull apart",
            "ABS is too heavy",
            "The bed is too small",
          ],
          correct: 2,
          why: "Warm air around the part lets layers cool slowly and stay bonded. Cold draughts make them shrink at different rates and split.",
        },
        {
          question: "Your ASA part is halfway done. Can you open the door to check it?",
          answers: [
            "Yes, quickly",
            "Yes, if the bed is hot",
            "No, opening it mid-print cracks the part",
            "Only for PLA",
          ],
          correct: 3,
          why: "The sudden cold air is exactly what the enclosure exists to prevent. Watch through the glass.",
        },
        {
          question: "You want to print carbon-fibre nylon. What has to be fitted?",
          answers: [
            "A 0.2 mm nozzle",
            "A hardened nozzle",
            "A glass bed",
            "Nothing special",
          ],
          correct: 2,
          why: "Carbon fibre is abrasive and wears a brass nozzle out within a print or two.",
        },
      ],
    },

    /* ---------------------------------------------------------------
       P-03 · Prusa XL
       --------------------------------------------------------------- */
    xl: {
      code: "P-03",
      name: "Prusa XL",
      model: "Original Prusa XL · 5-tool toolchanger",
      family: "print",
      access: "induction",
      status: "up",

      summary: "Five heads, five materials, one plate. It parks the head it's holding, picks up the next one and keeps printing.",
      goodFor: "Multi-colour models, parts with dissolvable supports, full-size helmets",

      specs: {
        "Toolheads": "Up to 5 × Nextruder",
        "Build volume": "360 × 360 × 360 mm",
        "Nozzle": "0.4 mm, up to 290 °C",
        "Bed": "Segmented PEI, 16 tiles, up to 120 °C",
        "Motion": "CoreXY",
        "Slicer": "PrusaSlicer",
      },

      allowed: [
        "PLA, PETG, ASA, PC and PA",
        "PVA for supports that dissolve in water",
        "Mixed nozzle sizes on different heads",
      ],

      never: [
        "Reaching past a parked head. It's still hot",
        "Pulling a tool out of its dock by hand",
        "Resting anything on the dock row",
        "Cancelling someone else's multi-day job",
      ],

      steps: [
        "Assign each colour or material to a tool in PrusaSlicer.",
        "Confirm the slicer's tool for each colour matches the reel on that bay.",
        "Check the dock row is clear. A blocked pickup ends the print.",
        "Check every feed tube is untangled and every spool turns freely.",
        "Leave the purge tower in the job. Every swap wipes and purges on it.",
        "Start and watch the first two tool changes.",
        "Never touch a nozzle or a parked head. 290 °C.",
        "Let it finish, then remove the part and peel away the purge tower.",
        "Drop PVA supports in water and log the job.",
      ],

      stopIf: "A failed pickup, a head knocked out of its dock, or a tangled feed line. Pause from the front console and call staff.",

      facts: [
        "A five-colour print can trigger thousands of tool changes. Each swap takes seconds and the print never stops.",
        "Every head finds the bed by feel. A load cell senses contact instead of guessing a height.",
        "The bed is 16 tiles. Print one small part and only the tiles under it heat up.",
      ],

      // SOP and videos
      sop: "https://drive.google.com/drive/folders/1jiRXH8KsBbKewwOcwNNWDFgZKo3Ot9oh",
      videos: [
        { youtube: "Zd-HhH_wKiY", title: "Prusa XL initial setup and first print", channel: "Arcadenut" },
        { youtube: "yWvXRPUUf2I", title: "Prusa XL 5-toolhead: calibrating and first print", channel: "Zachary 3D Prints" },
      ],

      // Training (switched off for now)
      lessons: [
        { title: "How a toolchanger works", length: "4 min", points: [
          "Docks, the carriage and the pickup",
          "Why idle heads stay hot",
          "What the purge tower is for",
        ] },
        { title: "Assigning tools in PrusaSlicer", length: "5 min", points: [
          "Colour and material per tool",
          "Soluble supports in PVA",
          "Mixed nozzles: wide for bulk, fine for detail",
        ] },
        { title: "Five heads, five checks", length: "3 min", points: [
          "Right tool, right reel",
          "Docks clear and tubes free",
          "Leaving the purge alone",
        ] },
      ],
      quiz: [
        {
          question: "What is the little tower printed next to your part for?",
          answers: [
            "Decoration",
            "Every tool swap wipes and purges onto it",
            "It holds the part down",
            "It measures temperature",
          ],
          correct: 2,
          why: "Each new head pushes out a bit of filament first so the colour is clean on your part. That tower is meant to be there.",
        },
        {
          question: "Someone left a scraper on the dock row. What happens?",
          answers: [
            "Nothing",
            "A blocked pickup can end the print",
            "The heads move around it",
            "It speeds up tool changes",
          ],
          correct: 2,
          why: "The carriage needs a clear path to each dock. A blocked pickup stops the job.",
        },
        {
          question: "How do you remove supports printed in PVA?",
          answers: [
            "Sand them off",
            "Drop the part in water",
            "Heat them with a gun",
            "Cut them with a knife",
          ],
          correct: 2,
          why: "PVA dissolves in water. Print the scaffolding in PVA, soak the part and walk away.",
        },
      ],
    },

    /* ---------------------------------------------------------------
       P-04 · ELEGOO OrangeStorm Giga
       --------------------------------------------------------------- */
    giga: {
      code: "P-04",
      name: "ELEGOO OrangeStorm Giga",
      model: "ELEGOO OrangeStorm Giga · large-format FDM",
      family: "print",
      access: "induction",
      status: "busy",

      summary: "Four heads, four plates, 640 litres. The machine you book when the part will not fit anywhere else.",
      goodFor: "Furniture-scale shells, metre-tall parts, four copies at once",

      specs: {
        "Volume": "800 × 800 × 1000 mm (640 L)",
        "Platform": "820 × 820 mm, 4 × 410 mm PEI tiles",
        "Bed": "Up to 100 °C, all four in 17 min",
        "Nozzle": "0.6 mm, up to 300 °C",
        "Heads": "1 fitted, up to 4 on one X rail",
        "Speed": "300 mm/s max, 150 mm/s in practice",
        "Power": "1,530 W, +100 W per extra head",
        "Slicer": "ELEGOO Cura",
      },

      allowed: [
        "PLA",
        "PETG",
        "TPU",
      ],

      never: [
        "ABS, ASA, PC and nylon. They curl off the open plate long before a tall part finishes",
        "Leaning on the gantry",
        "Reaching in. Four nozzles at 300 °C",
      ],

      steps: [
        "Book the bed on the calendar. Big jobs run for a day or more.",
        "Model to fit one 410 mm tile, or fill all four.",
        "Slice in ELEGOO Cura with the 0.6 mm profile. One copy per head, per tile.",
        "Check every reel. Each head needs enough for the whole job.",
        "Two people to a tile when placing or lifting plates.",
        "Watch layer one on every tile. A tall failure costs a spool.",
        "Never lean on the gantry while it moves.",
        "Take a tile: lift one plate off the magnet and leave the other three alone.",
        "Log the job and the reel weights.",
      ],

      stopIf: "A part lifting at a corner, a head dragging through a print, or one reel running dry. Pause and call staff. If power cuts, it resumes from the layer it stopped on.",

      facts: [
        "The bed is 0.67 m² of PEI, about the size of a small desk.",
        "One Giga build volume holds 27 A1 build volumes.",
        "Filling the volume solid would take about 800 kg of plastic.",
      ],

      // SOP and videos
      sop: "https://drive.google.com/drive/folders/1WPnQgrUe-PDcgRzL5jUDHYE27f7ri8Kp",
      videos: [
        { youtube: "8EZPErFU5Ew", title: "OrangeStorm Giga unboxing and setup", channel: "Uncle Jessy" },
        { youtube: "gdIUkL0fjAQ", title: "OrangeStorm Giga: manual levelling and ABL", channel: "3DRundown" },
      ],

      // Training (switched off for now)
      lessons: [
        { title: "Thinking in metres", length: "4 min", points: [
          "What fits on a tile and what needs all four",
          "Why open-frame limits you to PLA, PETG and TPU",
          "Planning a 24-hour job around the calendar",
        ] },
        { title: "Four heads, one clock", length: "5 min", points: [
          "Every head runs the same G-code",
          "Four copies in the time of one",
          "Four colours by loading a different reel per head",
        ] },
        { title: "Rules for the big one", length: "3 min", points: [
          "Two people to a tile",
          "Watching layer one everywhere",
          "Reel checks and power-cut resume",
        ] },
      ],
      quiz: [
        {
          question: "Can the four heads print four different models at once?",
          answers: [
            "Yes, any four models",
            "No, every head runs the same G-code, so all four are the same model",
            "Only on PLA",
            "Only two at a time",
          ],
          correct: 2,
          why: "The heads share one X rail and move together. Same model, but each head can carry a different colour.",
        },
        {
          question: "You want a 900 mm tall ABS part. Is the Giga right?",
          answers: [
            "Yes, it's the tallest",
            "No, ABS curls off an open frame long before a tall part finishes",
            "Yes, at 300 °C",
            "Only with glue",
          ],
          correct: 2,
          why: "The Giga is PLA, PETG and TPU only. Large ABS parts need an enclosed machine or the pellet printer's heated chamber.",
        },
        {
          question: "Before a four-head job, what do you check on each reel?",
          answers: [
            "Its colour only",
            "That it holds enough for the whole job",
            "Its brand",
            "Nothing",
          ],
          correct: 2,
          why: "Each head prints its own copy end to end. One reel running dry ruins that tile.",
        },
      ],
    },

    /* ---------------------------------------------------------------
       P-05 · Garuda3D GF500
       --------------------------------------------------------------- */
    garuda: {
      code: "P-05",
      name: "Garuda3D GF500",
      model: "Garuda3D GF500 · FGF pellet extrusion",
      family: "print",
      access: "induction",
      status: "up",

      summary: "Eats raw plastic granules and pushes them through a heated screw. Half a metre cubed at a time, for a fraction of filament cost.",
      goodFor: "Casting patterns, vacuum-forming moulds, helmet bucks, jigs and fixtures",

      specs: {
        "Volume": "500 × 500 × 500 mm (125 L)",
        "Feedstock": "Dry pellets, 2 – 4 mm",
        "Nozzle": "1.0 mm brass, 2.0 mm optional, 300 °C",
        "Chamber": "50 °C, HEPA + carbon filter",
        "Bed": "Aluminium, up to 110 °C, PEI / glass / PP plates",
        "Speed": "10 – 50 mm/s",
        "Slicer": "OrcaSlicer",
      },

      allowed: [
        "PLA, HSPLA, PETG",
        "ABS, HIPS, GPPS",
        "PPGF and PPCF (glass and carbon filled)",
        "Flexibles",
      ],

      never: [
        "Wet pellets. They steam in the barrel and print as foam",
        "Opening the door mid-print. Hot chamber, hot melt",
        "Running a big job with the inverter off",
      ],

      steps: [
        "Dry the pellets. Straight from the bag is not dry; check the drying chart.",
        "Fit the plate that matches your pellet: PEI, glass or PP.",
        "Clean the plate with IPA, edge to edge.",
        "Estimate the part mass and fill the hopper. Five kilos goes fast at a 1 mm bead.",
        "New bag or new supplier? Print a small test block first.",
        "Slice in OrcaSlicer and send over Wi-Fi or USB.",
        "Let the probe map all 500 mm of bed.",
        "Keep the door shut. Watch the job over LAN from your desk.",
        "Grind failed prints, dry them and pour them back in.",
      ],

      stopIf: "Foamy or sputtering extrusion, the hopper running empty, or the screw stalling. Pause from the console and call staff.",

      facts: [
        "Filament is just pellets that went through an extra factory. Skipping that step takes about 80% off the material bill.",
        "The same resin grades used in injection moulding go straight in. Prototype in the exact production plastic.",
        "A failed print is feedstock. Grind it, dry it, pour it straight back in.",
      ],

      // SOP and videos
      sop: "https://drive.google.com/drive/folders/11ZfBb5C1bXRgBMGKs_ffXbzFpZQcJNQ7",
      videos: [
        { youtube: "Djmw9JJhzUk", title: "Garuda3D 500 × 500 × 500 mm large-format printer", channel: "Zero3D" },
      ],

      // Training (switched off for now)
      lessons: [
        { title: "Granule to part", length: "4 min", points: [
          "Load, convey, melt, build",
          "Heated zones at 180, 240 and 300 °C",
          "Why thick beads mean strong walls and rough surfaces",
        ] },
        { title: "Pellet rules", length: "4 min", points: [
          "Drying, and what wet pellets do",
          "Matching the plate to the pellet",
          "Testing a new bag before a long job",
        ] },
        { title: "Good candidates", length: "3 min", points: [
          "Parts too big or too cheap for filament",
          "Casting patterns and layup tools",
          "Finishing with sandpaper afterwards",
        ] },
      ],
      quiz: [
        {
          question: "You pour pellets straight from a new bag. What's the risk?",
          answers: [
            "None",
            "They've absorbed moisture, steam in the barrel and print as foam",
            "They melt too fast",
            "The hopper jams",
          ],
          correct: 2,
          why: "Granules drink moisture from the air. Dry them first using the chart for that grade.",
        },
        {
          question: "Why do you match the plate to the pellet?",
          answers: [
            "For colour",
            "The wrong sheet either won't hold the part or won't let it go",
            "It changes the print speed",
            "It doesn't matter",
          ],
          correct: 2,
          why: "PEI, glass and PP each bond differently with different plastics.",
        },
        {
          question: "You switch to pellets from a new supplier. What first?",
          answers: [
            "Start the full job",
            "Print a small test block",
            "Raise the temperature 50 °C",
            "Use the 2 mm nozzle",
          ],
          correct: 2,
          why: "Different supplier, different melt. A small block shows problems before you lose a day.",
        },
      ],
    },

    /* ---------------------------------------------------------------
       P-06 · ELEGOO Saturn 4 Ultra 16K
       --------------------------------------------------------------- */
    saturn: {
      code: "P-06",
      name: "ELEGOO Saturn 4 Ultra 16K",
      model: "ELEGOO Saturn 4 Ultra 16K · MSLA resin",
      family: "print",
      access: "induction",
      status: "up",

      summary: "Light instead of heat, liquid instead of filament, and the print hangs upside down. 14-micron pixels.",
      goodFor: "Miniatures, character busts, fine mechanisms, smooth master patterns",

      specs: {
        "Build volume": "211.68 × 118.37 × 220 mm",
        "Screen": "16K mono LCD, 15,120 × 6,230 px, 14 µm pixel",
        "Layers": "0.02 – 0.05 mm",
        "Tank": "Heated, held at 30 °C",
        "Speed": "Up to 150 mm/h of height",
        "Light": "405 nm COB lamp + Fresnel lens",
      },

      allowed: [
        "Standard 405 nm resin",
        "ABS-like resin",
        "Water-washable resin",
      ],

      never: [
        "Resin or IPA down the drain",
        "Touching a wet print bare-handed",
        "Leaving the hood open under light",
        "Scraping the film with anything metal",
      ],

      steps: [
        "Gear up: nitrile gloves on both hands, extraction on.",
        "Stir and sweep the vat with the spatula. No cured lumps.",
        "Check the resin level: above the model, below the MAX line.",
        "Lock the plate: ears down, clamp tight, lid closed.",
        "Slice with supports and start the job. The AI camera watches for failures.",
        "When it's done, park the wet plate on the drip stand to drain.",
        "Carry it over the tray to the wash station. A wet plate never travels.",
        "Wash in IPA, then cure under UV.",
        "Waste resin and used IPA go in the marked jar.",
      ],

      stopIf: "Resin on skin, a torn vat film or resin outside the vat. Wash skin with soap and water and tell staff straight away.",

      facts: [
        "94 million pixels on a 10-inch panel, about eleven 4K TVs, redrawn every few seconds.",
        "Only height costs time. One miniature or forty of them, each layer takes exactly as long.",
        "Resin came first: stereolithography was patented in 1986, three years ahead of filament printing.",
      ],

      // SOP and videos
      sop: "https://drive.google.com/drive/folders/1X-HXh8o_9OBaOqONkyek7fNOxp4CghTn",
      videos: [
        { youtube: "N940QuEvNsM", title: "Saturn 4 Ultra 16K: setup, first print, wash and cure", channel: "Aurora Tech" },
        { youtube: "mNChU2gJsts", title: "Saturn 4 Ultra 16K calibration mode", channel: "Hikarus" },
      ],

      // Training (switched off for now)
      lessons: [
        { title: "How one layer happens", length: "4 min", points: [
          "Dip, flash, peel, lift",
          "Why the tilting vat peels sideways",
          "Gravity and why supports matter",
        ] },
        { title: "Three wet-bench rules", length: "5 min", points: [
          "Nitrile on, both hands, and why resin sensitises skin",
          "Nothing goes down the sink",
          "A wet plate never travels",
        ] },
        { title: "Wash and cure", length: "4 min", points: [
          "IPA wash timing",
          "UV cure",
          "Handling green parts without bending them",
        ] },
      ],
      quiz: [
        {
          question: "One miniature takes 3 hours. How long do forty of the same height take?",
          answers: [
            "120 hours",
            "About 3 hours",
            "40 minutes",
            "Twice as long",
          ],
          correct: 2,
          why: "The whole layer is flashed at once. Only height costs time, so a full plate takes as long as one part.",
        },
        {
          question: "Uncured resin gets on your hand. What do you do?",
          answers: [
            "Wipe it on a towel",
            "Wash with soap and water, then tell staff",
            "Rinse it with IPA",
            "Let it dry",
          ],
          correct: 2,
          why: "Resin is a skin sensitiser. IPA drives it further into skin. Soap and water, then report it.",
        },
        {
          question: "Where does used IPA go?",
          answers: [
            "The sink",
            "The marked waste jar",
            "The normal bin",
            "Back in the bottle",
          ],
          correct: 2,
          why: "Nothing goes down the sink. Waste resin and IPA are collected separately.",
        },
      ],
    },

    /* ---------------------------------------------------------------
       P-07 · B9 Elite Micro
       --------------------------------------------------------------- */
    b9: {
      code: "P-07",
      name: "B9 Elite Micro",
      model: "B9Creations Elite Micro · micro resin",
      family: "print",
      access: "induction",
      status: "up",

      summary: "No nozzle, no filament. UV light hardens liquid resin one 10 µm layer at a time, for parts that are small and have to be right.",
      goodFor: "Microfluidic chips, medical device parts, tiny connectors, micro filters",

      specs: {
        "Build size": "38.4 × 21.6 × 127 mm",
        "Detail": "Down to 10 µm features",
        "Accuracy": "± 10 µm",
        "Job time": "Minutes to hours",
        "Resins": "Six from B9, plus your own",
        "Software": "B9Create",
      },

      allowed: [
        "Onyx, black and rigid, 20 µm wall",
        "Transparent, for fluid channels, 20 µm wall",
        "HD Slate, everyday precise parts, 40 µm wall",
        "HD Clear, polishable, 30 µm wall",
        "Robust ABS/PC, tough, 80 µm wall",
      ],

      never: [
        "Opening the hood while it prints. Daylight also hardens resin",
        "Scraping the tank bottom",
        "Resin or IPA down the drain",
      ],

      steps: [
        "Load your model in B9Create and pick the resin. It sets exposure and supports.",
        "Check your thinnest wall against the resin's minimum.",
        "Gloves on. Check the tank is clean and filled.",
        "Close the tinted hood and start.",
        "When it finishes, drip-drain the part over the tank.",
        "Rinse it briefly and gently in IPA.",
        "Harden it in the UV chamber.",
        "Inspect it under the microscope.",
        "Waste resin and IPA go in the marked jar.",
      ],

      stopIf: "Resin on skin, a cloudy or damaged tank floor, or the build table not lifting. Stop and call staff.",

      facts: [
        "A pattern pressed 10 µm deep is shallower than a red blood cell is wide.",
        "One printed channel measured 300 µm across and a foot long, in one piece.",
        "B9Creations printers appear in 220+ research papers, and one has printed in orbit on the ISS.",
      ],

      // SOP and videos
      sop: "https://drive.google.com/drive/folders/1imgdKmFK6is1OY9ruNqQQz2Za-TOxzI8",
      videos: [
        { youtube: "r-V4Ma9fJ90", title: "Getting started with the B9 Core series", channel: "B9Creations" },
        { youtube: "O72Z02a3Clk", title: "Calibration print analysis and printer tuning", channel: "B9Creations" },
      ],

      // Training (switched off for now)
      lessons: [
        { title: "How small is 10 µm?", length: "3 min", points: [
          "Microns against hair, paper and blood cells",
          "Build size and why it's 38 × 22 mm",
          "Where the machine is used",
        ] },
        { title: "Pick your resin", length: "4 min", points: [
          "Minimum wall thickness per resin",
          "Transparent for channels, Onyx for detail",
          "Bringing your own resin",
        ] },
        { title: "When it finishes, you're not finished", length: "4 min", points: [
          "Drip, rinse, cure",
          "Inspecting under a microscope",
          "Waste handling",
        ] },
      ],
      quiz: [
        {
          question: "Your design has 50 µm walls. Which resin can't hold them?",
          answers: [
            "Onyx",
            "HD Clear",
            "Robust ABS/PC",
            "Transparent",
          ],
          correct: 3,
          why: "Robust ABS/PC needs 80 µm walls minimum. The others go down to 20 – 40 µm.",
        },
        {
          question: "Why keep the hood shut while it prints?",
          answers: [
            "To keep it quiet",
            "Daylight also hardens resin",
            "To keep it warm",
            "It isn't needed",
          ],
          correct: 2,
          why: "Stray light cures resin in the tank where you don't want it.",
        },
        {
          question: "What's the last step after UV curing?",
          answers: [
            "Sanding",
            "Inspect it under a microscope",
            "Painting",
            "Freezing",
          ],
          correct: 2,
          why: "At this scale, the microscope is the only way to know the features came out.",
        },
      ],
    },

    /* ---------------------------------------------------------------
       W-01 · CNC milling machine
       --------------------------------------------------------------- */
    mill: {
      code: "W-01",
      name: "CNC milling machine",
      model: "BFW XTRON 544 · 3-axis vertical machining centre · Fanuc 0i-MF Plus",
      family: "machine",
      access: "induction",
      status: "up",

      summary: "Mills, drills, slots and pockets metal parts, moulds and fixtures from solid stock, to a hundredth of a millimetre. Always run under supervision.",
      goodFor: "Aluminium brackets, moulds, jigs, precision fixtures",

      // From the Comet Center SOP (BFW XTRON 544+ brochure)
      specs: {
        "Travel X-Y-Z": "500 × 400 × 400 mm",
        "Table": "700 × 410 mm · max load 300 kg",
        "T-slots": "3 × 14 mm, 150 mm pitch",
        "Spindle": "8000 rpm · 5.5 kW · BT-40",
        "Spindle nose to table": "150 – 550 mm",
        "Tool changer": "24 tools · max 140 × 250 mm, 8 kg",
        "Rapid traverse": "48 m/min, all axes",
        "Positioning · repeatability": "0.01 mm · 0.007 mm",
        "Control": "Fanuc 0i-MF Plus",
      },

      allowed: [
        "Aluminium, the standard material. Clear chips often",
        "Cast iron. Wear a dust mask and eye protection",
        "Steel, with staff-approved cutting data only. Hardened steel needs authorisation",
        "Titanium, with approved cutting data and staff supervision",
        "Anything else, including brass and Delrin: ask staff first",
      ],

      never: [
        "Running the machine alone. Supervision is required every time",
        "Reaching in, opening the door or removing a guard while anything moves",
        "Clearing chips by hand or blowing air at people",
        "Changing parameters or machine settings on the control",
        "Using a damaged tool, holder or clamp",
        "Gloves, rings, loose sleeves or long hair near the spindle",
      ],

      steps: [
        "Simulate your toolpath in CAM, and dry-run it on the CNC simulator (W-02).",
        "Post the program with the Fanuc 0i-MF Plus post-processor only.",
        "Clean the table and T-slots. Check guards, door, coolant and air.",
        "Check every tool in the magazine is right, clean and tight.",
        "Clamp the part firmly in the vice or on the T-slots.",
        "Home all axes, then set work offsets and tool lengths with staff.",
        "Check the program name, tool numbers and offsets match the simulation.",
        "First run at reduced feed, door closed, standing at the control.",
        "Wait for the spindle to stop before opening the door. Clear chips with the brush and hook.",
      ],

      stopIf: "An alarm, chatter, a change in the cutting sound, coolant or air loss, unexpected movement, or the part moving in the vice. Feed Hold or Emergency Stop, then call staff.",

      facts: [
        "0.01 mm positioning accuracy is about a seventh of a human hair.",
        "The 24-tool changer swaps cutters by itself, mid-program.",
        "It weighs about 4000 kg, as much as two cars.",
      ],

      // SOP and videos
      sop: "https://drive.google.com/drive/folders/1dQjSbmWla2aqjwDgcHWrXT5E04mrWReo",
      videos: [
        { youtube: "ihCuENxL6pI", title: "BFW XTRON vertical machining centres", channel: "Bharat Fritz Werner" },
        { youtube: "TecC9_nwpUw", title: "Beginner's guide to manual and CNC machining", channel: "NYC CNC" },
      ],

      // Training (switched off for now)
      lessons: [
        { title: "What the mill does and why it's induction first", length: "5 min", points: [
          "Forces and speeds in plain numbers",
          "Where every emergency stop is",
          "What a loose part does at 8000 rpm",
        ] },
        { title: "Workholding and offsets", length: "7 min", points: [
          "Vice, parallels and clamping order",
          "Work offsets and tool lengths",
          "How a wrong zero crashes the machine",
        ] },
        { title: "From CAM file to first cut", length: "6 min", points: [
          "Simulating first on W-02",
          "Single-block and feed override",
          "Chips, coolant and cleanup",
        ] },
      ],
      quiz: [
        {
          question: "When can you run the mill on your own?",
          answers: [
            "After you pass this module",
            "After staff sign you off",
            "Any time in your slot",
            "Never",
          ],
          correct: 2,
          why: "The module is step one. Staff induction on the real machine comes before any solo run.",
        },
        {
          question: "Why no gloves near the spindle?",
          answers: [
            "They reduce grip",
            "They can catch and pull your hand in",
            "Coolant ruins them",
            "They're fine",
          ],
          correct: 2,
          why: "Anything that can wrap around a rotating tool is a hazard.",
        },
        {
          question: "The tool rapids toward the vice on your first run. What do you do?",
          answers: [
            "Wait and see",
            "Hit the emergency stop",
            "Open the door",
            "Lower the spindle speed",
          ],
          correct: 2,
          why: "Stop first, diagnose second. That's why the first run is single-block at 10% feed.",
        },
      ],
    },

    /* ---------------------------------------------------------------
       W-02 · CNC simulator
       --------------------------------------------------------------- */
    sim: {
      code: "W-02",
      name: "CNC simulator",
      model: "Ace Micromatic CNC Simulator · Fanuc / Sinumerik",
      family: "machine",
      access: "self",
      status: "up",

      summary: "A training console for learning and dry-running CNC programs before you take them to a real machine.",
      goodFor: "Practice programs for the mill and lathe, with zero risk",

      specs: {
        "Controls": "Switchable Fanuc / Sinumerik",
        "Modes": "Turning and milling",
        "Displays": "Machine view + control screen",
        "Operator inputs": "Handwheel, overrides, E-stop, foot pedal",
      },

      allowed: [
        "Your own G-code programs",
        "Lab exercise programs",
        "Any time the lab is open",
      ],

      never: [
        "Moving it with the castor brakes off",
        "Taking an unsimulated program to the mill or lathe",
      ],

      steps: [
        "Put the brakes on the castors before you start.",
        "Pick the controller: Fanuc or Sinumerik.",
        "Pick the mode: turning or milling.",
        "Load your program and set the virtual stock.",
        "Run it in single-block and watch the machine view.",
        "Try the overrides and the handwheel.",
        "Fix anything that crashes, then run it again end to end.",
        "Note the cycle time. It feeds your cost estimate.",
      ],

      stopIf: "Nothing on this console can hurt you. If the screen freezes, tell staff rather than unplugging it.",

      facts: [
        "Crashing the simulator costs nothing. Crashing the mill can cost a spindle.",
        "The same console switches between the two most common CNC controllers in Indian industry.",
        "Cycle time from a dry run is the best input for the cost estimator.",
      ],

      // SOP and videos
      sop: "https://drive.google.com/drive/folders/1UD1PsJmriH8duaTD1tXL3zlnfq1Kyizo",
      videos: [
        { youtube: "5Rew-s_6Twg", title: "G and M code basics", channel: "Stuart de Haro" },
        { youtube: "ZMvWzYxTQGs", title: "Basic CNC programming with a Fanuc simulator", channel: "AKC CAD/CAM" },
      ],

      // Training (switched off for now)
      lessons: [
        { title: "Fanuc and Sinumerik basics", length: "6 min", points: [
          "The control panel, mode by mode",
          "G-code you'll actually use",
          "Switching controllers",
        ] },
        { title: "Dry-running a program", length: "5 min", points: [
          "Single-block",
          "Reading the machine view",
          "Spotting rapids through stock",
        ] },
        { title: "Overrides, handwheel and E-stop", length: "4 min", points: [
          "Feed and spindle overrides",
          "Jogging with the handwheel",
          "Practising the E-stop",
        ] },
      ],
      quiz: [
        {
          question: "What do you do before using the simulator?",
          answers: [
            "Nothing",
            "Put the castor brakes on",
            "Switch the mill on",
            "Wear gloves",
          ],
          correct: 2,
          why: "It's on wheels. Brakes on first.",
        },
        {
          question: "Why simulate before cutting metal?",
          answers: [
            "It's faster",
            "Mistakes cost nothing here",
            "The mill needs it",
            "It isn't needed",
          ],
          correct: 2,
          why: "A crash on the console is free. A crash on the mill is expensive and dangerous.",
        },
        {
          question: "What does feed override at 10% do?",
          answers: [
            "Runs at 10% of programmed feed",
            "Uses 10% of the tools",
            "Stops after 10%",
            "Adds 10% coolant",
          ],
          correct: 1,
          why: "It slows every feed move so you can stop before trouble.",
        },
      ],
    },

    /* ---------------------------------------------------------------
       W-03 · Waterjet cutter
       --------------------------------------------------------------- */
    waterjet: {
      code: "W-03",
      name: "Waterjet cutter",
      model: "OMAX ProtoMAX · abrasive waterjet, 30,000 psi",
      family: "cut",
      access: "induction",
      status: "up",

      summary: "Cuts flat profiles in metal, glass, stone, composite and plastic with sand and water, so there's no heat-affected zone.",
      goodFor: "Metal plates, brackets, gaskets, glass and stone shapes, composite panels",

      specs: {
        "Cutting travel": "304 × 304 mm · 25 mm Z",
        "Pump": "3.7 kW at 2068 bar",
        "Speed": "Up to 2540 mm/min",
        "Accuracy": "0.127 mm",
        "Supply": "230 – 240 V AC · 1 ph · 30 A",
      },

      allowed: [
        "Aluminium, mild and stainless steel, brass",
        "Glass and stone",
        "Carbon fibre and composites",
        "Acrylic and other plastics",
      ],

      never: [
        "Opening the lid while it cuts",
        "Hands anywhere near the nozzle",
        "Starting without checking abrasive and water",
        "Tempered glass. It shatters",
      ],

      steps: [
        "Export your outline as a DXF, 1:1 in millimetres.",
        "Check the abrasive hopper and the water level.",
        "Place and weight the sheet on the slats.",
        "Set material and thickness in the software.",
        "Close the lid.",
        "Start the cut. Keep hands clear of the nozzle.",
        "Wait for the jet to stop fully before opening the lid.",
        "Lift parts out, rinse them and dry them.",
        "Clear offcuts and log the job.",
      ],

      stopIf: "Water spraying outside the tank, a sudden change in sound, or the part shifting. Stop the cut and call staff.",

      facts: [
        "30,000 psi is about 2,000 times the air pressure around you.",
        "Cutting with water means no heat-affected zone. The metal next to the cut stays the way it was.",
        "The jet goes through 25 mm of steel and glass with the same nozzle.",
      ],

      // SOP and videos
      sop: "https://drive.google.com/drive/folders/1Ztvg8zG5JuewYHx4kJ9iw1StLoTujXnU",
      videos: [
        { youtube: "voREjKytrH0", title: "ProtoMAX waterjet at IIT Delhi Makerspace", channel: "Makerspace IIT Delhi" },
        { youtube: "Nl1WAAVBWCM", title: "Using the ProtoMAX waterjet: procedure and safety", channel: "UoS iForge" },
      ],

      // Training (switched off for now)
      lessons: [
        { title: "Cutting with water and sand", length: "4 min", points: [
          "Why there's no heat-affected zone",
          "What the abrasive does",
          "Speed versus edge quality",
        ] },
        { title: "Preparing a DXF", length: "5 min", points: [
          "Closed outlines, 1:1, millimetres",
          "Pierce points and lead-ins",
          "Tabs so parts don't drop",
        ] },
        { title: "Abrasive, water and the lid", length: "3 min", points: [
          "Pre-start checks",
          "Lid closed, hands clear",
          "Rinsing parts afterwards",
        ] },
      ],
      quiz: [
        {
          question: "Why can the waterjet cut heat-sensitive materials?",
          answers: [
            "The water is chilled",
            "There's no heat-affected zone",
            "It cuts slowly",
            "It uses a laser",
          ],
          correct: 2,
          why: "It erodes the material with abrasive and water, so nothing next to the cut gets hot.",
        },
        {
          question: "What do you check before every cut?",
          answers: [
            "Abrasive and water",
            "Only the file",
            "The weather",
            "Nothing",
          ],
          correct: 1,
          why: "No abrasive means no cut. No water means no jet.",
        },
        {
          question: "When can you open the lid?",
          answers: [
            "Any time",
            "Once the jet has fully stopped",
            "Halfway through",
            "When it gets loud",
          ],
          correct: 2,
          why: "Ultra-high pressure. Lid closed and hands clear while it runs.",
        },
      ],
    },

    /* ---------------------------------------------------------------
       W-04 · CNC router
       --------------------------------------------------------------- */
    router: {
      code: "W-04",
      name: "CNC router",
      model: "Enclosed gantry CNC router · dust extraction",
      family: "cut",
      access: "induction",
      status: "up",

      summary: "Profiles and engraves sheet material: wood, acrylic, composites and soft metals, inside a full glass enclosure.",
      goodFor: "Acrylic panels, plywood furniture parts, engraved signs, composite plates",

      specs: {
        "Configuration": "Gantry with vertical Z axis",
        "Guarding": "Full glass enclosure",
        "Extraction": "Dust hose, run it always",
        "Workholding": "Clamp or screw stock down",
      },

      allowed: [
        "Cast acrylic",
        "Plywood and MDF",
        "Composites",
        "Soft metals like aluminium, at low feed",
      ],

      never: [
        "Unclamped stock. It becomes a projectile",
        "Running without extraction",
        "Reaching in while the spindle turns",
      ],

      steps: [
        "Export your outline as a DXF and set cut depth per pass.",
        "Check the sheet is flat. A bowed sheet lifts into the cutter.",
        "Clamp or screw the stock down.",
        "Add tabs so cut-out parts stay attached.",
        "Zero X and Y at the sheet corner, Z on the surface.",
        "Dry-run with the spindle off and Z raised.",
        "Close the guard and start extraction, then the spindle.",
        "Never reach in while the spindle turns.",
        "Cut tabs at the bench with a hand tool.",
      ],

      stopIf: "A squeal, melting or stringing behind the cutter, or the sheet moving. Feed hold, then spindle stop, then call staff.",

      facts: [
        "Cast acrylic chips cleanly. Extruded acrylic melts and welds back together behind the cutter.",
        "Tabs keep every cut-out part captive until the spindle stops.",
        "The dust hose isn't optional. MDF dust is the reason.",
      ],

      // SOP and videos
      sop: "https://drive.google.com/drive/folders/1H8-BkCEWoPUptdkQZmtg_TvHAcTBoNcv",
      videos: [
        { youtube: "TuH8WfL_-8s", title: "Getting started with CNC machines: safe operation", channel: "Makera" },
        { youtube: "l1oh8nekPu4", title: "How to use a CNC router, step by step", channel: "IDC Woodcraft" },
      ],

      // Training (switched off for now)
      lessons: [
        { title: "Workholding", length: "5 min", points: [
          "Clamping and screwing down",
          "Tabs: how many and where",
          "Checking a sheet for bow",
        ] },
        { title: "Feeds, speeds and melting acrylic", length: "5 min", points: [
          "Cast versus extruded",
          "Depth per pass",
          "Recognising melting early",
        ] },
        { title: "Guard, extraction, start", length: "3 min", points: [
          "Order of operations",
          "Dry run",
          "Never reaching in",
        ] },
      ],
      quiz: [
        {
          question: "Why do cut-out parts need tabs?",
          answers: [
            "To make them stronger",
            "So the loose part isn't thrown by the cutter",
            "To save material",
            "For the extraction",
          ],
          correct: 2,
          why: "A freed part under a spinning cutter gets launched.",
        },
        {
          question: "What starts first?",
          answers: [
            "The spindle",
            "Extraction, then the spindle",
            "The job, then extraction",
            "Nothing in particular",
          ],
          correct: 2,
          why: "Clamp the stock, close the guard, start extraction, then the spindle.",
        },
        {
          question: "Mid-cut, the sheet moves. What do you do?",
          answers: [
            "Hold it down by hand",
            "Feed hold, then stop the spindle",
            "Speed up",
            "Ignore it",
          ],
          correct: 2,
          why: "Never put hands near a running spindle. Stop motion, then the spindle.",
        },
      ],
    },

    /* ---------------------------------------------------------------
       W-05 · CNC lathe
       --------------------------------------------------------------- */
    lathe: {
      code: "W-05",
      name: "CNC lathe",
      model: "BFW CNC Turning Centre · FANUC 0i-TF Plus",
      family: "machine",
      access: "induction",
      status: "up",

      summary: "Turns round parts: shafts, bushes, threads, bores and faces from bar and billet.",
      goodFor: "Shafts, bushes, spacers, threaded parts, pulleys",

      specs: {
        "Control": "FANUC 0i-TF Plus",
        "Workholding": "3-jaw chuck + tailstock",
        "Tooling": "Turret with coolant",
        "Paths · guarding": "Up to 2 · full enclosure",
      },

      allowed: [
        "Aluminium bar",
        "Mild steel and brass bar",
        "Delrin and nylon rod",
      ],

      never: [
        "Leaving the chuck key in the chuck",
        "Gloves or loose sleeves near the spindle",
        "Bar sticking out of the chuck without support",
      ],

      steps: [
        "Simulate the program on W-02 first.",
        "Check the bar diameter and length against the program.",
        "Chuck the bar with the right stick-out. Use the tailstock on long parts.",
        "Chuck key out before you start. Every time.",
        "No gloves, no loose sleeves.",
        "Set tool offsets with staff.",
        "Run single-block with the guard closed.",
        "Wait for the spindle to stop before opening the door.",
        "Clear chips with the hook and brush.",
      ],

      stopIf: "Chatter, the part slipping in the jaws, or smoke from the cut. Feed hold and call staff.",

      facts: [
        "A chuck key left in the chuck becomes a projectile at the first spin.",
        "Two paths means two tools can cut at once.",
        "Long thin parts need the tailstock or they whip and chatter.",
      ],

      // SOP and videos
      sop: "https://drive.google.com/drive/folders/1ugjVNbnwUtCRj9fvsY3PIbE9uIFGF4vN",
      videos: [
        { youtube: "cJYRuzNlloY", title: "CNC lathe for beginners", channel: "Practical Machinist" },
        { youtube: "y_uSBlT6sbg", title: "Basics of the CNC lathe", channel: "Knowledge Podium Systems" },
      ],

      // Training (switched off for now)
      lessons: [
        { title: "Turning basics", length: "5 min", points: [
          "Facing, turning, boring, threading",
          "Stock sizes and stick-out",
          "Why round parts go on a lathe",
        ] },
        { title: "Chuck, tailstock and turret", length: "5 min", points: [
          "Chucking safely",
          "When to use the tailstock",
          "Turret tools and offsets",
        ] },
        { title: "Running a program", length: "4 min", points: [
          "Single-block",
          "Guard and coolant",
          "Chip handling",
        ] },
      ],
      quiz: [
        {
          question: "What do you check before pressing cycle start?",
          answers: [
            "Chuck key is out",
            "The lights are on",
            "Coolant colour",
            "Nothing",
          ],
          correct: 1,
          why: "Chuck key out before you start. It's the oldest lathe rule there is.",
        },
        {
          question: "Why no gloves near the spindle?",
          answers: [
            "They get dirty",
            "They can wrap around the work and pull you in",
            "They're too warm",
            "They're fine",
          ],
          correct: 2,
          why: "No gloves, no loose sleeves near the spindle.",
        },
        {
          question: "A 200 mm long, 15 mm thin shaft. What else do you use?",
          answers: [
            "Nothing",
            "The tailstock",
            "A bigger chuck",
            "Faster speed",
          ],
          correct: 2,
          why: "Long, thin parts deflect and chatter without support at the free end.",
        },
      ],
    },

    /* ---------------------------------------------------------------
       W-06 · Wire EDM
       --------------------------------------------------------------- */
    edm: {
      code: "W-06",
      name: "Wire EDM",
      model: "Electronica SPRINTCUT · ELPULS 40",
      family: "machine",
      access: "staff",
      status: "up",

      summary: "Cuts hardened conductive metal to fine tolerance with sparks along a 0.25 mm wire. Dies, punches, inserts and tapered profiles.",
      goodFor: "Dies, punches, inserts, tapered profiles, hardened parts",

      specs: {
        "Travel": "300 × 400 mm · aux 80 × 80 mm",
        "Job height · taper": "200 mm · ±30° over 50 mm",
        "Wire · finish": "0.25 mm · 0.8 µm Ra",
        "Dielectric · supply": "Deionised water · 10 kVA",
      },

      allowed: [
        "Hardened tool steel",
        "Mild and stainless steel",
        "Aluminium, copper and brass",
        "Any electrically conductive material",
      ],

      never: [
        "Non-conductive materials. It can't cut them",
        "Running it yourself. Staff set up and start every job",
      ],

      steps: [
        "Design the profile and export a DXF, 1:1 in millimetres.",
        "Mark any internal profile that needs a start hole.",
        "Note the job height and any taper angle.",
        "Submit the job through the front desk.",
        "Staff thread the wire, set up and start.",
        "Collect your part when staff tell you it's done.",
      ],

      stopIf: "This is a staff-run machine. If anything looks wrong, tell staff. Don't touch the controls.",

      facts: [
        "Nothing touches the metal. Thousands of sparks a second erode it away.",
        "A 0.8 µm Ra finish is smoother than most ground surfaces.",
        "The wire can tilt to cut ±30° tapers, which is how dies get their draft.",
      ],

      // SOP and videos
      sop: "https://drive.google.com/drive/folders/1rWB42yx_pDpzOmWhhJOBaxuHvj_LB650",
      videos: [
        { youtube: "W1YFP8bmEKY", title: "How wire EDM works, part 1", channel: "ReliableEDM" },
        { youtube: "JM-94MoOjx0", title: "How wire EDM works, part 2", channel: "ReliableEDM" },
      ],

      // Training (switched off for now)
      lessons: [
        { title: "What wire EDM does", length: "4 min", points: [
          "Sparks, wire and deionised water",
          "Why only conductive metal",
          "Tolerances and finish",
        ] },
        { title: "Designing for EDM", length: "5 min", points: [
          "Start holes for internal profiles",
          "Corner radius and wire size",
          "Taper and job height",
        ] },
        { title: "Submitting a job", length: "3 min", points: [
          "What staff need from you",
          "Lead times",
          "Collecting the part",
        ] },
      ],
      quiz: [
        {
          question: "Can wire EDM cut acrylic?",
          answers: [
            "Yes",
            "No, it only cuts conductive material",
            "Only thin acrylic",
            "Only with taper",
          ],
          correct: 2,
          why: "EDM needs the spark to jump between the wire and the work, so the work must conduct.",
        },
        {
          question: "Who starts the machine?",
          answers: [
            "You, after the module",
            "Staff only",
            "Anyone",
            "Your supervisor",
          ],
          correct: 2,
          why: "High voltage and water. Staff set-up and start only.",
        },
        {
          question: "Your part has an internal window. What does it need?",
          answers: [
            "Nothing",
            "A start hole for the wire",
            "A thicker wire",
            "A taper",
          ],
          correct: 2,
          why: "The wire has to be threaded through the material before it can cut an internal profile.",
        },
      ],
    },

    /* ---------------------------------------------------------------
       W-07 · Robot arm cell
       --------------------------------------------------------------- */
    robot: {
      code: "W-07",
      name: "Robot arm cell",
      model: "FANUC ER-4iA · R-30iB Mate Plus",
      family: "robot",
      access: "induction",
      status: "up",

      summary: "A six-axis educational robot cell for learning programming, pick-and-place, machine tending and vision-guided handling.",
      goodFor: "Pick-and-place routines, vision sorting, machine-tending demos",

      specs: {
        "Axes · payload": "6 axes · 4 kg",
        "Reach": "550 mm",
        "Repeatability": "±0.01 mm · 20 kg arm",
        "Included": "iRVision · touchscreen iPendant",
      },

      allowed: [
        "Teaching at reduced speed",
        "Vision-guided pick-and-place",
        "Programs reviewed by staff",
      ],

      never: [
        "Standing inside the cell while the arm moves",
        "Teaching at full speed",
        "Letting go of the enable switch without stopping",
      ],

      steps: [
        "Check the cell gate and the emergency stops.",
        "Pick up the iPendant and hold the enable switch.",
        "Set speed to reduced for teaching.",
        "Jog joint by joint, then in world frame.",
        "Teach points and record them.",
        "Step through the program with the pendant in hand.",
        "Leave the cell and close the gate before running at speed.",
        "Watch from outside the cell.",
        "Save your program and log the session.",
      ],

      stopIf: "The arm moves unexpectedly or the gate opens during a run. Let go of the enable switch or hit E-stop.",

      facts: [
        "±0.01 mm repeatability means it returns to the same point within a hundredth of a millimetre.",
        "iRVision lets the robot find a part by camera instead of by fixed position.",
        "The arm weighs 20 kg and carries 4 kg.",
      ],

      // SOP and videos
      sop: "https://drive.google.com/drive/folders/16zmPijeKLp8gtIk_B_S6Wkrmn_TNPcs5",
      videos: [
        { youtube: "fTYUtNtldi0", title: "FANUC teach pendant: jogging a joint", channel: "Shane Welcher" },
        { youtube: "TxOmoFZATO4", title: "FANUC teach pendant: jogging in WORLD", channel: "Shane Welcher" },
      ],

      // Training (switched off for now)
      lessons: [
        { title: "Six axes and frames", length: "5 min", points: [
          "Joint versus world jogging",
          "Tool frames",
          "Reach and payload",
        ] },
        { title: "The pendant and the enable switch", length: "5 min", points: [
          "Deadman behaviour",
          "Reduced speed",
          "Recording points",
        ] },
        { title: "Vision-guided picks", length: "5 min", points: [
          "Calibrating iRVision",
          "Finding a part",
          "Pick and place",
        ] },
      ],
      quiz: [
        {
          question: "Where do you stand when the program runs at speed?",
          answers: [
            "Next to the arm",
            "Outside the cell, gate closed",
            "Wherever",
            "Under the arm",
          ],
          correct: 2,
          why: "Stay outside the cell while the arm moves.",
        },
        {
          question: "How do you teach new points?",
          answers: [
            "At full speed",
            "At reduced speed, pendant in hand",
            "Without the pendant",
            "By pushing the arm",
          ],
          correct: 2,
          why: "Teach at reduced speed with the pendant and enable switch.",
        },
        {
          question: "The arm moves unexpectedly. What do you do?",
          answers: [
            "Grab it",
            "Release the enable switch or hit E-stop",
            "Shout",
            "Wait",
          ],
          correct: 2,
          why: "Letting go of the enable switch stops motion immediately.",
        },
      ],
    },

    /* ---------------------------------------------------------------
       W-08 · Laser welder
       --------------------------------------------------------------- */
    weld: {
      code: "W-08",
      name: "Laser welder",
      model: "Handheld fiber laser · 2 units, CW 1080 nm",
      family: "robot",
      access: "staff",
      status: "down",

      summary: "Handheld fiber laser for welding sheet metal, thin cutting, and stripping rust, paint or oxide from surfaces.",
      goodFor: "Sheet metal enclosures, stainless frames, rust and paint removal",

      specs: {
        "Power": "1500 / 2000 / 3000 W",
        "Weld capacity (SS)": "3.5 / 4 / 6 mm",
        "Cleaning · wire": "1 – 20 mm width · up to 1.6 mm",
        "Gas · cooling": "Nitrogen or argon · water chiller",
      },

      allowed: [
        "Stainless and mild steel sheet",
        "Aluminium, with staff settings",
        "Rust and paint stripping",
      ],

      never: [
        "Entering the bay without rated eyewear",
        "Running without fume extraction",
        "Welding with the screens open",
      ],

      steps: [
        "Bring your parts and drawing to the front desk.",
        "Staff check the joint design and material.",
        "Rated eyewear on before entering the bay.",
        "Screens in place, fume extraction on.",
        "Staff run the weld.",
        "Parts cool in the bay before collection.",
      ],

      stopIf: "Staff-run machine. If you're in the bay and something looks wrong, step back and tell staff.",

      facts: [
        "Class 4 laser: even a reflection can damage eyes.",
        "The same gun welds, cuts thin sheet and cleans rust.",
        "A fiber laser weld is narrow, so parts distort far less than with an arc.",
      ],

      // SOP and videos
      sop: "https://drive.google.com/drive/folders/1EIxcb4ktAaMX9FwdB-iicWjxpGBHb8eY",
      videos: [
        { youtube: "fHeuMZEMUVI", title: "Handheld laser welding safety tips", channel: "JASIC" },
        { youtube: "3NHJyv1HwQU", title: "How handheld fibre laser welding works", channel: "Narran Laser" },
      ],

      // Training (switched off for now)
      lessons: [
        { title: "What a fiber laser welder does", length: "4 min", points: [
          "Welding, cutting and cleaning",
          "Why the weld is narrow",
          "Material limits",
        ] },
        { title: "Laser safety", length: "5 min", points: [
          "Class 4 hazards",
          "Eyewear, screens and the bay",
          "Fume extraction",
        ] },
        { title: "Preparing parts for staff", length: "3 min", points: [
          "Clean, fitted joints",
          "Drawings and weld symbols",
          "Collection",
        ] },
      ],
      quiz: [
        {
          question: "What do you need before entering the bay?",
          answers: [
            "Nothing",
            "Rated laser eyewear",
            "Sunglasses",
            "Gloves only",
          ],
          correct: 2,
          why: "Class 4 laser. Rated eyewear inside the bay, always.",
        },
        {
          question: "Who operates the laser welder?",
          answers: [
            "Anyone with the module",
            "Staff only",
            "Your lab partner",
            "No one",
          ],
          correct: 2,
          why: "It's staff run only. You prepare parts and drawings.",
        },
        {
          question: "Why must the screens be in place?",
          answers: [
            "For privacy",
            "Reflections can injure people outside the bay",
            "To keep heat in",
            "They aren't needed",
          ],
          correct: 2,
          why: "Stray beams and reflections are a hazard to everyone nearby.",
        },
      ],
    },

  },
};
