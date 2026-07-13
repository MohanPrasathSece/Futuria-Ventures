export interface Country {
  code: string;    // ISO 2-letter
  name: string;
  dial: string;    // e.g. "+44"
  flag: string;    // emoji flag
  localLen: number | [number, number]; // exact digits OR [min, max]
  placeholder: string; // local number example
}

export const COUNTRIES: Country[] = [
  { code: "CH", name: "Switzerland",      dial: "+41",  flag: "🇨🇭", localLen: 9,  placeholder: "76 123 45 67" },
  { code: "FR", name: "France",           dial: "+33",  flag: "🇫🇷", localLen: 9,  placeholder: "6 12 34 56 78" },
  { code: "BE", name: "Belgium",          dial: "+32",  flag: "🇧🇪", localLen: 9,  placeholder: "470 12 34 56" },
  { code: "NL", name: "Netherlands",      dial: "+31",  flag: "🇳🇱", localLen: 9,  placeholder: "6 12345678" },
  { code: "CA", name: "Canada",           dial: "+1",   flag: "🇨🇦", localLen: 10, placeholder: "613 555 0123" },
  { code: "GB", name: "United Kingdom",   dial: "+44",  flag: "🇬🇧", localLen: 10, placeholder: "7911 123456" },
  { code: "DE", name: "Germany",          dial: "+49",  flag: "🇩🇪", localLen: [10, 11], placeholder: "30 12345678" },
  { code: "ES", name: "Spain",            dial: "+34",  flag: "🇪🇸", localLen: 9,  placeholder: "612 345 678" },
  { code: "IT", name: "Italy",            dial: "+39",  flag: "🇮🇹", localLen: [9, 10], placeholder: "312 345 6789" },
  { code: "US", name: "United States",    dial: "+1",   flag: "🇺🇸", localLen: 10, placeholder: "555 012 3456" },
  { code: "AT", name: "Austria",          dial: "+43",  flag: "🇦🇹", localLen: [7, 13], placeholder: "664 1234567" },
  { code: "SE", name: "Sweden",           dial: "+46",  flag: "🇸🇪", localLen: 9,  placeholder: "70 123 45 67" },
  { code: "AU", name: "Australia",        dial: "+61",  flag: "🇦🇺", localLen: 9,  placeholder: "412 345 678" },
  { code: "IN", name: "India",            dial: "+91",  flag: "🇮🇳", localLen: 10, placeholder: "98765 43210" },
  { code: "AE", name: "UAE",              dial: "+971", flag: "🇦🇪", localLen: 9,  placeholder: "50 123 4567" },
  { code: "SG", name: "Singapore",        dial: "+65",  flag: "🇸🇬", localLen: 8,  placeholder: "8123 4567" },
  { code: "ZA", name: "South Africa",     dial: "+27",  flag: "🇿🇦", localLen: 9,  placeholder: "82 123 4567" },
  { code: "BR", name: "Brazil",           dial: "+55",  flag: "🇧🇷", localLen: [10, 11], placeholder: "11 91234 5678" },
  { code: "MX", name: "Mexico",           dial: "+52",  flag: "🇲🇽", localLen: 10, placeholder: "55 1234 5678" },
  { code: "JP", name: "Japan",            dial: "+81",  flag: "🇯🇵", localLen: [10, 11], placeholder: "90 1234 5678" },
  { code: "CY", name: "Cyprus",           dial: "+357", flag: "🇨🇾", localLen: 8,  placeholder: "99 123456" },
];

export function validateLocalPhone(local: string, country: Country): string {
  const digits = local.replace(/\D/g, "");
  if (!digits) return "Le numéro de téléphone est requis.";
  const len = country.localLen;
  if (typeof len === "number") {
    if (digits.length !== len)
      return `Les numéros pour ${country.name} doivent comporter exactement ${len} chiffres.`;
  } else {
    const [min, max] = len;
    if (digits.length < min || digits.length > max)
      return `Les numéros pour ${country.name} doivent comporter entre ${min} et ${max} chiffres.`;
  }
  return "";
}
