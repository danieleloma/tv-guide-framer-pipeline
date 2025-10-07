export type TZ = 'WAT' | 'CAT' | 'EST';

export interface TvGuideRow {
  Region: string;
  Date: string;          // "Monday, October 6, 2025"
  'Start Time': string;  // keep as string, no parsing
  'End Time': string;    // keep as string
  Title: string;
  Season?: string | number;
  Episode?: string | number;
  Subtitle?: string;
  'Text Color'?: string;
  'BG Color'?: string;
  Timezone: TZ;
}

export interface TvGuideJSON {
  channelId: string;                   // e.g., "zee-world" / "zee-dunia"
  regions: string[];                   // e.g., ["South Africa", "Rest Of Africa"]
  timezonesByRegion: Record<string, TZ[]>; // e.g., { "South Africa": ["CAT"], "Rest Of Africa": ["WAT","CAT","EST"] }
  rows: TvGuideRow[];                  // raw, flat list in the exact Excel form
}

export interface TvGuideProps {
  dataJSON: string;                    // URL or raw JSON text
  channelId?: string;
  regionsEnabled?: string[];
  tzEnabled?: TZ[];
  defaultRegion?: string;
  defaultTZ?: TZ;
  todayHighlight?: boolean;
  todayOverride?: string;
  fontFamily?: string;
  fontSize?: number;
  textColor?: string;
  cardBg?: string;
  cardRadius?: number;
  gap?: number;
  headerBg?: string;
  headerText?: string;
  activePillBg?: string;
  activePillText?: string;
}

export interface ProcessedTvGuide {
  days: string[];
  times: string[];
  grid: Record<string, Record<string, TvGuideRow[]>>;
}
