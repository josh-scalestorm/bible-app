export type DayReading = {
  day: number;
  ot: string;
  nt: string;
  psalm: string;
};

// OSIS book IDs used by API.Bible
const OT_BOOKS = [
  { id: "GEN", name: "Genesis", chapters: 50 },
  { id: "EXO", name: "Exodus", chapters: 40 },
  { id: "LEV", name: "Leviticus", chapters: 27 },
  { id: "NUM", name: "Numbers", chapters: 36 },
  { id: "DEU", name: "Deuteronomy", chapters: 34 },
  { id: "JOS", name: "Joshua", chapters: 24 },
  { id: "JDG", name: "Judges", chapters: 21 },
  { id: "RUT", name: "Ruth", chapters: 4 },
  { id: "1SA", name: "1 Samuel", chapters: 31 },
  { id: "2SA", name: "2 Samuel", chapters: 24 },
  { id: "1KI", name: "1 Kings", chapters: 22 },
  { id: "2KI", name: "2 Kings", chapters: 25 },
  { id: "1CH", name: "1 Chronicles", chapters: 29 },
  { id: "2CH", name: "2 Chronicles", chapters: 36 },
  { id: "EZR", name: "Ezra", chapters: 10 },
  { id: "NEH", name: "Nehemiah", chapters: 13 },
  { id: "EST", name: "Esther", chapters: 10 },
  { id: "JOB", name: "Job", chapters: 42 },
  { id: "PRO", name: "Proverbs", chapters: 31 },
  { id: "ECC", name: "Ecclesiastes", chapters: 12 },
  { id: "SNG", name: "Song of Solomon", chapters: 8 },
  { id: "ISA", name: "Isaiah", chapters: 66 },
  { id: "JER", name: "Jeremiah", chapters: 52 },
  { id: "LAM", name: "Lamentations", chapters: 5 },
  { id: "EZK", name: "Ezekiel", chapters: 48 },
  { id: "DAN", name: "Daniel", chapters: 12 },
  { id: "HOS", name: "Hosea", chapters: 14 },
  { id: "JOL", name: "Joel", chapters: 3 },
  { id: "AMO", name: "Amos", chapters: 9 },
  { id: "OBA", name: "Obadiah", chapters: 1 },
  { id: "JON", name: "Jonah", chapters: 4 },
  { id: "MIC", name: "Micah", chapters: 7 },
  { id: "NAH", name: "Nahum", chapters: 3 },
  { id: "HAB", name: "Habakkuk", chapters: 3 },
  { id: "ZEP", name: "Zephaniah", chapters: 3 },
  { id: "HAG", name: "Haggai", chapters: 2 },
  { id: "ZEC", name: "Zechariah", chapters: 14 },
  { id: "MAL", name: "Malachi", chapters: 4 },
];

const NT_BOOKS = [
  { id: "MAT", name: "Matthew", chapters: 28 },
  { id: "MRK", name: "Mark", chapters: 16 },
  { id: "LUK", name: "Luke", chapters: 24 },
  { id: "JHN", name: "John", chapters: 21 },
  { id: "ACT", name: "Acts", chapters: 28 },
  { id: "ROM", name: "Romans", chapters: 16 },
  { id: "1CO", name: "1 Corinthians", chapters: 16 },
  { id: "2CO", name: "2 Corinthians", chapters: 13 },
  { id: "GAL", name: "Galatians", chapters: 6 },
  { id: "EPH", name: "Ephesians", chapters: 6 },
  { id: "PHP", name: "Philippians", chapters: 4 },
  { id: "COL", name: "Colossians", chapters: 4 },
  { id: "1TH", name: "1 Thessalonians", chapters: 5 },
  { id: "2TH", name: "2 Thessalonians", chapters: 3 },
  { id: "1TI", name: "1 Timothy", chapters: 6 },
  { id: "2TI", name: "2 Timothy", chapters: 4 },
  { id: "TIT", name: "Titus", chapters: 3 },
  { id: "PHM", name: "Philemon", chapters: 1 },
  { id: "HEB", name: "Hebrews", chapters: 13 },
  { id: "JAS", name: "James", chapters: 5 },
  { id: "1PE", name: "1 Peter", chapters: 5 },
  { id: "2PE", name: "2 Peter", chapters: 3 },
  { id: "1JN", name: "1 John", chapters: 5 },
  { id: "2JN", name: "2 John", chapters: 1 },
  { id: "3JN", name: "3 John", chapters: 1 },
  { id: "JUD", name: "Jude", chapters: 1 },
  { id: "REV", name: "Revelation", chapters: 22 },
];

// Flatten to individual chapters
type BookChapter = { bookId: string; bookName: string; chapter: number };

function flattenChapters(books: typeof OT_BOOKS): BookChapter[] {
  return books.flatMap((b) =>
    Array.from({ length: b.chapters }, (_, i) => ({
      bookId: b.id,
      bookName: b.name,
      chapter: i + 1,
    }))
  );
}

function chaptersToRef(chapters: BookChapter[]): string {
  if (chapters.length === 0) return "";
  if (chapters.length === 1) {
    return `${chapters[0].bookName} ${chapters[0].chapter}`;
  }

  // Group consecutive chapters in the same book
  const grouped: { bookName: string; start: number; end: number }[] = [];
  for (const ch of chapters) {
    const last = grouped[grouped.length - 1];
    if (last && last.bookName === ch.bookName && last.end + 1 === ch.chapter) {
      last.end = ch.chapter;
    } else {
      grouped.push({ bookName: ch.bookName, start: ch.chapter, end: ch.chapter });
    }
  }

  return grouped
    .map((g) =>
      g.start === g.end ? `${g.bookName} ${g.start}` : `${g.bookName} ${g.start}-${g.end}`
    )
    .join("; ");
}

function generateReadingPlan(): DayReading[] {
  const otChapters = flattenChapters(OT_BOOKS); // 779 chapters
  const ntChapters = flattenChapters(NT_BOOKS); // 260 chapters

  // Distribute OT: 779 chapters across 365 days
  // 779 = 365*2 + 49, so 49 days get 3 chapters, 316 days get 2 chapters
  const otPerDay: number[] = [];
  let remaining = 779;
  for (let d = 0; d < 365; d++) {
    const daysLeft = 365 - d;
    const chapLeft = remaining;
    const avg = chapLeft / daysLeft;
    const assign = avg >= 2.5 ? 3 : 2;
    otPerDay.push(Math.min(assign, chapLeft));
    remaining -= Math.min(assign, chapLeft);
  }

  // NT: 1 chapter/day for the first 260 days, "" for days 261-365
  const ntPerDay: number[] = Array.from({ length: 365 }, (_, i) => (i < 260 ? 1 : 0));

  const plan: DayReading[] = [];
  let otIdx = 0;
  let ntIdx = 0;

  for (let day = 1; day <= 365; day++) {
    const di = day - 1;

    // OT reading
    const otCount = otPerDay[di];
    const otSlice = otChapters.slice(otIdx, otIdx + otCount);
    otIdx += otCount;

    // NT reading
    const ntCount = ntPerDay[di];
    const ntSlice = ntChapters.slice(ntIdx, ntIdx + ntCount);
    ntIdx += ntCount;

    // Psalm: cycle through Psalm 1-150
    const psalmNum = ((di % 150) + 1);

    plan.push({
      day,
      ot: chaptersToRef(otSlice),
      nt: chaptersToRef(ntSlice),
      psalm: `Psalm ${psalmNum}`,
    });
  }

  return plan;
}

export const READING_PLAN: DayReading[] = generateReadingPlan();

export function getTodayDayNumber(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  return Math.min(Math.max(Math.floor(diff / 86_400_000) + 1, 1), 365);
}

export function getDayDate(day: number): string {
  const date = new Date(new Date().getFullYear(), 0, day);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Convert a human-readable reference to API.Bible passage ID format.
 * Examples:
 *   "Genesis 1" → "GEN.1"
 *   "Genesis 1-2" → "GEN.1-GEN.2"
 *   "Psalm 23" → "PSA.23"
 */
export function referenceToPassageId(reference: string): string {
  // Handle multi-section refs joined by "; "
  const parts = reference.split(";").map((p) => p.trim());
  return parts.map(singleRefToPassageId).join(",");
}

const BOOK_ID_MAP: Record<string, string> = {
  genesis: "GEN",
  exodus: "EXO",
  leviticus: "LEV",
  numbers: "NUM",
  deuteronomy: "DEU",
  joshua: "JOS",
  judges: "JDG",
  ruth: "RUT",
  "1 samuel": "1SA",
  "2 samuel": "2SA",
  "1 kings": "1KI",
  "2 kings": "2KI",
  "1 chronicles": "1CH",
  "2 chronicles": "2CH",
  ezra: "EZR",
  nehemiah: "NEH",
  esther: "EST",
  job: "JOB",
  psalm: "PSA",
  psalms: "PSA",
  proverbs: "PRO",
  ecclesiastes: "ECC",
  "song of solomon": "SNG",
  isaiah: "ISA",
  jeremiah: "JER",
  lamentations: "LAM",
  ezekiel: "EZK",
  daniel: "DAN",
  hosea: "HOS",
  joel: "JOL",
  amos: "AMO",
  obadiah: "OBA",
  jonah: "JON",
  micah: "MIC",
  nahum: "NAH",
  habakkuk: "HAB",
  zephaniah: "ZEP",
  haggai: "HAG",
  zechariah: "ZEC",
  malachi: "MAL",
  matthew: "MAT",
  mark: "MRK",
  luke: "LUK",
  john: "JHN",
  acts: "ACT",
  romans: "ROM",
  "1 corinthians": "1CO",
  "2 corinthians": "2CO",
  galatians: "GAL",
  ephesians: "EPH",
  philippians: "PHP",
  colossians: "COL",
  "1 thessalonians": "1TH",
  "2 thessalonians": "2TH",
  "1 timothy": "1TI",
  "2 timothy": "2TI",
  titus: "TIT",
  philemon: "PHM",
  hebrews: "HEB",
  james: "JAS",
  "1 peter": "1PE",
  "2 peter": "2PE",
  "1 john": "1JN",
  "2 john": "2JN",
  "3 john": "3JN",
  jude: "JUD",
  revelation: "REV",
};

function singleRefToPassageId(ref: string): string {
  // Try to match: "Book Name chapter" or "Book Name chapter-chapter"
  // e.g. "Genesis 1", "Genesis 1-2", "1 Samuel 3", "Psalm 23"
  const match = ref.match(/^(.+?)\s+(\d+)(?:-(\d+))?$/);
  if (!match) return ref;

  const bookKey = match[1].toLowerCase();
  const startChapter = match[2];
  const endChapter = match[3];
  const bookId = BOOK_ID_MAP[bookKey];

  if (!bookId) return ref;

  if (endChapter) {
    return `${bookId}.${startChapter}-${bookId}.${endChapter}`;
  }
  return `${bookId}.${startChapter}`;
}
