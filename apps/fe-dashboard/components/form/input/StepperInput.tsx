import React from "react";
import { Minus, Plus } from "lucide-react";
import Label from "@/components/form/Label";

interface StepperInputProps {
  label?: string | null;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

const StepperInput: React.FC<StepperInputProps> = ({
  label = null,
  value,
  onChange,
  min = 0,
  max = 999,
  step = 1,
}) => {
  const handleDecrement = () => {
    const newValue = value - step;
    if (newValue >= min) {
      onChange(newValue);
    }
  };

  const handleIncrement = () => {
    const newValue = value + step;
    if (newValue <= max) {
      onChange(newValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || 0;
    if (newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  const isDecrementDisabled = value <= min;
  const isIncrementDisabled = value >= max;

  return (
    <div className="grid gap-2">
      {label && <Label>{label}</Label>}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={isDecrementDisabled}
          className="h-11 w-11 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <Minus size={18} className="text-gray-700 dark:text-gray-300" />
        </button>

        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={handleInputChange}
          className="flex-1 h-11 px-4 py-2.5 text-sm text-center border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-moz-appearance]:textfield"
        />

        <button
          type="button"
          onClick={handleIncrement}
          disabled={isIncrementDisabled}
          className="h-11 w-11 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <Plus size={18} className="text-gray-700 dark:text-gray-300" />
        </button>
      </div>
      {max !== 999 && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Maksimal: {max}
        </p>
      )}
    </div>
  );
};

export default StepperInput;
