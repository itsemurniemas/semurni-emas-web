import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text
}

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  desc = "",
}) => {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3 ${className}`}
    >
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default Card;
