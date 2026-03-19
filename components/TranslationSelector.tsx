"use client";

import { useEffect, useState } from "react";
import { fetchTranslations, type BibleTranslation } from "@/lib/bibleApi";
import { loadBibleId, saveBibleId } from "@/lib/progress";

export function TranslationSelector(props: {
  bibleId: string;
  onChange: (id: string) => void;
}) {
  const [translations, setTranslations] = useState<BibleTranslation[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || translations.length > 0) return;
    setLoading(true);
    setError("");
    fetchTranslations()
      .then((list) => {
        setTranslations(list);
        // Auto-select NIV if no translation chosen yet
        if (!props.bibleId) {
          const niv = list.find(
            (b) =>
              b.abbreviationLocal?.toLowerCase() === "niv" ||
              b.nameLocal?.toLowerCase().includes("new international")
          );
          if (niv) {
            props.onChange(niv.id);
            saveBibleId(niv.id);
          }
        }
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : String(err))
      )
      .finally(() => setLoading(false));
  }, [open]);

  const current = translations.find((t) => t.id === props.bibleId);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-sm border border-neutral-300 rounded px-3 py-1.5 hover:border-black transition-colors bg-white"
      >
        <span className="text-neutral-600">
          {current ? current.abbreviationLocal || current.nameLocal : "Select translation"}
        </span>
        <svg
          className={`w-3 h-3 text-neutral-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-72 bg-white border border-neutral-200 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
          {loading && (
            <div className="px-4 py-3 text-sm text-neutral-500">Loading translations…</div>
          )}
          {error && (
            <div className="px-4 py-3 text-sm text-red-600">{error}</div>
          )}
          {!loading && !error && translations.length === 0 && (
            <div className="px-4 py-3 text-sm text-neutral-500">No translations found.</div>
          )}
          {translations.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                props.onChange(t.id);
                saveBibleId(t.id);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-neutral-50 transition-colors flex items-center justify-between ${
                t.id === props.bibleId ? "bg-neutral-100 font-medium" : ""
              }`}
            >
              <span>{t.nameLocal}</span>
              <span className="text-xs text-neutral-400 ml-2 shrink-0">{t.abbreviationLocal}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
