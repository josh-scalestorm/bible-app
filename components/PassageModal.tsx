"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { fetchPassage, type PassageContent } from "@/lib/bibleApi";
import { referenceToPassageId } from "@/lib/readingPlan";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: PassageContent }
  | { status: "error"; message: string };

export function PassageModal(props: {
  reference: string | null;
  bibleId: string;
  onClose: () => void;
}) {
  const [state, setState] = useState<State>({ status: "idle" });
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!props.reference || !props.bibleId) {
      setState({ status: "idle" });
      return;
    }

    setState({ status: "loading" });
    const passageId = referenceToPassageId(props.reference);
    fetchPassage(props.bibleId, passageId)
      .then((data) => setState({ status: "success", data }))
      .catch((err: unknown) =>
        setState({
          status: "error",
          message: err instanceof Error ? err.message : String(err),
        })
      );
  }, [props.reference, props.bibleId]);

  // Close on Escape
  useEffect(() => {
    if (!props.reference) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") props.onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [props.reference, props.onClose]);

  // Focus close button on open
  useEffect(() => {
    if (props.reference) {
      closeRef.current?.focus();
    }
  }, [props.reference]);

  if (!props.reference) return null;

  const modal = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={props.reference}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={props.onClose}
      />

      {/* Panel */}
      <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 shrink-0">
          <h2 className="text-lg font-semibold text-black">{props.reference}</h2>
          <button
            ref={closeRef}
            type="button"
            onClick={props.onClose}
            className="text-neutral-500 hover:text-black transition-colors p-1 rounded"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-4 flex-1">
          {state.status === "loading" && (
            <div className="space-y-3 py-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 bg-neutral-100 rounded animate-pulse"
                  style={{ width: `${70 + (i % 3) * 10}%` }}
                />
              ))}
            </div>
          )}

          {state.status === "error" && (
            <div className="py-6 text-center">
              <p className="text-sm text-red-600 mb-3">{state.message}</p>
              <button
                type="button"
                onClick={() => {
                  setState({ status: "loading" });
                  const passageId = referenceToPassageId(props.reference!);
                  fetchPassage(props.bibleId, passageId)
                    .then((data) => setState({ status: "success", data }))
                    .catch((err: unknown) =>
                      setState({
                        status: "error",
                        message: err instanceof Error ? err.message : String(err),
                      })
                    );
                }}
                className="text-sm border border-black px-4 py-1.5 rounded hover:bg-black hover:text-white transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {state.status === "success" && (
            <div>
              <div
                className="text-base leading-relaxed text-neutral-900 whitespace-pre-wrap font-serif"
                dangerouslySetInnerHTML={{ __html: state.data.content }}
              />
              {state.data.copyright && (
                <p className="mt-6 text-xs text-neutral-400 border-t border-neutral-100 pt-3">
                  {state.data.copyright}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
