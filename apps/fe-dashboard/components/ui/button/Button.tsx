import React, { ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps {
  children: ReactNode;
  size?: "xs" | "sm" | "md";
  variant?:
    | "primary"
    | "inverse"
    | "outline"
    | "error"
    | "error-outline"
    | "warning"
    | "warning-outline"
    | "success"
    | "success-outline"
    | "info"
    | "info-outline";
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
  loading = false,
  type = "button",
}) => {
  const sizeClasses = {
    xs: "px-3 py-2 text-xs",
    sm: "px-4 py-3 text-sm",
    md: "px-5 py-3.5 text-sm",
  };

  const variantClasses = {
    primary:
      "bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300",
    inverse:
      "bg-white text-brand-600 ring-1 ring-inset ring-brand-300 hover:bg-brand-50 dark:bg-gray-800 dark:text-brand-400 dark:ring-brand-700/50 dark:hover:bg-brand-500/10",
    outline:
      "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/3 dark:hover:text-gray-300",
    error:
      "bg-error-500 text-white shadow-theme-xs hover:bg-error-600 disabled:bg-error-300",
    "error-outline":
      "bg-white text-error-600 ring-1 ring-inset ring-error-300 hover:bg-error-50 dark:bg-gray-800 dark:text-error-400 dark:ring-error-700/50 dark:hover:bg-error-500/10",
    warning:
      "bg-warning-500 text-white shadow-theme-xs hover:bg-warning-600 disabled:bg-warning-300",
    "warning-outline":
      "bg-white text-warning-600 ring-1 ring-inset ring-warning-300 hover:bg-warning-50 dark:bg-gray-800 dark:text-orange-400 dark:ring-warning-700/50 dark:hover:bg-warning-500/10",
    success:
      "bg-success-500 text-white shadow-theme-xs hover:bg-success-600 disabled:bg-success-300",
    "success-outline":
      "bg-white text-success-600 ring-1 ring-inset ring-success-300 hover:bg-success-50 dark:bg-gray-800 dark:text-success-400 dark:ring-success-700/50 dark:hover:bg-success-500/10",
    info: "bg-primary-500 text-white shadow-theme-xs hover:bg-primary-600 disabled:bg-primary-300",
    "info-outline":
      "bg-white text-primary-600 ring-1 ring-inset ring-primary-300 hover:bg-primary-50 dark:bg-gray-800 dark:text-primary-400 dark:ring-primary-700/50 dark:hover:bg-primary-500/10",
  };

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center font-medium gap-2 rounded-lg transition ${className} ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={18} />
      ) : (
        <>
          {startIcon && <span className="flex items-center">{startIcon}</span>}
          {children}
          {endIcon && <span className="flex items-center">{endIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
