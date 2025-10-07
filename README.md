# TV Guide Framer Pipeline

A reusable TV Guide system that reads Excel sheets, converts them to JSON **without any timezone conversions**, and renders a horizontally scrollable, sticky-header TV guide component for Framer. Supports multi-region/multi-timezone rules and allows visual customization via props.

## 🏗️ Architecture

```
/scripts
  convert-excel-to-json.ts     # Excel → JSON conversion script
/data
  sample-roa.xlsx              # Sample Excel files
  sample-sa.xlsx
  channel-example.json         # Output example
/src
  /components
    TvGuide.tsx                # Framer-ready React component
    useTvGuide.ts              # Hooks and helpers
  /types
    tvguide.ts                 # TypeScript interfaces
  /theme
    tokens.ts                  # Default theme tokens
```

## 📋 Data Contract

The Excel sheet columns must match exactly:

- `Region`
- `Date` (string like **"Monday, October 6, 2025"**) ← used literally
- `Start Time` (string, e.g., `"5:00"`, `"5:30"`)
- `End Time` (string)
- `Title`
- `Season`
- `Episode`
- `Subtitle`
- `Text Color` (optional hex)
- `BG Color` (optional hex)
- `Timezone` (string: `"WAT" | "CAT" | "EST"`)

**Key Rules:**
- ✅ No UTC or timezone conversion anywhere
- ✅ Treat `Date`, `Start Time`, `End Time` as literal strings
- ✅ For **SA** region, only **CAT** timezone pill is shown
- ✅ For **ROA**, show **WAT, CAT, EST**

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Convert Excel to JSON

```bash
npm run convert -- \
  --excel data/sample-roa.xlsx \
  --channelId zee-world \
  --regions "South Africa,Rest Of Africa" \
  --tz-map '{"South Africa":["CAT"],"Rest Of Africa":["WAT","CAT","EST"]}' \
  --out data/channel-example.json
```

### 3. Development

```bash
npm run dev
```

### 4. Build

```bash
npm run build
```

## 📊 Excel → JSON Conversion

The conversion script (`scripts/convert-excel-to-json.ts`) accepts these arguments:

- `--excel` - Path to Excel file
- `--channelId` - Channel identifier (e.g., "zee-world-africa")
- `--regions` - Comma-separated regions (e.g., "South Africa,Rest Of Africa")
- `--tz-map` - JSON string mapping regions to timezones
- `--out` - Output JSON file path

**Example:**
```bash
npm run convert -- \
  --excel data/sample-roa.xlsx \
  --channelId zee-world \
  --regions "South Africa,Rest Of Africa" \
  --tz-map '{"South Africa":["CAT"],"Rest Of Africa":["WAT","CAT","EST"]}' \
  --out data/channel-example.json
```

## 🎨 Framer Integration

### Using in Framer

1. Copy `/src/components/TvGuide.tsx` into your Framer code component file (`/code/TvGuide.tsx`)
2. The component exports `Controls` for Framer's property panel
3. Pass `dataJSON` either as:
   - Raw JSON string (paste directly in the prop)
   - URL to hosted JSON file (e.g., GitHub raw URL)

### Framer Controls

The component provides these Framer controls:

- `dataJSON` (multiline text) - Raw JSON or URL
- `channelId` (string) - Channel identifier
- `regionsEnabled` (array) - Available regions
- `tzEnabled` (array) - Available timezones
- `defaultRegion` (string) - Initial active region
- `defaultTZ` (string) - Initial active timezone
- `todayHighlight` (boolean) - Highlight current day
- `todayOverride` (string) - Override today's date for staging
- **Styling controls:** `fontFamily`, `fontSize`, `textColor`, `cardBg`, `cardRadius`, `gap`, `headerBg`, `headerText`, `activePillBg`, `activePillText`

### Example Usage in Framer

```tsx
// In your Framer code component
import TvGuide from './TvGuide'

export default function MyTvGuide() {
  return (
    <TvGuide
      dataJSON="https://raw.githubusercontent.com/your-repo/tv-guide-framer-pipeline/main/data/channel-example.json"
      channelId="zee-world"
      regionsEnabled={["South Africa", "Rest Of Africa"]}
      tzEnabled={["WAT", "CAT", "EST"]}
      defaultRegion="South Africa"
      defaultTZ="CAT"
      todayHighlight={true}
      fontFamily="Inter, sans-serif"
      fontSize={14}
      textColor="#333333"
      cardBg="#ffffff"
      cardRadius={8}
      gap={12}
      headerBg="#f8f9fa"
      headerText="#495057"
      activePillBg="#007bff"
      activePillText="#ffffff"
    />
  )
}
```

## 🎯 Component Features

### Layout & UX
- ✅ Horizontal scrollable grid with sticky headers
- ✅ Sticky Region tabs, Timezone chips, and Day strip
- ✅ Left "Time" column sticky for easy reference
- ✅ Time slots sorted lexicographically (no Date math)
- ✅ Grid cells show Title, Season/Episode, Subtitle
- ✅ Per-row `Text Color` and `BG Color` support
- ✅ "Today" highlighting by string equality

### Region/Timezone Logic
- ✅ Region switcher (hidden for single-region channels)
- ✅ TZ pills only show when region supports multiple TZs
- ✅ **Special rule:** SA region only shows CAT timezone
- ✅ Automatic region/TZ switching

### Performance
- ✅ Simple memoization for data processing
- ✅ No virtualization (suitable for typical TV guide sizes)

## 📁 Sample Data

The repository includes sample data in `/data/channel-example.json`:

```json
{
  "channelId": "zee-world",
  "regions": ["South Africa", "Rest Of Africa"],
  "timezonesByRegion": {
    "South Africa": ["CAT"],
    "Rest Of Africa": ["WAT","CAT","EST"]
  },
  "rows": [
    {
      "Region": "South Africa",
      "Date": "Monday, October 6, 2025",
      "Start Time": "5:00",
      "End Time": "5:30",
      "Title": "Sister Wives S1 Ep 142",
      "Season": "1",
      "Episode": "142",
      "Subtitle": "",
      "Text Color": "#FFFFFF",
      "BG Color": "#222222",
      "Timezone": "CAT"
    }
  ]
}
```

## 🛠️ Development

### Project Structure

```
tv-guide-framer-pipeline/
├── scripts/
│   └── convert-excel-to-json.ts    # Excel conversion script
├── data/
│   ├── sample-roa.xlsx             # Sample Excel files
│   ├── sample-sa.xlsx
│   └── channel-example.json        # Example output
├── src/
│   ├── components/
│   │   ├── TvGuide.tsx             # Main component
│   │   └── useTvGuide.ts           # Hooks and helpers
│   ├── types/
│   │   └── tvguide.ts              # TypeScript interfaces
│   ├── theme/
│   │   └── tokens.ts               # Theme tokens
│   └── main.tsx                    # Development entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### TypeScript Interfaces

```typescript
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
  channelId: string;
  regions: string[];
  timezonesByRegion: Record<string, TZ[]>;
  rows: TvGuideRow[];
}
```

## 🚀 GitHub Setup

To create and push this repository:

```bash
# Initialize git repository
git init
git add .
git commit -m "feat: tv guide pipeline (excel->json->framer) with regions & tz"

# Create GitHub repository (requires GitHub CLI)
gh repo create tv-guide-framer-pipeline --public --source=. --remote=origin --push
```

If you don't have GitHub CLI installed or authenticated:

1. Create a new repository on GitHub named `tv-guide-framer-pipeline`
2. Add the remote and push:

```bash
git remote add origin https://github.com/yourusername/tv-guide-framer-pipeline.git
git branch -M main
git push -u origin main
```

## ✅ Acceptance Criteria

- ✅ No UTC or timezone conversion anywhere. Treat `Date`, `Start Time`, `End Time` as literal strings
- ✅ For **SA** region, only **CAT** timezone pill is shown; for **ROA**, show **WAT, CAT, EST**
- ✅ Component adapts to **single-region** channels (no region switcher displayed)
- ✅ Horizontal scroll with sticky region/tz/day headers
- ✅ "Today" highlighting works by **string equality** against `todayOverride` or computed local string
- ✅ Visual props let you change font family, sizes, text color, card bg, radius, spacing
- ✅ Excel → JSON CLI works for any channels and preserves the sheet format exactly
- ✅ Repository created and pushed

## 📝 License

MIT License - feel free to use in your projects!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues or questions, please open an issue on GitHub.
