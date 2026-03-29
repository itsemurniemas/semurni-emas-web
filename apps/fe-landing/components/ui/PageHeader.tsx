import React from "react";

interface PageHeaderProps {
  title?: string;
  description?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => {
  return (
    <div className="mb-8">
      {title && (
        <h1 className="text-3xl font-light text-foreground mb-2">{title}</h1>
      )}
      {description && (
        <p className="text-sm font-light text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
};

export default PageHeader;
