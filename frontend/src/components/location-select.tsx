import { useEffect, useMemo, useRef, useState } from "react";
import Fuse from "fuse.js";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

/*
  LocationSelector.tsx

  Exports:
    - CountrySelect
    - CitySelect
    - (optional) CombinedLocationPicker

  Design goals:
    - Small, fast fetches from public/data
    - Fuse.js fuzzy search on small arrays
    - Controlled or uncontrolled usage (value/onChange optional)
    - Simple TypeScript types and clear props
*/

/* ----------------------- Types ----------------------- */
export type Country = {
  country: string;
  iso2?: string;
  iso3?: string;
  value: string; // slug used for city file name
};

export type City = {
  city: string;
  city_ascii?: string;
  admin_name?: string;
  lat?: string;
  lng?: string;
  id?: string;
};

/* ----------------------- Simple cache ----------------------- */
const cache: {
  countries: Country[] | null;
  cities: Map<string, City[]>;
} = {
  countries: null,
  cities: new Map(),
};

/* ----------------------- Helpers ----------------------- */
function useDebounced<T>(value: T, ms = 200) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

/* ----------------------- CountrySelect ----------------------- */
export interface CountrySelectProps {
  value?: Country | null; // controlled value
  onChange?: (country: Country | null) => void;
  placeholder?: string;
  fuseThreshold?: number; // lower == stricter
  limit?: number;
  className?: string;
}

export function CountrySelect({
  value,
  onChange,
  placeholder = "Select country",
  fuseThreshold = 0.18,
  limit = 50,
  className,
}: CountrySelectProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [internal, setInternal] = useState<Country | null>(null);
  const [query, setQuery] = useState("");
  const debQuery = useDebounced(query, 180);
  const fuseRef = useRef<Fuse<Country> | null>(null);

  const selected = value ?? internal;

  useEffect(() => {
    let mounted = true;
    if (cache.countries) {
      setCountries(cache.countries);
      fuseRef.current = new Fuse(cache.countries, {
        keys: ["country"],
        threshold: fuseThreshold,
        ignoreLocation: true,
      });
      setLoaded(true);
      return;
    }

    fetch("/data/countries.json")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch countries.json");
        return r.json();
      })
      .then((data: Country[]) => {
        if (!mounted) return;
        cache.countries = data;
        setCountries(data);
        fuseRef.current = new Fuse(data, {
          keys: ["country"],
          threshold: fuseThreshold,
          ignoreLocation: true,
        });
        setLoaded(true);
      })
      .catch((err) => {
        console.error("CountrySelect: failed to load countries", err);
        setCountries([]);
        setLoaded(true);
      });

    return () => {
      mounted = false;
    };
  }, [fuseThreshold]);

  const results = useMemo(() => {
    if (!loaded) return [] as Country[];
    if (!debQuery) return countries.slice(0, limit);
    return (fuseRef.current?.search(debQuery).map((r) => r.item) ?? []).slice(
      0,
      limit
    );
  }, [loaded, countries, debQuery, limit]);

  function doSelect(c: Country) {
    if (onChange) onChange(c);
    else setInternal(c);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("justify-between w-full", className)}
          role="combobox"
        >
          <span className={selected ? "" : "text-muted-foreground"}>
            {selected ? selected.country : placeholder}
          </span>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[22rem]">
        <Command>
          <CommandInput
            placeholder="Search country..."
            value={query}
            onValueChange={(v: string) => setQuery(v)}
          />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {results.map((c) => (
                <CommandItem
                  key={c.value}
                  value={c.country}
                  onSelect={() => doSelect(c)}
                >
                  <span>{c.country}</span>
                  <Check
                    className={cn(
                      "ml-auto",
                      selected?.value === c.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

/* ----------------------- CitySelect ----------------------- */
export interface CitySelectProps {
  countrySlug: string | null; // required to load cities
  value?: City | null;
  onChange?: (city: City | null) => void;
  placeholder?: string;
  fuseThreshold?: number;
  limit?: number;
  className?: string;
  autoFocusOnCountryChange?: boolean; // attempts to focus input when country changes
}

export function CitySelect({
  countrySlug,
  value,
  onChange,
  placeholder = "Select city",
  fuseThreshold = 0.22,
  limit = 100,
  className,
  autoFocusOnCountryChange = false,
}: CitySelectProps) {
  const [cities, setCities] = useState<City[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [internal, setInternal] = useState<City | null>(null);
  const [query, setQuery] = useState("");
  const debQuery = useDebounced(query, 180);
  const fuseRef = useRef<Fuse<City> | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const selected = value ?? internal;

  useEffect(() => {
    // resets when countrySlug changes
    setCities([]);
    setLoaded(false);
    setQuery("");
    setInternal(null);

    if (!countrySlug) {
      return;
    }

    // cached?
    if (cache.cities.has(countrySlug)) {
      const cached = cache.cities.get(countrySlug)!;
      setCities(cached);
      fuseRef.current = new Fuse(cached, {
        keys: ["city", "city_ascii"],
        threshold: fuseThreshold,
        ignoreLocation: true,
      });
      setLoaded(true);
      if (autoFocusOnCountryChange)
        setTimeout(() => inputRef.current?.focus(), 50);
      return;
    }

    fetch(`/data/cities/${encodeURIComponent(countrySlug)}.json`)
      .then((r) => {
        if (!r.ok) throw new Error("Cities file not found");
        return r.json();
      })
      .then((data: City[]) => {
        cache.cities.set(countrySlug, data);
        setCities(data);
        fuseRef.current = new Fuse(data, {
          keys: ["city", "city_ascii"],
          threshold: fuseThreshold,
          ignoreLocation: true,
        });
        setLoaded(true);
        if (autoFocusOnCountryChange)
          setTimeout(() => inputRef.current?.focus(), 50);
      })
      .catch((err) => {
        console.error(
          "CitySelect: failed to load cities for",
          countrySlug,
          err
        );
        setCities([]);
        setLoaded(true);
      });
  }, [countrySlug, fuseThreshold, autoFocusOnCountryChange]);

  const results = useMemo(() => {
    if (!loaded) return [] as City[];
    if (!countrySlug) return [] as City[];
    if (!debQuery) return cities.slice(0, limit);
    return (fuseRef.current?.search(debQuery).map((r) => r.item) ?? []).slice(
      0,
      limit
    );
  }, [loaded, cities, debQuery, limit, countrySlug]);

  function doSelect(city: City) {
    if (onChange) onChange(city);
    else setInternal(city);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("justify-between w-full", className)}
          role="combobox"
          disabled={!countrySlug}
        >
          <span className={selected ? "" : "text-muted-foreground"}>
            {selected ? selected.city : placeholder}
          </span>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0 w-[24rem]">
        {!countrySlug ? (
          <div className="p-3 text-sm text-muted-foreground">
            Select a country first
          </div>
        ) : (
          <Command>
            {/* NOTE: CommandInput may forward ref; if not, autoFocus will be a no-op */}
            <CommandInput
              placeholder={`Search city in ${countrySlug}...`}
              value={query}
              onValueChange={(v: string) => setQuery(v)}
              ref={inputRef as any}
            />
            <CommandList>
              <CommandEmpty>No city found.</CommandEmpty>
              <CommandGroup>
                {results.map((city) => (
                  <CommandItem
                    key={city.id ?? `${city.city}-${city.admin_name}`}
                    value={city.city}
                    onSelect={() => doSelect(city)}
                  >
                    <span>{city.city}</span>
                    <Check
                      className={cn(
                        "ml-auto",
                        selected?.id === city.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        )}
      </PopoverContent>
    </Popover>
  );
}

/* ----------------------- Combined helper (optional) ----------------------- */
export interface CombinedLocationPickerProps {
  onSelect?: (payload: { country: Country | null; city: City | null }) => void;
  placeholder?: string;
  autoFocusCity?: boolean;
}

export function CombinedLocationPicker({
  onSelect,
  placeholder,
  autoFocusCity = true,
}: CombinedLocationPickerProps) {
  const [country, setCountry] = useState<Country | null>(null);
  const [city, setCity] = useState<City | null>(null);

  useEffect(() => {
    // clear city if country changed
    setCity(null);
  }, [country?.value]);

  useEffect(() => {
    if (onSelect) onSelect({ country, city });
  }, [country, city, onSelect]);

  return (
    <div className="grid grid-cols-2 gap-2">
      <CountrySelect
        value={country}
        onChange={(c) => setCountry(c)}
        placeholder={placeholder ?? "Country"}
      />

      <CitySelect
        countrySlug={country?.value ?? null}
        value={city}
        onChange={(c) => setCity(c)}
        placeholder={placeholder ?? "City"}
        autoFocusOnCountryChange={autoFocusCity}
      />
    </div>
  );
}

export default CombinedLocationPicker;

/* ----------------------- Usage notes -----------------------

1) Ensure precomputed files exist in public/data:
   - public/data/countries.json
   - public/data/cities/<country-slug>.json
   (Run the extract script you already created.)

2) Install fuse.js
   npm install fuse.js

3) You can use CountrySelect and CitySelect separately or use CombinedLocationPicker which wires them.

4) Both components support controlled usage (pass `value` + `onChange`) or uncontrolled (omit `value` and you'll get internal state).

5) CitySelect requires `countrySlug` — it will fetch and cache the matching city file from /data/cities/{slug}.json

*/
