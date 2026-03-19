const API_KEY = process.env.NEXT_PUBLIC_APIBIBLE_KEY ?? "";
const BASE_URL = "https://api.scripture.api.bible/v1";

export type BibleTranslation = {
  id: string;
  name: string;
  nameLocal: string;
  abbreviation: string;
  abbreviationLocal: string;
  language: { id: string; name: string; nameLocal: string };
};

export type PassageContent = {
  id: string;
  bibleId: string;
  content: string;
  reference: string;
  copyright: string;
};

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "api-key": API_KEY },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API.Bible error ${res.status}: ${text || res.statusText}`);
  }
  const json = await res.json();
  return json.data as T;
}

export async function fetchTranslations(): Promise<BibleTranslation[]> {
  const bibles = await apiFetch<BibleTranslation[]>("/bibles?language=eng");
  return bibles;
}

/** Fetch passage text for a given API.Bible passage ID (e.g. "GEN.1-GEN.2").
 *  Returns the passage content with HTML stripped to plain text.
 */
export async function fetchPassage(
  bibleId: string,
  passageId: string
): Promise<PassageContent> {
  const encoded = encodeURIComponent(passageId);
  const params = new URLSearchParams({
    "content-type": "text",
    "include-notes": "false",
    "include-titles": "true",
    "include-chapter-numbers": "false",
    "include-verse-numbers": "true",
    "include-verse-spans": "false",
  });
  return apiFetch<PassageContent>(
    `/bibles/${bibleId}/passages/${encoded}?${params.toString()}`
  );
}
