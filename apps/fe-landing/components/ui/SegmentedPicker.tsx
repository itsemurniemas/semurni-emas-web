"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface Option {
  label: string;
  value: string;
}

interface SegmentedPickerProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  width?: "full" | "fit" | "static";
}

const SegmentedPicker: React.FC<SegmentedPickerProps> = ({
  options,
  value,
  onChange,
  className = "",
  width = "full",
}) => {
  const containerClass =
    width === "full" ? "w-full justify-between" : "w-fit space-x-6";

  const [indicatorStyle, setIndicatorStyle] = React.useState({
    left: 0,
    width: 0,
  });
  const itemsRef = React.useRef<(HTMLButtonElement | null)[]>([]);

  React.useEffect(() => {
    const updateIndicator = () => {
      const activeIndex = options.findIndex((o) => o.value === value);
      const currentItem = itemsRef.current[activeIndex];
      if (currentItem) {
        setIndicatorStyle({
          left: currentItem.offsetLeft,
          width: currentItem.offsetWidth,
        });
      }
    };

    updateIndicator();
    // Use a small timeout to ensure the DOM is ready for measurements
    const timer = setTimeout(updateIndicator, 10);

    window.addEventListener("resize", updateIndicator);
    return () => {
      window.removeEventListener("resize", updateIndicator);
      clearTimeout(timer);
    };
  }, [value, options, width]);

  return (
    <div
      className={cn(
        "flex border-b border-border items-end relative",
        containerClass,
        className
      )}
    >
      {/* Animated Underline Indicator */}
      <div
        className="absolute bottom-0 h-0.5 bg-foreground transition-all duration-300 ease-in-out"
        style={{
          left: indicatorStyle.left,
          width: indicatorStyle.width,
        }}
      />

      {options.map((option, index) => {
        const isActive = value === option.value;

        return (
          <button
            key={option.value}
            ref={(el) => {
              itemsRef.current[index] = el;
            }}
            onClick={() => onChange(option.value)}
            className={cn(
              "pb-3 text-sm font-light transition-colors duration-300 hover:cursor-pointer",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default SegmentedPicker;
