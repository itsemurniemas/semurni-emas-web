"use client";
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, X, LoaderCircle } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface DropdownSearchProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  onSearch?: (searchQuery: string) => void;
  className?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  isLoading?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

const DropdownSearch: React.FC<DropdownSearchProps> = ({
  options,
  placeholder = "Search and select...",
  onChange,
  onSearch,
  className = "",
  value,
  defaultValue = "",
  disabled = false,
  isLoading = false,
  searchQuery = "",
  onSearchChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalSearchQuery, setInternalSearchQuery] = useState("");
  const [selectedValue, setSelectedValue] = useState<string>(
    value || defaultValue,
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Use controlled search query if provided, otherwise use internal state
  const isSearchControlled =
    searchQuery !== undefined && onSearchChange !== undefined;
  const currentSearchQuery = isSearchControlled
    ? searchQuery
    : internalSearchQuery;

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : selectedValue;

  // Get the label of the currently selected value
  const selectedLabel = options.find(
    (opt) => opt.value === currentValue,
  )?.label;

  const handleSearchChange = (newQuery: string) => {
    if (isSearchControlled) {
      onSearchChange?.(newQuery);
    } else {
      setInternalSearchQuery(newQuery);
    }
    onSearch?.(newQuery);
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelectOption = (optionValue: string) => {
    if (!isControlled) {
      setSelectedValue(optionValue);
    }
    onChange(optionValue);
    setIsOpen(false);
    handleSearchChange("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isControlled) {
      setSelectedValue("");
    }
    onChange("");
    handleSearchChange("");
  };

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      {/* Main input trigger */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`h-11 w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 flex items-center justify-between cursor-pointer transition-all ${
          isOpen
            ? "border-brand-300 ring-3 ring-brand-500/10 dark:border-brand-800"
            : ""
        } ${currentValue ? "text-gray-800 dark:text-white/90" : "text-gray-400 dark:text-gray-400"} ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <span className="truncate text-left">
          {selectedLabel || placeholder}
        </span>
        <div className="flex items-center gap-2 shrink-0 ml-2">
          {currentValue && !disabled && (
            <X
              className="h-4 w-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
              onClick={handleClear}
            />
          )}
          <ChevronDown
            className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Dropdown menu */}
      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-50">
          {/* Search input */}
          <div className="p-3 border-b border-gray-300 dark:border-gray-700">
            <input
              ref={searchInputRef}
              type="text"
              placeholder={placeholder}
              value={currentSearchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white/90 placeholder:text-gray-400 dark:placeholder:text-white/30 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:focus:border-brand-800 text-sm"
            />
          </div>

          {/* Options list */}
          <div className="max-h-64 overflow-y-auto">
            {isLoading ? (
              <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                <span>Memuat data...</span>
              </div>
            ) : options.length > 0 ? (
              options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelectOption(option.value)}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                    currentValue === option.value
                      ? "bg-brand-50 dark:bg-brand-500/20 text-brand-700 dark:text-brand-400 font-medium"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {option.label}
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                Tidak ada hasil yang sesuai
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownSearch;
