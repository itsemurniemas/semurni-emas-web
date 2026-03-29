import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useIsMobile } from "./use-mobile";

interface UseDeviceAwareSearchOptions {
  debounceDelay?: number;
  onSearch: (query: string) => void;
  isApiFetching?: boolean;
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
  isApiFetching = false,
}: UseDeviceAwareSearchOptions) => {
  const isMobile = useIsMobile();
  const [isHydrated, setIsHydrated] = useState(false);

  // Ensure hydration is complete before rendering mobile UI
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Only calculate isDesktop after hydration to avoid SSR mismatch
  const isDesktop = useMemo(() => {
    if (!isHydrated) return true; // Default to desktop during SSR
    if (isMobile === undefined) return true; // Default to desktop if undefined
    return !isMobile; // Otherwise use the opposite of isMobile
  }, [isMobile, isHydrated]);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Reset loading state when API finishes fetching
  useEffect(() => {
    if (!isApiFetching && isSearching) {
      setIsSearching(false);
    }
  }, [isApiFetching, isSearching]);

  // Handle debounced search for desktop
  useEffect(() => {
    if (!isDesktop) return; // Only debounce on desktop
    if (!searchQuery) return; // Don't search if query is empty

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
    if (!searchQuery) return; // Don't search if query is empty
    setIsSearching(true);
    onSearch(searchQuery);
  }, [searchQuery, onSearch]);

  // Handle keyboard events (Enter key, keyboard dismiss)
  const handleKeyboardEvent = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Search on Enter
      if (e.key === "Enter") {
        e.preventDefault();
        // Dismiss keyboard by blurring the input
        (e.target as HTMLInputElement).blur();
        if (!isDesktop) {
          handleSearchSubmit();
        }
      }
      // Clear search on Escape
      else if (e.key === "Escape") {
        e.preventDefault();
        // Dismiss keyboard by blurring the input
        (e.target as HTMLInputElement).blur();
        setSearchQuery("");
        if (!isDesktop) {
          handleSearchSubmit();
        }
      }
    },
    [isDesktop, handleSearchSubmit],
  );

  // Update search query
  const handleSearchQueryChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

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
