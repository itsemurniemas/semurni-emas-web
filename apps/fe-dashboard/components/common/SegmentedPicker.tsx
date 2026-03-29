import React from "react";

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
  const [activeIndex, setActiveIndex] = React.useState<number>(0);
  const [indicatorStyle, setIndicatorStyle] = React.useState({
    left: 0,
    width: 0,
  });
  const itemsRef = React.useRef<(HTMLButtonElement | null)[]>([]);

  React.useEffect(() => {
    const index = options.findIndex((o) => o.value === value);
    setActiveIndex(index !== -1 ? index : 0);
  }, [value, options]);

  React.useEffect(() => {
    const updateIndicator = () => {
      const currentItem = itemsRef.current[activeIndex];
      if (currentItem) {
        setIndicatorStyle({
          left: currentItem.offsetLeft,
          width: currentItem.offsetWidth,
        });
      }
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeIndex, width]);

  const containerClass =
    width === "full" ? "w-full" : width === "fit" ? "w-fit" : "w-fit";

  const getButtonClass = (optionValue: string) => {
    const baseClass =
      value === optionValue
        ? "text-gray-900 dark:text-white"
        : "text-gray-500 dark:text-gray-400";

    // Button width logic
    const widthClass =
      width === "full" ? "w-full" : width === "fit" ? "px-4" : "w-32"; // Standard fixed width for static

    return `${baseClass} ${widthClass}`;
  };

  return (
    <div
      className={`relative flex items-stretch gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900 ${containerClass} ${className}`}
    >
      <div
        className="absolute bottom-0.5 top-0.5 rounded-md bg-white shadow-theme-xs transition-all duration-300 ease-in-out dark:bg-gray-800"
        style={{
          left: indicatorStyle.left,
          width: indicatorStyle.width,
        }}
      />

      {options.map((option, index) => (
        <button
          key={option.value}
          ref={(el) => {
            itemsRef.current[index] = el;
          }}
          onClick={() => onChange(option.value)}
          className={`relative z-10 p-2 font-medium rounded-md text-theme-xs sm:text-theme-sm hover:text-gray-900 dark:hover:text-white flex items-center justify-center ${getButtonClass(
            option.value
          )}`}
        >
          <span className="text-center">{option.label}</span>
        </button>
      ))}
    </div>
  );
};

export default SegmentedPicker;
