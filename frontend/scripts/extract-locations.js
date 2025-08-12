// scripts/extract-locations.js
// Usage: node scripts/extract-locations.js
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const worldPath = join(__dirname, "..", "public", "data", "worldcities.json");
const countriesOut = join(__dirname, "..", "public", "data", "countries.json");
const citiesDir = join(__dirname, "..", "public", "data", "cities");

// helper slug (keeps it URL-safe)
function slugify(s) {
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

if (!existsSync(worldPath)) {
  console.error("Error: worldcities.json not found at:", worldPath);
  process.exit(1);
}

if (!existsSync(citiesDir)) mkdirSync(citiesDir, { recursive: true });

const raw = readFileSync(worldPath, "utf8");
const arr = JSON.parse(raw);

const countryMap = new Map(); // slug -> { country, iso2, value:slug }
const citiesByCountry = new Map(); // slug -> [cityObj]

for (const item of arr) {
  const country = item.country || "Unknown";
  const iso2 = item.iso2 || "";
  const slug = slugify(country);

  if (!countryMap.has(slug)) {
    countryMap.set(slug, { country, iso2, value: slug });
    citiesByCountry.set(slug, []);
  }

  // store a compact city object
  citiesByCountry.get(slug).push({
    city: item.city,
    city_ascii: item.city_ascii,
    admin_name: item.admin_name,
    lat: item.lat,
    lng: item.lng,
    id: item.id,
  });
}

// countries array sorted
const countries = Array.from(countryMap.values()).sort((a, b) =>
  a.country.localeCompare(b.country)
);

// write countries.json (small)
writeFileSync(countriesOut, JSON.stringify(countries, null, 2));
console.log("Wrote", countriesOut);

// write per-country city files
for (const c of countries) {
  const list = citiesByCountry.get(c.value) || [];
  const outPath = join(citiesDir, `${c.value}.json`);
  writeFileSync(outPath, JSON.stringify(list, null, 2));
}
console.log("Wrote", citiesDir, "with", countries.length, "files.");
console.log("Done.");
