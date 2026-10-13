import { WasteItem, Language } from '../types';

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Searches waste items with tolerance for accents, partial substrings, and synonyms
 */
export function filterWasteItems(
  items: WasteItem[],
  query: string,
  categoryId: string | null,
  language: Language
): WasteItem[] {
  const cleanQuery = normalizeText(query);

  return items.filter((item) => {
    // Category filter
    if (categoryId && item.categoryId !== categoryId) {
      return false;
    }

    if (!cleanQuery) {
      return true;
    }

    // Name match
    const itemName = normalizeText(item.name[language] || item.name.es);
    if (itemName.includes(cleanQuery)) {
      return true;
    }

    // Synonyms match
    const synonyms = item.synonyms[language] || item.synonyms.es || [];
    const matchesSynonym = synonyms.some((syn) =>
      normalizeText(syn).includes(cleanQuery)
    );
    if (matchesSynonym) {
      return true;
    }

    // Explanation/observation match
    const exp = normalizeText(item.explanation[language] || '');
    const obs = normalizeText(item.observation[language] || '');
    return exp.includes(cleanQuery) || obs.includes(cleanQuery);
  });
}
