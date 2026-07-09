import { useState, useRef, useEffect, type ChangeEvent } from "react";
import { ChevronDown, Search } from "lucide-react";
import { COUNTRIES, validateLocalPhone, type Country } from "@/lib/phoneCountries";

interface PhoneInputProps {
  onChange: (full: string, countryCode: string, error: string) => void;
  disabled?: boolean;
  defaultCountry?: string;
  theme?: "dark" | "light";
  hideLabel?: boolean;
}

export function PhoneInput({
  onChange,
  disabled = false,
  defaultCountry = "FR",
  theme = "dark",
  hideLabel = false,
}: PhoneInputProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Country>(
    COUNTRIES.find((c) => c.code === defaultCountry) ?? COUNTRIES[0]
  );
  const [local, setLocal] = useState("");
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState("");
  const dropRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  const filtered = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dial.includes(search)
  );

  const handleCountrySelect = (c: Country) => {
    setSelected(c);
    setOpen(false);
    setSearch("");
    const err = touched ? validateLocalPhone(local, c) : "";
    setError(err);
    onChange(local ? `${c.dial}${local}` : "", c.code, err);
  };

  const handleLocalChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setLocal(val);
    const err = touched ? validateLocalPhone(val, selected) : "";
    setError(err);
    onChange(val ? `${selected.dial}${val}` : "", selected.code, err);
  };

  const handleLocalBlur = () => {
    setTouched(true);
    const err = validateLocalPhone(local, selected);
    setError(err);
    onChange(local ? `${selected.dial}${local}` : "", selected.code, err);
  };

  const isDark = theme === "dark";

  return (
    <div className="relative text-left">
      {!hideLabel && (
        <label className={`text-[12px] font-medium uppercase tracking-wider ${isDark ? "text-white/40" : "text-black/40"} block mb-2`}>
          Numéro de téléphone
        </label>
      )}
      <div className="flex gap-2">
        {/* Dropdown Country Selector */}
        <div ref={dropRef} className="relative shrink-0">
          <button
            type="button"
            disabled={disabled}
            onClick={() => setOpen((p) => !p)}
            className={`flex h-12 items-center gap-1.5 rounded-xl border px-3 py-2 text-[15px] font-medium transition focus:outline-none disabled:opacity-50 ${
              isDark
                ? "border-white/10 bg-white/5 text-white hover:bg-white/10"
                : "border-black/10 bg-black/[0.02] text-black hover:bg-black/[0.05]"
            }`}
          >
            <span className="text-lg leading-none">{selected.flag}</span>
            <span className="font-mono text-xs font-semibold">{selected.dial}</span>
            <ChevronDown
              className={`h-3 w-3 opacity-60 transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {open && (
            <div className={`absolute left-0 top-full z-[150] mt-2 w-72 rounded-xl border p-2 shadow-2xl backdrop-blur-2xl ${
              isDark ? "border-white/10 bg-black/95 text-white" : "border-black/10 bg-white text-black"
            }`}>
              {/* Search */}
              <div className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 mb-1.5 ${
                isDark ? "border-white/10 bg-white/5" : "border-black/10 bg-black/[0.02]"
              }`}>
                <Search className="h-3.5 w-3.5 opacity-40 shrink-0" />
                <input
                  ref={searchRef}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher un pays..."
                  className={`w-full bg-transparent text-xs outline-none placeholder:opacity-40 font-medium ${
                    isDark ? "text-white" : "text-black"
                  }`}
                />
              </div>

              {/* Country List */}
              <ul className="max-h-52 overflow-y-auto">
                {filtered.length === 0 && (
                  <li className="px-3 py-4 text-center text-xs opacity-40">Aucun résultat</li>
                )}
                {filtered.map((c) => (
                  <li key={c.code}>
                    <button
                      type="button"
                      onClick={() => handleCountrySelect(c)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs transition-colors duration-150 font-medium ${
                        isDark
                          ? "hover:bg-white/10 text-white"
                          : "hover:bg-black/5 text-black"
                      } ${selected.code === c.code ? (isDark ? "bg-white/10" : "bg-black/5") : ""}`}
                    >
                      <span className="text-lg leading-none">{c.flag}</span>
                      <span className="flex-1 truncate">{c.name}</span>
                      <span className="font-mono opacity-50">{c.dial}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Number input */}
        <div className="relative flex-1">
          <input
            type="tel"
            disabled={disabled}
            value={local}
            onChange={handleLocalChange}
            onBlur={handleLocalBlur}
            placeholder={selected.placeholder}
            className={`h-12 w-full rounded-xl border px-4 py-2 text-[15px] outline-none transition ${
              touched && error
                ? "border-red-500/50 focus:border-red-500"
                : isDark
                ? "border-white/10 bg-white/5 text-white focus:border-white/30 focus:bg-white/10"
                : "border-black/10 bg-black/[0.02] text-black focus:border-emerald/50 focus:bg-white"
            }`}
          />
        </div>
      </div>
      {touched && error && (
        <div className="text-xs text-red-500 font-medium mt-1 text-left">
          {error}
        </div>
      )}
    </div>
  );
}
