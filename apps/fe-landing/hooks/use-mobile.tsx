import * as React from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * Detects if device is mobile or tablet using user agent first,
 * then falls back to media query for accuracy
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    // User Agent Detection - More comprehensive device detection
    const userAgent =
      typeof navigator !== "undefined" ? navigator.userAgent : "";

    // Tablet patterns (includes iPad, Android tablets, etc.)
    const tabletPattern =
      /ipad|android(?!.*mobile)|tablet|playbook|silk|kindle|nexus 7|nexus 10/i;

    // Mobile patterns (phones, small devices)
    const mobilePattern =
      /android|webos|iphone|ipod|blackberry|iemobile|opera mini|windows phone/i;

    // Check device type via user agent
    const isTablet = tabletPattern.test(userAgent);
    const isMobileDevice = mobilePattern.test(userAgent);
    const isMobileOrTablet = isTablet || isMobileDevice;

    // If user agent indicates mobile/tablet, always treat as mobile (show search button)
    if (isMobileOrTablet) {
      setIsMobile(true);
      // Still set up media query listener for responsive behavior
      const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
      const onChange = () => {
        // Keep as true for tablets/mobiles regardless of media query
        setIsMobile(true);
      };
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    }

    // Otherwise, fall back to media query for desktop detection
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}
