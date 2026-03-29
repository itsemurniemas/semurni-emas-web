"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface Option {
  label: string;
  value: string;
}

interface CapsulePickerProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const CapsulePicker: React.FC<CapsulePickerProps> = ({
  options,
  value,
  onChange,
  className = "",
}) => {
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "px-4 py-2 text-sm font-light rounded-full border transition-colors hover:cursor-pointer",
              isActive
                ? "bg-foreground text-background border-foreground"
                : "bg-transparent text-foreground border-border hover:border-foreground"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default CapsulePicker;
