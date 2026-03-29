import React, { useEffect } from "react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";

interface PriceInputFieldProps {
  label?: string | null;
  value: string; // Internal numeric string (e.g., "1000")
  onChange: (rawValue: string) => void;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
}

const PriceInputField: React.FC<PriceInputFieldProps> = ({
  label = null,
  value,
  onChange,
  placeholder = "0,00",
  error,
  disabled = false,
}) => {
  // Ceil any decimal values on mount or when value changes
  useEffect(() => {
    if (value && value.includes(".")) {
      // Parse the value and ceil it
      const numValue = parseFloat(value);
      const ceiledValue = Math.ceil(numValue).toString();

      // Only update if it changed
      if (ceiledValue !== value) {
        onChange(ceiledValue);
      }
    }
  }, [value, onChange]);
  /**
   * Internal Formatter: JS String -> Visual Indonesian String
   * Only adds thousand separators for display
   */
  const formatDisplay = (val: string) => {
    if (!val) return "";
    // Thousand separator: dot
    return val.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  /**
   * Internal Cleaner: Visual String -> Internal String
   * Removes formatting and keeps only digits
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const inputValue = e.target.value;

    // Remove all formatting dots, keep only digits
    const cleanValue = inputValue.replace(/\./g, "");

    // Only allow digits
    const regex = /^[0-9]*$/;

    if (regex.test(cleanValue)) {
      // If the value is empty, set it to "0"
      const finalValue = cleanValue === "" ? "0" : cleanValue;
      onChange(finalValue);
    }
  };

  return (
    <div className="grid gap-2">
      {label && <Label>{label}</Label>}
      {disabled ? (
        <div className="h-11 flex items-center px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            Rp {formatDisplay(value)}
          </p>
        </div>
      ) : (
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
            Rp
          </span>
          <Input
            type="text"
            className="pl-11"
            placeholder={placeholder}
            value={formatDisplay(value)}
            inputMode="numeric"
            error={error}
            disabled={disabled}
            onChange={handleInputChange}
          />
        </div>
      )}
    </div>
  );
};

export default PriceInputField;
