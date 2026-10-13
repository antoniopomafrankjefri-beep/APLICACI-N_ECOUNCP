/**
 * Photo utility for EcoUNCP
 * Uses local photo URLs from points.json (Unsplash photos by context)
 * Prioritizes real photos from the data file
 */

export interface StationPhotoConfig {
  width?: number;
  height?: number;
}

/**
 * Gets the photo URL for a station from its data
 * Uses the photoUrl field from points.json (Unsplash photos by context)
 */
export function getStationPhotoUrl(
  point: { photoUrl?: string; lat?: number; lng?: number },
  config: StationPhotoConfig = { width: 400, height: 300 }
): string | null {
  // Priority 1: Use the photoUrl from points.json (already assigned by context)
  if (point.photoUrl && point.photoUrl.trim() !== '') {
    return point.photoUrl;
  }
  
  // Priority 2: If no photoUrl, return null (will use default fallback)
  return null;
}

/**
 * Gets a generic campus photo as ultimate fallback
 */
export function getDefaultCampusPhoto(): string {
  return 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80';
}

/**
 * Gets a photo URL for a station with fallback to default campus photo
 * Never returns null - always returns a real photo URL
 */
export function getStationPhoto(
  point: { photoUrl?: string; lat?: number; lng?: number; bins?: Array<{categoryId: string}> },
  config: StationPhotoConfig = { width: 400, height: 300 }
): { url: string; source: 'data' | 'default' } {
  const photoUrl = getStationPhotoUrl(point, config);
  
  if (photoUrl) {
    return { url: photoUrl, source: 'data' };
  }
  
  // Ultimate fallback - generic campus photo
  return { url: getDefaultCampusPhoto(), source: 'default' };
}

/**
 * Synchronous version for immediate rendering
 */
export function getStationPhotoSync(
  point: { photoUrl?: string; lat?: number; lng?: number; bins?: Array<{categoryId: string}> },
  config: StationPhotoConfig = { width: 400, height: 300 }
): { url: string; source: 'data' | 'default' } {
  return getStationPhoto(point, config);
}

/**
 * Category color mapping for UI accents (kept for compatibility)
 */
export const STATION_CATEGORY_COLORS: Record<string, string[]> = {
  plastico: ['#FFFFFF', '#CBD5E1', '#94A3B8'],
  papel_carton: ['#1E3A8A', '#2563EB', '#3B82F6'],
  no_aprovechable: ['#0A0A0A', '#171717', '#262626'],
  vidrio: ['#14532D', '#16A34A', '#22C55E'],
  metal: ['#FEF3C7', '#F59E0B', '#EAB308'],
  organico: ['#78350F', '#92400E', '#EA580C'],
  peligroso: ['#DC2626', '#EF4444', '#F87171'],
};

/**
 * Gets category colors for a station based on its bins
 */
export function getStationCategoryColors(bins: Array<{categoryId: string}>): string[] {
  const colors = new Set<string>();
  bins.forEach(bin => {
    const colorsForCategory = STATION_CATEGORY_COLORS[bin.categoryId] || ['#006000', '#E0C000'];
    colorsForCategory.forEach(c => colors.add(c));
  });
  return Array.from(colors).slice(0, 3);
}
