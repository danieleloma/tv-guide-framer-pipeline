import { useMemo } from 'react';
import { TvGuideJSON, TvGuideRow, ProcessedTvGuide, TZ } from '../types/tvguide';

/**
 * Custom time sorting function that handles time strings like "5:00", "5:30", "6:00"
 * Sorts lexicographically but handles the time format correctly
 */
function sortTimeStrings(times: string[]): string[] {
  return [...times].sort((a, b) => {
    // Split time strings into hours and minutes
    const [aHour, aMin] = a.split(':').map(Number);
    const [bHour, bMin] = b.split(':').map(Number);
    
    // Compare hours first, then minutes
    if (aHour !== bHour) {
      return aHour - bHour;
    }
    return aMin - bMin;
  });
}

/**
 * Hook to process TV Guide data for rendering
 */
export function useTvGuide(
  data: TvGuideJSON | null,
  activeRegion: string,
  activeTZ: TZ
): ProcessedTvGuide | null {
  return useMemo(() => {
    if (!data) return null;

    // Filter rows by active region and timezone
    const filteredRows = data.rows.filter(
      row => row.Region === activeRegion && row.Timezone === activeTZ
    );

    // Get unique days and times from filtered data
    const days = [...new Set(filteredRows.map(row => row.Date))].sort();
    const times = [...new Set(filteredRows.map(row => row['Start Time']))];
    const sortedTimes = sortTimeStrings(times);

    // Build grid structure: { [day]: { [time]: TvGuideRow[] } }
    const grid: Record<string, Record<string, TvGuideRow[]>> = {};
    
    for (const day of days) {
      grid[day] = {};
      for (const time of sortedTimes) {
        grid[day][time] = [];
      }
    }

    // Populate grid with rows
    for (const row of filteredRows) {
      const day = row.Date;
      const time = row['Start Time'];
      
      if (grid[day] && grid[day][time]) {
        grid[day][time].push(row);
      }
    }

    return {
      days,
      times: sortedTimes,
      grid
    };
  }, [data, activeRegion, activeTZ]);
}

/**
 * Get today's date string in the format used by the TV guide
 * Uses local machine date without timezone conversions
 */
export function getTodayString(): string {
  const today = new Date();
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(today);
}

/**
 * Check if a date string matches today
 */
export function isToday(dateString: string, todayOverride?: string): boolean {
  const today = todayOverride || getTodayString();
  return dateString === today;
}

/**
 * Get available timezones for a region, with special handling for South Africa
 */
export function getAvailableTimezones(
  data: TvGuideJSON | null,
  activeRegion: string
): TZ[] {
  if (!data) return [];
  
  // Special rule: South Africa only shows CAT
  if (activeRegion === 'South Africa') {
    return ['CAT'];
  }
  
  return data.timezonesByRegion[activeRegion] || [];
}

/**
 * Get the default region from data
 */
export function getDefaultRegion(data: TvGuideJSON | null): string {
  if (!data || data.regions.length === 0) return '';
  return data.regions[0];
}

/**
 * Get the default timezone for a region
 */
export function getDefaultTimezone(
  data: TvGuideJSON | null,
  region: string
): TZ | null {
  if (!data) return null;
  const availableTZs = getAvailableTimezones(data, region);
  return availableTZs.length > 0 ? availableTZs[0] : null;
}
