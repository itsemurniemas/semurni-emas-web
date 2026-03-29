import React from "react";
import { RatingModel } from "@repo/core";
import { Star } from "lucide-react";
import ComponentCard from "@/components/common/ComponentCard";

interface RatingsSectionProps {
  avgRating?: number;
  ratings?: RatingModel[];
}

export const RatingsSection: React.FC<RatingsSectionProps> = ({
  avgRating = 0,
  ratings = [],
}) => {
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFull = i <= Math.floor(rating);
      const isHalf = i === Math.ceil(rating) && rating % 1 !== 0;

      stars.push(
        <div key={i} className="relative">
          <Star
            size={16}
            className={`${
              isFull
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300 dark:text-gray-600"
            }`}
          />
          {isHalf && (
            <div className="absolute inset-0 w-2 overflow-hidden">
              <Star size={16} className="fill-yellow-400 text-yellow-400" />
            </div>
          )}
        </div>,
      );
    }
    return stars;
  };

  return (
    <div className="space-y-6">
      {/* Average Rating Summary */}
      <ComponentCard title="Rating Ringkas">
        <div className="flex items-center gap-4 p-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800 dark:text-white">
              {avgRating?.toFixed(1) || "0.0"}
            </div>
            <div className="flex gap-1 mt-2 justify-center">
              {renderStars(avgRating || 0)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              dari {ratings.length} rating
            </p>
          </div>
          <div className="flex-1">
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratings.filter((r) => r.score === star).length;
                const percentage =
                  ratings.length > 0 ? (count / ratings.length) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-8">
                      {star}⭐
                    </span>
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 w-6 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* Individual Ratings */}
      <ComponentCard title={`Ulasan Pelanggan (${ratings.length})`}>
        <div className="space-y-4 p-4">
          {ratings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                Belum ada rating untuk karyawan ini
              </p>
            </div>
          ) : (
            ratings.map((rating) => (
              <div
                key={rating.id}
                className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex gap-1">{renderStars(rating.score)}</div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(rating.createdAt).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                {rating.comment && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {rating.comment}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </ComponentCard>
    </div>
  );
};
