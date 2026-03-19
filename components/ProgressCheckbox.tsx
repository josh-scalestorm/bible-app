"use client";

export function ProgressCheckbox(props: {
  label: string;
  reference: string;
  checked: boolean;
  hasReading: boolean;
  onChange: () => void;
  onReadClick: (reference: string) => void;
}) {
  if (!props.hasReading) {
    return (
      <div className="flex items-center gap-2 py-1 opacity-30">
        <div className="w-4 h-4 rounded border border-neutral-300 shrink-0" />
        <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400 w-12 shrink-0">
          {props.label}
        </span>
        <span className="text-sm text-neutral-400 italic">—</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 py-1">
      <input
        type="checkbox"
        checked={props.checked}
        onChange={props.onChange}
        className="w-4 h-4 rounded border-neutral-400 text-black accent-black cursor-pointer shrink-0"
        aria-label={`Mark ${props.label} reading complete`}
      />
      <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500 w-12 shrink-0">
        {props.label}
      </span>
      <button
        type="button"
        onClick={() => props.onReadClick(props.reference)}
        className={`text-sm text-left hover:underline transition-colors cursor-pointer ${
          props.checked ? "text-neutral-400 line-through" : "text-black"
        }`}
      >
        {props.reference}
      </button>
    </div>
  );
}
