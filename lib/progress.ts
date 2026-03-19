const STORAGE_KEY = "bible-reading-progress";
const BIBLE_ID_KEY = "bible-translation-id";

export type DayProgress = {
  ot: boolean;
  nt: boolean;
  psalm: boolean;
};

export type ProgressStore = Record<number, DayProgress>;

export function loadProgress(): ProgressStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProgressStore) : {};
  } catch {
    return {};
  }
}

export function saveProgress(store: ProgressStore): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // ignore storage errors
  }
}

export function toggleProgress(
  store: ProgressStore,
  day: number,
  key: keyof DayProgress
): ProgressStore {
  const current = store[day] ?? { ot: false, nt: false, psalm: false };
  return {
    ...store,
    [day]: { ...current, [key]: !current[key] },
  };
}

export function completedDaysCount(store: ProgressStore): number {
  return Object.values(store).filter((p) => p.ot && p.nt && p.psalm).length;
}

export function loadBibleId(): string {
  try {
    return localStorage.getItem(BIBLE_ID_KEY) ?? "";
  } catch {
    return "";
  }
}

export function saveBibleId(id: string): void {
  try {
    localStorage.setItem(BIBLE_ID_KEY, id);
  } catch {
    // ignore
  }
}
