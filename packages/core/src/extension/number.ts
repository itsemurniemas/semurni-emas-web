export function toPercentageSafe(
  value: number,
  decimals = 2,
  withSymbol = true
): string {
  if (!Number.isFinite(value)) return withSymbol ? "0%" : "0";

  const scaled = Math.round((value * 100 + Number.EPSILON) * 10 ** decimals);
  const result = scaled / 10 ** decimals;

  return withSymbol ? `${result.toFixed(decimals)}%` : result.toFixed(decimals);
}

export const formatRupiah = (
  value: number,
  includeSymbol: boolean = true,
  decimalPlaces: number = 2
): string => {
  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  };

  if (includeSymbol) {
    options.style = "currency";
    options.currency = "IDR";
  } else {
    options.style = "decimal";
  }

  const formatted = new Intl.NumberFormat("id-ID", options).format(value);
  return includeSymbol ? formatted.replace(/Rp\s?/, "Rp") : formatted;
};

/**
 * Format number with Indonesian abbreviations (rb, jt, M, T)
 * @param value - Number to format
 * @param decimalPlaces - Number of decimal places (default: 1)
 * @returns Formatted string with Indonesian abbreviations
 * Examples: 1500 -> "1.5rb", 1500000 -> "1.5jt", 1500000000 -> "1.5M"
 */
export const formatKMT = (value: number, decimalPlaces: number = 1): string => {
  if (value === 0) return "0";
  if (!Number.isFinite(value)) return "0";

  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (absValue >= 1_000_000_000_000) {
    return sign + (absValue / 1_000_000_000_000).toFixed(decimalPlaces) + "T";
  }
  if (absValue >= 1_000_000_000) {
    return sign + (absValue / 1_000_000_000).toFixed(decimalPlaces) + "M";
  }
  if (absValue >= 1_000_000) {
    return sign + (absValue / 1_000_000).toFixed(decimalPlaces) + "jt";
  }
  if (absValue >= 1_000) {
    return sign + (absValue / 1_000).toFixed(decimalPlaces) + "rb";
  }

  return value.toFixed(decimalPlaces);
};

export const getBase64ImageUrl = (base64: string): string => {
  // If it already includes the data URL prefix, return as-is
  if (base64.startsWith("data:")) {
    return base64;
  }
  // Otherwise, add the default png mime type
  return `data:image/png;base64,${base64}`;
};