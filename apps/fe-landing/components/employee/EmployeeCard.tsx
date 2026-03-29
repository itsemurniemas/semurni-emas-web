"use client";

import React from "react";
import { Star, User } from "lucide-react";
import { EmployeeModel } from "@repo/core";
import { getBase64ImageUrl } from "@repo/core/extension/number";

interface EmployeeCardProps {
  employee: EmployeeModel;
  branchName?: string;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  branchName,
}) => {
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFull = star <= Math.floor(rating);
          const isHalf = star === Math.ceil(rating) && rating % 1 !== 0;

          return (
            <div key={star} className="relative">
              <Star
                size={12}
                className={`${isFull ? "fill-foreground text-foreground" : "text-border"}`}
              />
              {isHalf && (
                <div className="absolute top-0 left-0 overflow-hidden w-1.5">
                  <Star size={12} className="fill-foreground text-foreground" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg p-5 text-center hover:border-foreground/20 transition-colors">
      {/* Avatar */}
      <div className="w-20 h-20 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center relative overflow-hidden">
        {employee.image ? (
          <img
            src={employee.image}
            alt={employee.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <User size={32} className="text-muted-foreground" />
        )}
      </div>

      {/* Name */}
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {employee.name}
      </h3>

      {/* Position */}
      <p className="text-xs font-light text-muted-foreground mb-3">
        {employee.positionName}
      </p>

      {/* Rating */}
      {employee.avgRating === undefined ? (
        <p className="text-xs font-light text-muted-foreground">
          Belum ada rating
        </p>
      ) : (
        <div className="flex flex-col items-center gap-1">
          <div className="flex justify-center">
            {renderStars(employee.avgRating)}
          </div>
          <p className="text-xs font-medium text-foreground">
            {employee.avgRating.toFixed(1)}
          </p>
        </div>
      )}
    </div>
  );
};

export default EmployeeCard;
