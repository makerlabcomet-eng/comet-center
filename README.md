# Comet Center

Student portal for **Comet Center**, the fabrication and prototyping lab at IIT Hyderabad.

**Live preview:** https://makerlabcomet-eng.github.io/comet-center/

> This is an early prototype shared for feedback. Sign-in, bookings, passes and training progress are saved only in your own browser, and booked slots from other people are example data. Material rates are placeholders.

## What it does

- **Find a machine:** a four-question finder recommends the right machine for your job.
- **Machine bay:** all 15 machines with live 3D models, specs and safety rules.
- **Training:** short lessons and a quiz for each machine. Passing issues an access pass.
- **Cost estimator:** drop an STL, OBJ or DXF file to estimate time, material and price. The file never leaves your browser.
- **Booking:** pick a machine, day and hourly slots.
- **My passes:** your bookings, training progress and issued passes.

## Giving feedback

Open an issue on this repo, or send your notes to the lab team. Screenshots help.

## Run it locally

It's a single HTML file. Serve the folder and open it in a browser:

```
npx http-server . -p 8080
```

Then go to http://127.0.0.1:8080.

## What's next

The build plan, including the Firebase backend and the staff dashboard, is in [`docs/BRIEF.md`](docs/BRIEF.md).
