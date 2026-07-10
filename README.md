# 🚀 Weather Time Machine

A playful, kid‑friendly web app that lets children explore **real weather — past, present, and
future** — from almost anywhere on Earth, and watch it come alive with **interactive animations**.

Pick a city, spin the dial to any day (all the way back to **1940** or up to **15 days into the
future**), press **Travel in time!**, and the scene fills with sunshine, drifting clouds, falling
rain, gentle snow, or crackling thunderstorms. For today it even shows the **live "right now"
conditions**. A friendly cloud mascot named **Nimbus** reacts and explains what's happening in
simple words.

![Weather for kids](https://img.shields.io/badge/made%20for-curious%20kids-ff8a3d)

## ✨ What kids can do

- **Search any place** in the world (with a fun autocomplete) or tap a preset city.
- **Travel to any day** — the past (birthdays, holidays, "the day I was born!" back to 1940),
  **today** (with live current conditions), or the **future** (forecast up to 15 days ahead).
- **Quick jumps** with **Today**, **Tomorrow**, and **Surprise me!** buttons.
- **Watch the weather animate**: sun rays, floating clouds, rain and snow particles, lightning
  flashes, rainbows, and a starry night mode.
- **Read it in a fun way**: an animated thermometer, rain/snow/wind gauges, and kid‑level
  descriptions ("🥶 Cold! Hats and gloves time!").
- **Learn the "why"**: friendly explanations of why it rains, snows, thunders, and more, plus a
  rotating **"Did you know?"** fun‑fact panel.
- **Toggle** between °C/°F, Day/Night, and optional gentle weather **sounds**.

## 🧑‍💻 How to run locally

No build step, no installs — it's plain HTML, CSS, and JavaScript in the `public/` folder.

**Option A — just open it**

Double‑click `public/index.html` (or drag it into your browser).

**Option B — Node (matches how it runs in production)**

```bash
npm start
```

Then open <http://localhost:3000>. (Set a different port with `PORT=8080 npm start`.)

**Option C — Python (no Node needed)**

```bash
cd public
python -m http.server 8000
```

Then open <http://localhost:8000>.

## 📁 Project structure

```
Weather/
├── public/                  # 👈 the deployable static site
│   ├── index.html           #    Page structure (controls, scene, cards, facts)
│   ├── styles.css           #    Kid-friendly design + CSS weather animations
│   ├── app.js               #    Data fetching, scene rendering, particles, sounds
│   └── .nojekyll            #    Tells GitHub Pages to serve files as-is
├── server.js                # Tiny zero-dependency static server (local + Node hosts)
├── package.json             # `npm start` script + Node engine
├── render.yaml              # Render Blueprint (static site)
├── .github/workflows/
│   └── deploy.yml           # Auto-deploy to GitHub Pages on push to main
├── .gitignore
└── README.md
```

## ☁️ Deploy

The site is a **static site** — the whole `public/` folder can be hosted anywhere. Two easy paths:

### Push to GitHub first

```bash
git init
git add .
git commit -m "Weather Time Machine"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

### Deploy to Render

1. Push the repo to GitHub (above).
2. In [Render](https://render.com), click **New +** → **Blueprint** and pick your repo.
3. Render reads `render.yaml` and deploys the `public/` folder to its global CDN. Done!

<sub>Prefer clicking around? Use **New +** → **Static Site**, set **Publish Directory** to `public`, and leave the build command blank.</sub>

### Deploy to GitHub Pages

1. Push the repo to GitHub (above).
2. In your repo, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. The included workflow (`.github/workflows/deploy.yml`) publishes `public/` on every push to `main`.
   Your site appears at `https://<your-username>.github.io/<your-repo>/`.

> Both hosts serve the exact same static files — no server, no API keys, no secrets.

## 🌍 Where the data comes from

Real weather data is provided by the free **[Open‑Meteo](https://open-meteo.com/)** APIs — no API
key required:

- **Geocoding API** – turns a city name into a location on the map.
- **Historical Weather API** – daily records going back to **1940** (used for older dates).
- **Forecast API** – live current conditions plus the forecast up to ~15 days ahead (used for
  recent, today, and future dates).

The app automatically picks the right source based on the date you choose. Data is fetched live in
the browser, so an **internet connection is required**.

## 🎨 Notes for grown‑ups

- Everything runs client‑side; no data about the child is collected or sent anywhere except the
  weather lookups to Open‑Meteo.
- Animations respect the system **"reduce motion"** accessibility setting.
- Sound is **off by default** and only starts after a tap (browser‑friendly).

Enjoy exploring the weather of the past! 🌈
