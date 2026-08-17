"use client";

import * as React from "react";
import { Star, ShieldCheck, ThumbsUp } from "lucide-react";
import { ProductReview } from "@/types/product";
import { useTranslation } from "@/i18n/useTranslation";
import { formatDate } from "@/lib/utils";

export function ProductReviews({
  reviews,
  overallRating,
  reviewCount,
}: {
  reviews: ProductReview[];
  overallRating: number;
  reviewCount: number;
}) {
  const { t, lang, isVi } = useTranslation();
  const [likes, setLikes] = React.useState<Record<string, number>>({});

  const handleLike = (id: string, initialCount = 0) => {
    setLikes((prev) => ({
      ...prev,
      [id]: (prev[id] ?? initialCount) + 1,
    }));
  };

  const ratingDistribution = [
    { star: 5, percentage: 88 },
    { star: 4, percentage: 10 },
    { star: 3, percentage: 2 },
    { star: 2, percentage: 0 },
    { star: 1, percentage: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Overview section with subtle flat styling */}
      <div className="grid grid-cols-1 gap-6 rounded-md border border-hairline-light bg-shade-30/10 p-5 sm:grid-cols-3 sm:items-center">
        {/* Left: big score */}
        <div className="flex flex-col items-center justify-center text-center sm:border-r sm:border-hairline-light sm:pr-6">
          <div className="font-display text-4xl font-bold tracking-tight text-ink">
            {overallRating.toFixed(1)}
          </div>
          <div className="mt-1.5 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`h-3.5 w-3.5 ${
                  s <= Math.round(overallRating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-shade-30"
                }`}
              />
            ))}
          </div>
          <p className="mt-1 text-[11px] text-shade-50">
            {t.productDetail.basedOnReviews.replace("{count}", String(reviewCount))}
          </p>
        </div>

        {/* Center: Rating bars */}
        <div className="space-y-1 sm:col-span-2 sm:pl-4">
          {ratingDistribution.map((row) => (
            <div key={row.star} className="flex items-center gap-3 text-xs">
              <span className="w-8 text-shade-60 text-[11px]">{row.star} ★</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-shade-30/50">
                <div
                  className="h-full bg-black rounded-full"
                  style={{ width: `${row.percentage}%` }}
                />
              </div>
              <span className="w-8 text-right text-[11px] font-medium text-shade-50">
                {row.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews list with clean separators */}
      <div className="divide-y divide-hairline-light">
        {reviews.length === 0 ? (
          <div className="py-8 text-center text-xs text-shade-50">
            {t.common.empty}
          </div>
        ) : (
          reviews.map((rev) => {
            const currentLikes = likes[rev.id] ?? rev.likesCount ?? 0;

            return (
              <div
                key={rev.id}
                className="py-5 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-shade-30/50 text-xs font-bold text-ink">
                      {rev.userName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-ink">
                          {rev.userName}
                        </span>
                        {rev.verifiedPurchase && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-800">
                            <ShieldCheck className="h-3 w-3" />
                            {t.productDetail.verifiedBuyer}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`h-3 w-3 ${
                                s <= rev.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-shade-30"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-shade-40">
                          {formatDate(rev.createdAt, lang)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Likes button */}
                  <button
                    type="button"
                    onClick={() => handleLike(rev.id, rev.likesCount)}
                    className="flex items-center gap-1 rounded-full border border-hairline-light px-2.5 py-1 text-xs text-shade-50 hover:bg-shade-30/20 hover:text-ink transition-colors cursor-pointer"
                  >
                    <ThumbsUp className="h-3 w-3" />
                    <span>{currentLikes}</span>
                  </button>
                </div>

                <p className="text-xs text-ink leading-relaxed">
                  {isVi ? rev.comment : rev.commentEn || rev.comment}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
