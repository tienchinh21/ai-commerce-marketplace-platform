import { OrderTimelineStep } from "@/types/order";
import { Check, Circle } from "lucide-react";

export function OrderTimeline({
  timeline,
  lang = "vi",
}: {
  timeline: OrderTimelineStep[];
  lang?: string;
}) {
  const isVi = lang === "vi";

  if (!timeline || timeline.length === 0) return null;

  return (
    <div className="relative space-y-6 pl-6 before:absolute before:left-2.5 before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-hairline-light">
      {timeline.map((step, idx) => {
        return (
          <div key={idx} className="relative flex flex-col gap-1">
            {/* Step dot icon */}
            <div
              className={`absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                step.isCompleted
                  ? "bg-black text-white shadow-xs"
                  : step.isCurrent
                  ? "bg-aloe-10 text-black ring-4 ring-aloe-10/30"
                  : "bg-shade-30 text-shade-60"
              }`}
            >
              {step.isCompleted ? (
                <Check className="h-3 w-3 stroke-[3]" />
              ) : (
                <Circle className="h-2 w-2 fill-current" />
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h6 className="text-xs font-semibold text-ink">
                {isVi ? step.title : step.titleEn}
              </h6>
              <span className="text-[11px] text-shade-40">{step.timestamp}</span>
            </div>

            <p className="text-xs text-shade-50">
              {isVi ? step.description : step.descriptionEn}
            </p>
          </div>
        );
      })}
    </div>
  );
}
