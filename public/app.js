"use strict";

/* ============================================================
   Weather Time Machine
   Historical weather explorer for kids, powered by Open-Meteo.
   ============================================================ */

/* ---------- WMO weather code → kid-friendly meaning ---------- */
const WEATHER_CODES = {
  0:  { cat: "clear",  label: "Clear and sunny",   emoji: "☀️" },
  1:  { cat: "clear",  label: "Mostly sunny",      emoji: "🌤️" },
  2:  { cat: "cloudy", label: "Partly cloudy",     emoji: "⛅" },
  3:  { cat: "cloudy", label: "Cloudy",            emoji: "☁️" },
  45: { cat: "fog",    label: "Foggy",             emoji: "🌫️" },
  48: { cat: "fog",    label: "Icy fog",           emoji: "🌫️" },
  51: { cat: "rain",   label: "Light drizzle",     emoji: "🌦️" },
  53: { cat: "rain",   label: "Drizzle",           emoji: "🌦️" },
  55: { cat: "rain",   label: "Heavy drizzle",     emoji: "🌧️" },
  56: { cat: "rain",   label: "Freezing drizzle",  emoji: "🌧️" },
  57: { cat: "rain",   label: "Freezing drizzle",  emoji: "🌧️" },
  61: { cat: "rain",   label: "Light rain",        emoji: "🌦️" },
  63: { cat: "rain",   label: "Rainy",             emoji: "🌧️" },
  65: { cat: "rain",   label: "Heavy rain",        emoji: "🌧️" },
  66: { cat: "rain",   label: "Freezing rain",     emoji: "🌧️" },
  67: { cat: "rain",   label: "Freezing rain",     emoji: "🌧️" },
  71: { cat: "snow",   label: "Light snow",        emoji: "🌨️" },
  73: { cat: "snow",   label: "Snowy",             emoji: "❄️" },
  75: { cat: "snow",   label: "Heavy snow",        emoji: "❄️" },
  77: { cat: "snow",   label: "Snow grains",       emoji: "🌨️" },
  80: { cat: "rain",   label: "Rain showers",      emoji: "🌦️" },
  81: { cat: "rain",   label: "Rain showers",      emoji: "🌧️" },
  82: { cat: "rain",   label: "Heavy showers",     emoji: "🌧️" },
  85: { cat: "snow",   label: "Snow showers",      emoji: "🌨️" },
  86: { cat: "snow",   label: "Heavy snow showers",emoji: "❄️" },
  95: { cat: "storm",  label: "Thunderstorm",      emoji: "⛈️" },
  96: { cat: "storm",  label: "Storm with hail",   emoji: "⛈️" },
  99: { cat: "storm",  label: "Big thunderstorm",  emoji: "⛈️" }
};

/* ---------- Kid-friendly explanations per weather type ---------- */
const EXPLAINERS = {
  clear: {
    title: "Why is the sky so blue? 🔵",
    text: "Sunlight is secretly made of every color mixed together. When it zooms through the air, the tiny bits of air bounce the blue light all around the sky — so everywhere you look, it looks blue!"
  },
  cloudy: {
    title: "What are clouds made of? ☁️",
    text: "Clouds are made of billions of teeny-tiny water droplets floating in the air. When lots of them gather together, they look like big fluffy cotton balls in the sky."
  },
  rain: {
    title: "Why does it rain? 🌧️",
    text: "The sun warms up water and turns it into invisible vapor that floats way up high. Up there it cools into droplets that join to make clouds. When the droplets get too heavy — plop! — they fall down as rain."
  },
  snow: {
    title: "How does snow happen? ❄️",
    text: "When it's really cold, the water up in the clouds freezes into tiny ice crystals. They stick together into snowflakes and float gently down. Fun fact: every snowflake has exactly 6 sides!"
  },
  storm: {
    title: "What makes thunder and lightning? ⛈️",
    text: "Inside tall storm clouds, ice and water bump around and build up electricity. It jumps out as a bright flash of lightning. The BOOM you hear afterward is thunder — the sound of the air getting super hot super fast!"
  },
  fog: {
    title: "What is fog? 🌫️",
    text: "Fog is really just a cloud that came down to say hello at ground level! It's made of tiny water droplets in the air near the ground that you can walk right through."
  }
};

/* ---------- Fun facts ---------- */
const FUN_FACTS = [
  "Lightning is about 5 times hotter than the surface of the Sun! 🔥",
  "A single fluffy cloud can weigh as much as 100 elephants! 🐘",
  "No two snowflakes are ever exactly the same. ❄️",
  "Rainbows are actually full circles — from the ground we only see the top arch! 🌈",
  "Thunder can be heard from up to 25 kilometres away. 🔊",
  "Snow isn't really white — the crystals are clear! It just looks white because of how light bounces. ✨",
  "Some deserts can go years without a single drop of rain. 🏜️",
  "Wind is simply air moving from one place to another. 🍃",
  "The hottest temperature ever recorded was over 56°C in Death Valley, USA. 🥵",
  "The coldest ever was about −89°C in Antarctica. Brrr! 🧊",
  "Hailstones can grow as big as oranges before they fall! 🍊",
  "Raindrops aren't shaped like teardrops — they're more like tiny hamburger buns! 🍔",
  "A hurricane can release more energy in a day than a huge power plant makes in a year. 🌀",
  "The wettest place on Earth gets rain almost every single day. ☔"
];

/* ---------- Preset city fun descriptions ---------- */

/* ============================================================
   State
   ============================================================ */
const state = {
  place: { name: "Toronto, Canada", lat: 43.7001, lon: -79.4163 },
  units: "metric",          // 'metric' | 'imperial'
  night: false,
  sound: false,
  factIndex: 0,
  particles: { mode: "none", intensity: 0, wind: 0 } // mode: none|rain|snow|storm
};

/* ============================================================
   DOM refs
   ============================================================ */
const $ = (id) => document.getElementById(id);
const els = {
  cityInput: $("cityInput"),
  suggestions: $("suggestions"),
  presetChips: $("presetChips"),
  dateInput: $("dateInput"),
  dateQuick: $("dateQuick"),
  surpriseBtn: $("surpriseBtn"),
  travelBtn: $("travelBtn"),

  unitToggle: $("unitToggle"), unitLabel: $("unitLabel"),
  dayNightToggle: $("dayNightToggle"), dayNightEmoji: $("dayNightEmoji"), dayNightLabel: $("dayNightLabel"),
  soundToggle: $("soundToggle"), soundEmoji: $("soundEmoji"), soundLabel: $("soundLabel"),

  scene: $("scene"),
  rainbow: $("rainbow"),
  fx: $("fx"),
  mascot: $("mascot"), mascotMouth: $("mascotMouth"), mascotSpeech: $("mascotSpeech"),

  readoutWhen: $("readoutWhen"), readoutNow: $("readoutNow"),
  readoutPlace: $("readoutPlace"), readoutDate: $("readoutDate"),
  readoutTemp: $("readoutTemp"), readoutCondition: $("readoutCondition"),
  sceneStatus: $("sceneStatus"), statusText: $("statusText"),

  thermoFill: $("thermoFill"), tempMax: $("tempMax"), tempMin: $("tempMin"), tempNote: $("tempNote"),
  rainEmoji: $("rainEmoji"), rainAmount: $("rainAmount"), rainNote: $("rainNote"),
  windEmoji: $("windEmoji"), windAmount: $("windAmount"), windNote: $("windNote"),
  snowEmoji: $("snowEmoji"), snowAmount: $("snowAmount"), snowNote: $("snowNote"),

  factText: $("factText"), nextFactBtn: $("nextFactBtn"),
  explainerTitle: $("explainerTitle"), explainerText: $("explainerText")
};

/* ============================================================
   Helpers
   ============================================================ */
const pad = (n) => String(n).padStart(2, "0");
const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

function todayISO() { return toISO(new Date()); }

// Whole-day difference between two ISO dates (a - b).
function dayDiff(aISO, bISO) {
  const a = new Date(aISO + "T00:00:00");
  const b = new Date(bISO + "T00:00:00");
  return Math.round((a - b) / 86400000);
}

// Friendly relative label, e.g. "Today", "Tomorrow", "In 5 days", "3 years ago".
function relativeLabel(diff) {
  if (diff === 0) return "📅 Today";
  if (diff === 1) return "🔮 Tomorrow";
  if (diff === -1) return "🕰️ Yesterday";
  if (diff > 1) return `🔮 In ${diff} days`;
  const ago = -diff;
  if (ago < 45) return `🕰️ ${ago} days ago`;
  if (ago < 365) return `🕰️ ${Math.round(ago / 30)} months ago`;
  const years = ago / 365;
  return `🕰️ ${years < 1.5 ? "1 year" : Math.round(years) + " years"} ago`;
}

function prettyDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function cToF(c) { return c * 9 / 5 + 32; }
function kmhToMph(k) { return k * 0.621371; }
function mmToIn(mm) { return mm / 25.4; }
function cmToIn(cm) { return cm / 2.54; }

function tempStr(c) {
  if (c === null || c === undefined || Number.isNaN(c)) return "--°";
  return state.units === "imperial"
    ? `${Math.round(cToF(c))}°F`
    : `${Math.round(c)}°C`;
}

/* ============================================================
   Networking (Open-Meteo — free, no API key)
   ============================================================ */
async function geocode(query) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("geocode failed");
  const data = await res.json();
  return data.results || [];
}

const DAILY_FIELDS = [
  "weather_code", "temperature_2m_max", "temperature_2m_min", "temperature_2m_mean",
  "precipitation_sum", "rain_sum", "snowfall_sum", "wind_speed_10m_max"
].join(",");

// How many days back from today we still trust the forecast API (it reaches ~93 days
// back and ~15 days ahead). Older than this uses the historical archive.
const FORECAST_BACK_DAYS = 10;

function parseDaily(data) {
  if (!data.daily || !data.daily.time || data.daily.time.length === 0) {
    throw new Error("no data");
  }
  const i = 0;
  return {
    code: data.daily.weather_code[i],
    tMax: data.daily.temperature_2m_max[i],
    tMin: data.daily.temperature_2m_min[i],
    tMean: data.daily.temperature_2m_mean[i],
    precip: data.daily.precipitation_sum[i],
    rain: data.daily.rain_sum[i],
    snow: data.daily.snowfall_sum[i],
    wind: data.daily.wind_speed_10m_max[i]
  };
}

// Historical archive (real records back to 1940, with a short delay).
async function fetchArchive(lat, lon, date) {
  const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}` +
              `&start_date=${date}&end_date=${date}&daily=${DAILY_FIELDS}&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("weather failed");
  return parseDaily(await res.json());
}

// Forecast API: recent past, today (with live "current" conditions), and up to ~15 days ahead.
async function fetchForecast(lat, lon, date, isToday) {
  let url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
            `&start_date=${date}&end_date=${date}&daily=${DAILY_FIELDS}&timezone=auto`;
  if (isToday) {
    url += "&current=temperature_2m,weather_code,wind_speed_10m,precipitation,is_day";
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error("weather failed");
  const data = await res.json();
  const out = parseDaily(data);
  if (data.current) {
    out.current = {
      temp: data.current.temperature_2m,
      code: data.current.weather_code,
      wind: data.current.wind_speed_10m,
      isDay: data.current.is_day === 1
    };
  }
  return out;
}

// Pick the right source based on how far the date is from today, and tag the result
// as past / today / future so the UI can present it nicely.
async function fetchWeather(lat, lon, date) {
  const diff = dayDiff(date, todayISO());   // date - today, in days
  const temporal = diff === 0 ? "today" : (diff > 0 ? "future" : "past");
  let data;
  if (diff >= -FORECAST_BACK_DAYS) {
    data = await fetchForecast(lat, lon, date, diff === 0);
  } else {
    data = await fetchArchive(lat, lon, date);
  }
  data.temporal = temporal;
  data.dayDiff = diff;
  return data;
}

/* ============================================================
   Autocomplete search
   ============================================================ */
let searchTimer = null;
let activeSuggestion = -1;

els.cityInput.addEventListener("input", () => {
  const q = els.cityInput.value.trim();
  clearTimeout(searchTimer);
  if (q.length < 2) { hideSuggestions(); return; }
  searchTimer = setTimeout(() => runSearch(q), 260);
});

async function runSearch(q) {
  try {
    const results = await geocode(q);
    renderSuggestions(results);
  } catch {
    renderSuggestions([]);
  }
}

function renderSuggestions(results) {
  els.suggestions.innerHTML = "";
  activeSuggestion = -1;
  if (!results.length) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = "No places found — try another spelling!";
    els.suggestions.appendChild(li);
    els.suggestions.hidden = false;
    return;
  }
  results.forEach((r) => {
    const li = document.createElement("li");
    li.setAttribute("role", "option");
    const sub = [r.admin1, r.country].filter(Boolean).join(", ");
    const name = `${r.name}${r.country_code ? " " + flagEmoji(r.country_code) : ""}`;
    li.innerHTML = `<span class="sug-main">${name}</span>${sub ? `<span class="sug-sub">${sub}</span>` : ""}`;
    li.addEventListener("click", () => {
      selectPlace({ name: `${r.name}${sub ? ", " + (r.country || sub) : ""}`, lat: r.latitude, lon: r.longitude });
    });
    els.suggestions.appendChild(li);
  });
  els.suggestions.hidden = false;
}

function hideSuggestions() { els.suggestions.hidden = true; els.suggestions.innerHTML = ""; }

function flagEmoji(cc) {
  if (!cc || cc.length !== 2) return "";
  return cc.toUpperCase().replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

// Keyboard navigation for suggestions
els.cityInput.addEventListener("keydown", (e) => {
  const items = [...els.suggestions.querySelectorAll("li:not(.empty)")];
  if (els.suggestions.hidden || !items.length) {
    if (e.key === "Enter") { e.preventDefault(); travel(); }
    return;
  }
  if (e.key === "ArrowDown") { e.preventDefault(); activeSuggestion = Math.min(activeSuggestion + 1, items.length - 1); }
  else if (e.key === "ArrowUp") { e.preventDefault(); activeSuggestion = Math.max(activeSuggestion - 1, 0); }
  else if (e.key === "Enter") { e.preventDefault(); if (activeSuggestion >= 0) items[activeSuggestion].click(); else travel(); return; }
  else if (e.key === "Escape") { hideSuggestions(); return; }
  else return;
  items.forEach((it, idx) => it.classList.toggle("active", idx === activeSuggestion));
});

document.addEventListener("click", (e) => {
  if (!els.suggestions.contains(e.target) && e.target !== els.cityInput) hideSuggestions();
});

function selectPlace(place) {
  state.place = place;
  els.cityInput.value = place.name;
  hideSuggestions();
  markSelectedChip(null);
  travel();
}

/* Preset city chips */
els.presetChips.addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  state.place = {
    name: chip.dataset.name,
    lat: parseFloat(chip.dataset.lat),
    lon: parseFloat(chip.dataset.lon)
  };
  els.cityInput.value = chip.dataset.name;
  markSelectedChip(chip);
  travel();
});

function markSelectedChip(chip) {
  [...els.presetChips.querySelectorAll(".chip")].forEach((c) => c.classList.toggle("selected", c === chip));
}

/* ============================================================
   The main "travel" action
   ============================================================ */
async function travel() {
  const date = els.dateInput.value;
  if (!date) { showStatus("Pick a day first! 📅", false); return; }
  if (!state.place) { showStatus("Pick a place first! 🔎", false); return; }

  showStatus("Warming up the time machine… 🚀", true);
  els.mascotSpeech.textContent = "Zooming through time… 🌀";

  try {
    const w = await fetchWeather(state.place.lat, state.place.lon, date);
    hideStatus();
    render(w, date);
  } catch (err) {
    showStatus("Hmm, no weather found for that day here. Try another day or place! 🤔", false);
    els.mascotSpeech.textContent = "Let's try a different day! 🗓️";
  }
}

function showStatus(msg, spinning) {
  els.statusText.textContent = msg;
  els.sceneStatus.hidden = false;
  els.sceneStatus.querySelector(".spinner").style.display = spinning ? "block" : "none";
}
function hideStatus() { els.sceneStatus.hidden = true; }

/* ============================================================
   Rendering
   ============================================================ */
function render(w, date) {
  const info = WEATHER_CODES[w.code] || { cat: "cloudy", label: "Weather", emoji: "🌡️" };
  const cat = info.cat;

  // Overall temperature for the big readout
  const meanT = (w.tMean !== null && w.tMean !== undefined)
    ? w.tMean
    : (w.tMax + w.tMin) / 2;

  // ---- Scene sky class ----
  els.scene.className = "scene scene-" + cat + (state.night ? " night" : "");
  els.scene.classList.toggle("storming", cat === "storm");

  // ---- Rainbow (sun + light rain during the day) ----
  const showRainbow = !state.night && [51, 53, 61, 80, 81].includes(w.code);
  els.scene.classList.toggle("show-rainbow", showRainbow);

  // ---- Readout ----
  els.readoutWhen.textContent = relativeLabel(w.dayDiff ?? 0);
  els.readoutPlace.textContent = state.place.name;
  els.readoutDate.textContent = prettyDate(date);
  els.readoutTemp.textContent = tempStr(meanT);
  els.readoutCondition.textContent = `${info.emoji} ${info.label}`;

  // ---- Live "right now" reading (today only) ----
  if (w.current) {
    const cur = WEATHER_CODES[w.current.code] || info;
    els.readoutNow.textContent = `🔴 Right now: ${tempStr(w.current.temp)} ${cur.emoji} ${cur.label}`;
    els.readoutNow.hidden = false;
  } else {
    els.readoutNow.hidden = true;
  }

  // ---- Info cards ----
  renderTempCard(w);
  renderRainCard(w);
  renderWindCard(w);
  renderSnowCard(w);

  // ---- Explainer + mascot ----
  const ex = EXPLAINERS[cat] || EXPLAINERS.cloudy;
  els.explainerTitle.textContent = ex.title;
  els.explainerText.textContent = ex.text;
  updateMascot(cat, meanT, info, w.temporal);

  // ---- Particles + sound ----
  setParticles(cat, w);
  updateSound(cat, w);
}

function renderTempCard(w) {
  els.tempMax.textContent = tempStr(w.tMax);
  els.tempMin.textContent = tempStr(w.tMin);
  const meanT = (w.tMean ?? (w.tMax + w.tMin) / 2);
  // thermometer fill: map -20..40 °C to 8..100%
  const pct = Math.max(8, Math.min(100, ((meanT + 20) / 60) * 100));
  els.thermoFill.style.height = pct + "%";
  // color from cold blue to hot red
  const hue = Math.max(0, Math.min(210, 210 - ((meanT + 20) / 60) * 210));
  els.thermoFill.style.background = `linear-gradient(180deg, hsl(${hue},85%,55%), hsl(${hue + 15},90%,60%))`;
  els.tempNote.textContent = tempDescription(meanT);
}

function tempDescription(c) {
  if (c >= 32) return "🥵 Super hot! Time for shade and ice cream!";
  if (c >= 27) return "😎 Hot — perfect for swimming!";
  if (c >= 20) return "😀 Warm and lovely for playing outside!";
  if (c >= 12) return "🙂 Mild — maybe a light jacket.";
  if (c >= 5)  return "🧥 Chilly — grab a cozy sweater!";
  if (c >= -3) return "🥶 Cold! Hats and gloves time!";
  return "🧊 Freezing! Bundle up like a snow explorer!";
}

function renderRainCard(w) {
  const mm = w.precip ?? 0;
  els.rainAmount.textContent = state.units === "imperial"
    ? `${mmToIn(mm).toFixed(2)} in`
    : `${mm.toFixed(1)} mm`;
  if (mm <= 0)      { els.rainEmoji.textContent = "☀️"; els.rainNote.textContent = "Bone dry — not a single drop!"; }
  else if (mm < 1)  { els.rainEmoji.textContent = "🌦️"; els.rainNote.textContent = "Just a tiny sprinkle."; }
  else if (mm < 5)  { els.rainEmoji.textContent = "🌧️"; els.rainNote.textContent = "A little rain fell."; }
  else if (mm < 20) { els.rainEmoji.textContent = "☔"; els.rainNote.textContent = "Rainy day — great for puddle jumping!"; }
  else              { els.rainEmoji.textContent = "🌊"; els.rainNote.textContent = "Lots of rain! Splash splash!"; }
}

function renderWindCard(w) {
  const kmh = w.wind ?? 0;
  els.windAmount.textContent = state.units === "imperial"
    ? `${Math.round(kmhToMph(kmh))} mph`
    : `${Math.round(kmh)} km/h`;
  if (kmh < 10)      els.windNote.textContent = "😌 Calm and still.";
  else if (kmh < 25) els.windNote.textContent = "🍃 A gentle breeze.";
  else if (kmh < 40) els.windNote.textContent = "💨 Pretty windy — hold your hat!";
  else if (kmh < 60) els.windNote.textContent = "🌬️ Very windy — kites go zoom!";
  else               els.windNote.textContent = "🌪️ Super windy — wow!";
  // spin speed reacts to wind
  const dur = Math.max(0.4, 4 - kmh / 20);
  els.windEmoji.style.animationDuration = dur + "s";
}

function renderSnowCard(w) {
  const cm = w.snow ?? 0;
  els.snowAmount.textContent = state.units === "imperial"
    ? `${cmToIn(cm).toFixed(2)} in`
    : `${cm.toFixed(1)} cm`;
  if (cm <= 0)      { els.snowEmoji.textContent = "🌱"; els.snowNote.textContent = "No snow this day."; }
  else if (cm < 1)  { els.snowEmoji.textContent = "❄️"; els.snowNote.textContent = "A few frosty flurries!"; }
  else if (cm < 5)  { els.snowEmoji.textContent = "⛄"; els.snowNote.textContent = "Enough for a small snowball!"; }
  else if (cm < 20) { els.snowEmoji.textContent = "☃️"; els.snowNote.textContent = "Snowman weather!"; }
  else              { els.snowEmoji.textContent = "🏔️"; els.snowNote.textContent = "Whoa, tons of snow!"; }
}

/* ---------- Mascot ---------- */
function updateMascot(cat, meanT, info, temporal) {
  const m = els.mascot;
  m.classList.remove("happy", "sad", "cold", "hot");
  let mood = "happy";
  let speech = "";

  if (meanT <= -3) { mood = "cold"; }
  else if (meanT >= 30) { mood = "hot"; }

  switch (cat) {
    case "clear":
      speech = meanT >= 27 ? "What a scorcher! Don't forget sunscreen! 😎"
             : meanT <= 0  ? "Clear but chilly — see your breath? ❄️"
             : "Beautiful clear skies! Perfect for exploring! 🌞";
      break;
    case "cloudy": speech = "Fluffy clouds are drifting by. Can you spot any shapes? ☁️"; break;
    case "rain": mood = mood === "cold" ? "cold" : "sad"; speech = "Splish splash! A perfect day for puddle jumping! ☔"; break;
    case "snow": mood = "cold"; speech = "Brrr! Let's build a snowman together! ⛄"; break;
    case "storm": mood = "sad"; speech = "Boom! A thunderstorm! Best to stay cozy inside. ⛈️"; break;
    case "fog": speech = "Spooky fog! Everything looks so mysterious. 🌫️"; break;
    default: speech = "Here's the weather from that day! 🌈";
  }
  m.classList.add(mood);
  const lead = temporal === "future" ? "🔮 Future peek! " : "";
  els.mascotSpeech.textContent = lead + speech;
}

/* ============================================================
   Particle engine (canvas): rain & snow
   ============================================================ */
const fx = els.fx;
const ctx = fx.getContext("2d");
let particles = [];
let dpr = Math.min(window.devicePixelRatio || 1, 2);

function resizeCanvas() {
  const r = fx.getBoundingClientRect();
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  fx.width = Math.max(1, Math.floor(r.width * dpr));
  fx.height = Math.max(1, Math.floor(r.height * dpr));
}
window.addEventListener("resize", resizeCanvas);
if (window.ResizeObserver) { new ResizeObserver(resizeCanvas).observe(fx); }

function setParticles(cat, w) {
  let mode = "none", intensity = 0;
  if (cat === "rain")  { mode = "rain";  intensity = clampIntensity(w.precip, 2, 25); }
  else if (cat === "storm") { mode = "rain"; intensity = 1; }
  else if (cat === "snow")  { mode = "snow";  intensity = clampIntensity(w.snow, 0.5, 15); }
  state.particles.mode = mode;
  state.particles.intensity = intensity;
  state.particles.wind = Math.min(1, (w.wind ?? 0) / 60);
  seedParticles();
}

function clampIntensity(v, lo, hi) {
  if (v === null || v === undefined) return 0.4;
  return Math.max(0.25, Math.min(1, (v - lo) / (hi - lo) + 0.25));
}

function seedParticles() {
  const { mode, intensity } = state.particles;
  particles = [];
  if (mode === "none") return;
  const count = mode === "rain" ? Math.round(90 + intensity * 220) : Math.round(50 + intensity * 130);
  for (let i = 0; i < count; i++) particles.push(newParticle(mode));
}

function newParticle(mode) {
  const w = fx.width, h = fx.height;
  if (mode === "rain") {
    return {
      x: Math.random() * w, y: Math.random() * h,
      len: (10 + Math.random() * 14) * dpr,
      speed: (8 + Math.random() * 8) * dpr * (0.8 + state.particles.intensity),
    };
  }
  // snow
  return {
    x: Math.random() * w, y: Math.random() * h,
    r: (1.5 + Math.random() * 3) * dpr,
    speed: (0.6 + Math.random() * 1.4) * dpr,
    sway: Math.random() * Math.PI * 2,
    swaySpeed: 0.01 + Math.random() * 0.03
  };
}

function drawParticles() {
  ctx.clearRect(0, 0, fx.width, fx.height);
  const { mode, wind } = state.particles;
  if (mode === "none" || !particles.length) { requestAnimationFrame(drawParticles); return; }

  const windX = (0.4 + wind * 3) * dpr;

  if (mode === "rain") {
    ctx.strokeStyle = "rgba(174, 205, 230, 0.7)";
    ctx.lineWidth = 1.6 * dpr;
    ctx.lineCap = "round";
    for (const p of particles) {
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - windX * 1.5, p.y + p.len);
      ctx.stroke();
      p.y += p.speed;
      p.x += windX;
      if (p.y > fx.height) { p.y = -p.len; p.x = Math.random() * fx.width; }
      if (p.x > fx.width) p.x = 0;
    }
  } else {
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    for (const p of particles) {
      p.sway += p.swaySpeed;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      p.y += p.speed;
      p.x += Math.sin(p.sway) * 0.7 * dpr + windX * 0.4;
      if (p.y > fx.height) { p.y = -p.r; p.x = Math.random() * fx.width; }
      if (p.x > fx.width) p.x = 0;
      if (p.x < 0) p.x = fx.width;
    }
  }
  requestAnimationFrame(drawParticles);
}

/* ============================================================
   Optional synthesized weather ambience (Web Audio)
   ============================================================ */
let audio = null;
function initAudio() {
  if (audio) return audio;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const ac = new AC();

    // Reusable white-noise buffer
    const buffer = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
    const d = buffer.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;

    const master = ac.createGain();
    master.gain.value = 0;
    master.connect(ac.destination);

    // Rain layer
    const rainSrc = ac.createBufferSource();
    rainSrc.buffer = buffer; rainSrc.loop = true;
    const rainBP = ac.createBiquadFilter();
    rainBP.type = "bandpass"; rainBP.frequency.value = 1300; rainBP.Q.value = 0.6;
    const rainGain = ac.createGain(); rainGain.gain.value = 0;
    rainSrc.connect(rainBP).connect(rainGain).connect(master);
    rainSrc.start();

    // Wind layer
    const windSrc = ac.createBufferSource();
    windSrc.buffer = buffer; windSrc.loop = true;
    const windLP = ac.createBiquadFilter();
    windLP.type = "lowpass"; windLP.frequency.value = 480;
    const windGain = ac.createGain(); windGain.gain.value = 0;
    const lfo = ac.createOscillator(); lfo.frequency.value = 0.15;
    const lfoGain = ac.createGain(); lfoGain.gain.value = 0.03;
    lfo.connect(lfoGain).connect(windGain.gain);
    windSrc.connect(windLP).connect(windGain).connect(master);
    windSrc.start(); lfo.start();

    audio = { ac, master, rainGain, windGain };
  } catch {
    audio = null;
  }
  return audio;
}

function updateSound(cat, w) {
  if (!state.sound || !audio) return;
  const a = audio;
  const now = a.ac.currentTime;
  let rain = 0, wind = 0;
  if (cat === "rain")  rain = 0.10 + clampIntensity(w.precip, 2, 25) * 0.12;
  if (cat === "storm") rain = 0.24;
  if (cat === "snow")  wind = 0.05;
  wind += Math.min(0.14, (w.wind ?? 0) / 60 * 0.14);
  a.rainGain.gain.setTargetAtTime(rain, now, 0.4);
  a.windGain.gain.setTargetAtTime(wind, now, 0.6);
}

function setSoundEnabled(on) {
  state.sound = on;
  els.soundEmoji.textContent = on ? "🔊" : "🔇";
  els.soundLabel.textContent = on ? "Sound on" : "Sound off";
  if (on) {
    const a = initAudio();
    if (!a) { state.sound = false; els.soundEmoji.textContent = "🔇"; els.soundLabel.textContent = "Sound off"; return; }
    if (a.ac.state === "suspended") a.ac.resume();
    a.master.gain.setTargetAtTime(0.5, a.ac.currentTime, 0.3);
    // Re-apply current weather sound
    const cat = [...els.scene.classList].map(c => c.replace("scene-", "")).find(c => EXPLAINERS[c]);
    if (cat) updateSound(cat, { precip: 4, wind: 15, snow: 0 });
  } else if (audio) {
    audio.master.gain.setTargetAtTime(0, audio.ac.currentTime, 0.3);
  }
}

/* ============================================================
   Toggles & buttons
   ============================================================ */
els.unitToggle.addEventListener("click", () => {
  state.units = state.units === "metric" ? "imperial" : "metric";
  els.unitLabel.textContent = state.units === "metric" ? "°C" : "°F";
  travel(); // re-render with new units
});

els.dayNightToggle.addEventListener("click", () => {
  state.night = !state.night;
  els.dayNightEmoji.textContent = state.night ? "🌙" : "☀️";
  els.dayNightLabel.textContent = state.night ? "Night" : "Day";
  els.scene.classList.toggle("night", state.night);
  // rainbows only in daytime
  if (state.night) els.scene.classList.remove("show-rainbow");
  else travel();
});

els.soundToggle.addEventListener("click", () => setSoundEnabled(!state.sound));

els.travelBtn.addEventListener("click", travel);

els.surpriseBtn.addEventListener("click", () => {
  const min = new Date("1960-01-01").getTime();
  const max = daysFromNow(15).getTime();
  const rnd = new Date(min + Math.random() * (max - min));
  els.dateInput.value = toISO(rnd);
  travel();
});

// Quick-date buttons: Today / Tomorrow (data-days offset from today)
if (els.dateQuick) {
  els.dateQuick.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-days]");
    if (!btn) return;
    els.dateInput.value = toISO(daysFromNow(parseInt(btn.dataset.days, 10)));
    travel();
  });
}

els.nextFactBtn.addEventListener("click", showNextFact);
function showNextFact() {
  state.factIndex = (state.factIndex + 1) % FUN_FACTS.length;
  els.factText.textContent = FUN_FACTS[state.factIndex];
}

/* ============================================================
   Init
   ============================================================ */
function init() {
  // date bounds: 1940 in the past up to ~15 days into the future
  els.dateInput.max = toISO(daysFromNow(15));
  els.dateInput.min = "1940-01-01";
  els.dateInput.value = todayISO(); // start on today's current weather

  els.cityInput.value = state.place.name;
  markSelectedChip([...els.presetChips.querySelectorAll(".chip")][0]);

  // random starting fact
  state.factIndex = Math.floor(Math.random() * FUN_FACTS.length);
  els.factText.textContent = FUN_FACTS[state.factIndex];

  resizeCanvas();
  requestAnimationFrame(drawParticles);

  travel(); // load the default place/date
}

document.addEventListener("DOMContentLoaded", init);
