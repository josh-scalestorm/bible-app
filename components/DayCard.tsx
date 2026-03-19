"use client";

import { forwardRef } from "react";
import { ProgressCheckbox } from "@/components/ProgressCheckbox";
import type { DayReading } from "@/lib/readingPlan";
import { getDayDate } from "@/lib/readingPlan";
import type { DayProgress } from "@/lib/progress";

export const DayCard = forwardRef<
  HTMLDivElement,
  {
    reading: DayReading;
    progress: DayProgress;
    isToday: boolean;
    onToggle: (key: keyof DayProgress) => void;
    onReadPassage: (reference: string) => void;
  }
>(function DayCard(props, ref) {
  const allDone = props.progress.ot && props.progress.nt && props.progress.psalm;
  const hasNt = Boolean(props.reading.nt);

  return (
    <div
      ref={ref}
      className={`rounded-lg border px-5 py-4 transition-colors ${
        props.isToday
          ? "border-black bg-white shadow-md ring-2 ring-black ring-offset-2"
          : allDone
          ? "border-neutral-200 bg-neutral-50"
          : "border-neutral-200 bg-white hover:border-neutral-400"
      }`}
    >
      {/* Day header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span
            className={`text-sm font-bold w-8 text-center ${
              props.isToday ? "text-black" : "text-neutral-500"
            }`}
          >
            {props.reading.day}
          </span>
          <span className="text-xs text-neutral-400">{getDayDate(props.reading.day)}</span>
          {props.isToday && (
            <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full font-medium">
              Today
            </span>
          )}
        </div>
        {allDone && (
          <svg
            className="w-4 h-4 text-neutral-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      {/* Readings */}
      <div className="pl-11 space-y-0.5">
        <ProgressCheckbox
          label="OT"
          reference={props.reading.ot}
          checked={props.progress.ot}
          hasReading
          onChange={() => props.onToggle("ot")}
          onReadClick={props.onReadPassage}
        />
        <ProgressCheckbox
          label="NT"
          reference={props.reading.nt}
          checked={props.progress.nt}
          hasReading={hasNt}
          onChange={() => props.onToggle("nt")}
          onReadClick={props.onReadPassage}
        />
        <ProgressCheckbox
          label="Psalm"
          reference={props.reading.psalm}
          checked={props.progress.psalm}
          hasReading
          onChange={() => props.onToggle("psalm")}
          onReadClick={props.onReadPassage}
        />
      </div>
    </div>
  );
});
