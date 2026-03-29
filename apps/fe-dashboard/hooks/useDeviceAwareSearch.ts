import { useState, useEffect, useRef, useCallback } from "react";
import { useMediaQuery } from "./use-media-query";

interface UseDeviceAwareSearchOptions {
  debounceDelay?: number;
  onSearch: (query: string) => void;
}

/**
 * Device-aware search hook that:
 * - Desktop (md and above): Auto-search with debounce
 * - Tablet & Mobile: Manual search button + keyboard submit
 *
 * Breakpoint: 768px (md in Tailwind)
 * Desktop: >= 768px
 * Mobile/Tablet: < 768px
 */
export const useDeviceAwareSearch = ({
  debounceDelay = 500,
  onSearch,
}: UseDeviceAwareSearchOptions) => {
  // Use the desktop breakpoint (md: 768px)
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [searchQuery, setSearchQuery] = useState<string>("");
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Handle debounced search for desktop
  useEffect(() => {
    if (!isDesktop) return; // Only debounce on desktop

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer for debounced search
    debounceTimerRef.current = setTimeout(() => {
      onSearch(searchQuery);
      setIsSearching(false);
    }, debounceDelay);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery, isDesktop, debounceDelay, onSearch]);

  // Handle manual search for mobile/tablet
  const handleSearchSubmit = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    onSearch(searchQuery);
    setIsSearching(false);
  }, [searchQuery, onSearch]);

  // Handle keyboard events (Enter key, keyboard dismiss)
  const handleKeyboardEvent = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Search on Enter
      if (e.key === "Enter") {
        e.preventDefault();
        if (!isDesktop) {
          handleSearchSubmit();
        }
      }
      // Clear search on Escape
      else if (e.key === "Escape") {
        setSearchQuery("");
        if (!isDesktop) {
          handleSearchSubmit();
        }
      }
    },
    [isDesktop, handleSearchSubmit],
  );

  // Update search query and show loading state
  const handleSearchQueryChange = useCallback(
    (value: string) => {
      setSearchQuery(value);
      if (!isDesktop) {
        setIsSearching(true);
      }
    },
    [isDesktop],
  );

  // Clear search
  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    onSearch("");
    setIsSearching(false);
  }, [onSearch]);

  return {
    searchQuery,
    setSearchQuery: handleSearchQueryChange,
    handleSearchSubmit,
    handleKeyboardEvent,
    handleClearSearch,
    isDesktop,
    isSearching,
  };
};
