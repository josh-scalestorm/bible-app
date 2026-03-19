"use client";

import { useEffect, useRef, useState } from "react";
import { DayCard } from "@/components/DayCard";
import { PassageModal } from "@/components/PassageModal";
import { TranslationSelector } from "@/components/TranslationSelector";
import {
  READING_PLAN,
  getTodayDayNumber,
} from "@/lib/readingPlan";
import {
  completedDaysCount,
  loadBibleId,
  loadProgress,
  saveProgress,
  toggleProgress,
  type DayProgress,
  type ProgressStore,
} from "@/lib/progress";

export default function HomePage() {
  const [progress, setProgress] = useState<ProgressStore>(() => loadProgress());
  const [activeReference, setActiveReference] = useState<string | null>(null);
  const [bibleId, setBibleId] = useState<string>(() => loadBibleId());
  const [showNoBibleWarning, setShowNoBibleWarning] = useState(false);

  const todayDay = getTodayDayNumber();
  const todayRef = useRef<HTMLDivElement>(null);

  // Scroll today's card into view on mount
  useEffect(() => {
    todayRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  function handleToggle(day: number, key: keyof DayProgress) {
    const next = toggleProgress(progress, day, key);
    setProgress(next);
    saveProgress(next);
  }

  function handleReadPassage(reference: string) {
    if (!bibleId) {
      setShowNoBibleWarning(true);
      return;
    }
    setShowNoBibleWarning(false);
    setActiveReference(reference);
  }

  function handleBibleChange(id: string) {
    setBibleId(id);
    setShowNoBibleWarning(false);
  }

  const done = completedDaysCount(progress);
  const pct = Math.round((done / 365) * 100);

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Sticky header */}
      <header className="sticky top-0 z-10 bg-white border-b border-neutral-200 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-black">
                Bible in a Year
              </h1>
              <p className="text-xs text-neutral-500 mt-0.5">
                Biblica 365-day reading plan
              </p>
            </div>
            <TranslationSelector bibleId={bibleId} onChange={handleBibleChange} />
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-neutral-500 mb-1.5">
              <span>{done} of 365 days complete</span>
              <span>{pct}%</span>
            </div>
            <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-black rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {showNoBibleWarning && (
            <p className="mt-3 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">
              Please select a Bible translation above to read passages.
            </p>
          )}
        </div>
      </header>

      {/* Day list */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-3 pb-24">
        {READING_PLAN.map((reading) => {
          const isToday = reading.day === todayDay;
          const dayProgress = progress[reading.day] ?? {
            ot: false,
            nt: false,
            psalm: false,
          };

          return (
            <DayCard
              key={reading.day}
              ref={isToday ? todayRef : undefined}
              reading={reading}
              progress={dayProgress}
              isToday={isToday}
              onToggle={(key) => handleToggle(reading.day, key)}
              onReadPassage={handleReadPassage}
            />
          );
        })}
      </div>

      <PassageModal
        reference={activeReference}
        bibleId={bibleId}
        onClose={() => setActiveReference(null)}
      />
    </main>
  );
}
