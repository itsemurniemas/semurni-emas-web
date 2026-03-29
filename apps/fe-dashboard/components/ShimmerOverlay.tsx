/**
 * Shimmer Overlay Component
 *
 * Displays a subtle shimmer overlay on top of content during loading
 * without replacing the content itself or causing layout shift
 */

interface ShimmerOverlayProps {
  isVisible: boolean;
  className?: string;
}

export const ShimmerOverlay: React.FC<ShimmerOverlayProps> = ({
  isVisible,
  className = "",
}) => {
  if (!isVisible) return null;

  return (
    <div
      className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none rounded-lg ${className}`}
      style={{
        animation: "shimmer 2s infinite",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
      aria-hidden="true"
    />
  );
};
