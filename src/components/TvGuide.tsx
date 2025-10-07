import { useState, useEffect, useMemo } from 'react';
import { TvGuideProps, TvGuideJSON, TZ } from '../types/tvguide';
import { useTvGuide, getTodayString, isToday, getAvailableTimezones, getDefaultRegion, getDefaultTimezone } from './useTvGuide';
import { defaultTheme } from '../theme/tokens';

// Framer Controls (these would be used in Framer's code component)
const Controls = {
  dataJSON: {
    type: 'string' as const,
    control: 'multiline' as const,
    defaultValue: '',
  },
  channelId: {
    type: 'string' as const,
    defaultValue: '',
  },
  regionsEnabled: {
    type: 'array' as const,
    defaultValue: [],
  },
  tzEnabled: {
    type: 'array' as const,
    defaultValue: [],
  },
  defaultRegion: {
    type: 'string' as const,
    defaultValue: '',
  },
  defaultTZ: {
    type: 'string' as const,
    defaultValue: 'CAT',
  },
  todayHighlight: {
    type: 'boolean' as const,
    defaultValue: true,
  },
  todayOverride: {
    type: 'string' as const,
    defaultValue: '',
  },
  fontFamily: {
    type: 'string' as const,
    defaultValue: defaultTheme.fontFamily,
  },
  fontSize: {
    type: 'number' as const,
    defaultValue: defaultTheme.fontSize,
  },
  textColor: {
    type: 'string' as const,
    defaultValue: defaultTheme.textColor,
  },
  cardBg: {
    type: 'string' as const,
    defaultValue: defaultTheme.cardBg,
  },
  cardRadius: {
    type: 'number' as const,
    defaultValue: defaultTheme.cardRadius,
  },
  gap: {
    type: 'number' as const,
    defaultValue: defaultTheme.gap,
  },
  headerBg: {
    type: 'string' as const,
    defaultValue: defaultTheme.headerBg,
  },
  headerText: {
    type: 'string' as const,
    defaultValue: defaultTheme.headerText,
  },
  activePillBg: {
    type: 'string' as const,
    defaultValue: defaultTheme.activePillBg,
  },
  activePillText: {
    type: 'string' as const,
    defaultValue: defaultTheme.activePillText,
  },
};

interface TvGuideComponentProps extends TvGuideProps {
  // Framer will inject these
  [key: string]: any;
}

export default function TvGuide(props: TvGuideComponentProps) {
  const {
    dataJSON,
    regionsEnabled = [],
    defaultRegion = '',
    defaultTZ = 'CAT',
    todayHighlight = true,
    todayOverride = '',
    fontFamily = defaultTheme.fontFamily,
    fontSize = defaultTheme.fontSize,
    textColor = defaultTheme.textColor,
    cardBg = defaultTheme.cardBg,
    cardRadius = defaultTheme.cardRadius,
    gap = defaultTheme.gap,
    headerBg = defaultTheme.headerBg,
    headerText = defaultTheme.headerText,
    activePillBg = defaultTheme.activePillBg,
    activePillText = defaultTheme.activePillText,
  } = props;

  const [data, setData] = useState<TvGuideJSON | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeRegion, setActiveRegion] = useState<string>('');
  const [activeTZ, setActiveTZ] = useState<TZ>('CAT');

  // Process dataJSON prop
  useEffect(() => {
    if (!dataJSON) return;

    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        let jsonData: TvGuideJSON;

        // Check if dataJSON looks like JSON or is a URL
        if (dataJSON.trim().startsWith('{') || dataJSON.trim().startsWith('[')) {
          // It's raw JSON
          jsonData = JSON.parse(dataJSON);
        } else {
          // It's a URL, fetch it
          const response = await fetch(dataJSON);
          if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
          }
          jsonData = await response.json();
        }

        setData(jsonData);

        // Set default region and timezone
        const defaultRegionValue = defaultRegion || getDefaultRegion(jsonData);
        const defaultTZValue = defaultTZ || getDefaultTimezone(jsonData, defaultRegionValue);

        setActiveRegion(defaultRegionValue);
        if (defaultTZValue) {
          setActiveTZ(defaultTZValue);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataJSON, defaultRegion, defaultTZ]);

  // Get available regions and timezones
  const availableRegions = useMemo(() => {
    if (!data) return [];
    return regionsEnabled.length > 0 ? regionsEnabled : data.regions;
  }, [data, regionsEnabled]);

  const availableTimezones = useMemo(() => {
    return getAvailableTimezones(data, activeRegion);
  }, [data, activeRegion]);

  // Process the guide data
  const processedData = useTvGuide(data, activeRegion, activeTZ);

  // Get today string for highlighting
  const todayString = todayOverride || getTodayString();

  // Styles
  const styles = {
    container: {
      fontFamily,
      fontSize: `${fontSize}px`,
      color: textColor,
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden',
    },
    header: {
      backgroundColor: headerBg,
      color: headerText,
      padding: `${gap}px`,
      borderBottom: `1px solid ${defaultTheme.borderColor}`,
      position: 'sticky' as const,
      top: 0,
      zIndex: 100,
    },
    regionTabs: {
      display: 'flex',
      gap: `${gap / 2}px`,
      marginBottom: availableRegions.length > 1 ? `${gap}px` : '0',
    },
    regionTab: {
      padding: `${gap / 2}px ${gap}px`,
      borderRadius: `${cardRadius}px`,
      border: 'none',
      cursor: 'pointer',
      fontSize: `${fontSize}px`,
      transition: 'all 0.2s ease',
    },
    activeRegionTab: {
      backgroundColor: activePillBg,
      color: activePillText,
    },
    inactiveRegionTab: {
      backgroundColor: 'transparent',
      color: headerText,
      border: `1px solid ${defaultTheme.borderColor}`,
    },
    timezonePills: {
      display: 'flex',
      gap: `${gap / 2}px`,
      marginBottom: availableTimezones.length > 1 ? `${gap}px` : '0',
    },
    timezonePill: {
      padding: `${gap / 3}px ${gap / 2}px`,
      borderRadius: `${cardRadius / 2}px`,
      border: 'none',
      cursor: 'pointer',
      fontSize: `${fontSize * 0.9}px`,
      transition: 'all 0.2s ease',
    },
    activeTimezonePill: {
      backgroundColor: activePillBg,
      color: activePillText,
    },
    inactiveTimezonePill: {
      backgroundColor: 'transparent',
      color: headerText,
      border: `1px solid ${defaultTheme.borderColor}`,
    },
    dayStrip: {
      display: 'flex',
      gap: `${gap}px`,
      padding: `${gap}px`,
      backgroundColor: headerBg,
      borderBottom: `1px solid ${defaultTheme.borderColor}`,
      position: 'sticky' as const,
      top: availableRegions.length > 1 || availableTimezones.length > 1 ? '120px' : '60px',
      zIndex: 99,
    },
    dayHeader: {
      minWidth: '120px',
      textAlign: 'center' as const,
      fontWeight: 'bold',
      padding: `${gap / 2}px`,
    },
    timeHeader: {
      minWidth: '80px',
      textAlign: 'center' as const,
      fontWeight: 'bold',
      padding: `${gap / 2}px`,
    },
    gridContainer: {
      flex: 1,
      overflow: 'auto',
      padding: `${gap}px`,
    },
    grid: {
      display: 'grid',
      gap: `${gap}px`,
      minWidth: 'fit-content',
    },
    timeSlot: {
      minWidth: '80px',
      textAlign: 'center' as const,
      padding: `${gap / 2}px`,
      backgroundColor: headerBg,
      borderRadius: `${cardRadius}px`,
      fontWeight: 'bold',
      position: 'sticky' as const,
      left: 0,
      zIndex: 10,
    },
    programCard: {
      backgroundColor: cardBg,
      borderRadius: `${cardRadius}px`,
      padding: `${gap / 2}px`,
      minHeight: '60px',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      border: '1px solid transparent',
    },
    programCardHover: {
      boxShadow: defaultTheme.shadow,
      transform: 'translateY(-1px)',
    },
    programTitle: {
      fontWeight: 'bold',
      marginBottom: '2px',
      lineHeight: 1.2,
    },
    programEpisode: {
      fontSize: `${fontSize * 0.8}px`,
      opacity: 0.8,
      marginBottom: '2px',
    },
    programSubtitle: {
      fontSize: `${fontSize * 0.8}px`,
      opacity: 0.7,
      fontStyle: 'italic',
    },
    todayMarker: {
      borderLeft: `4px solid ${activePillBg}`,
    },
    loading: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '200px',
      fontSize: `${fontSize * 1.2}px`,
    },
    error: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '200px',
      color: '#dc3545',
      fontSize: `${fontSize * 1.1}px`,
    },
  };

  if (loading) {
    return <div style={styles.loading}>Loading TV Guide...</div>;
  }

  if (error) {
    return <div style={styles.error}>Error: {error}</div>;
  }

  if (!data || !processedData) {
    return <div style={styles.error}>No data available</div>;
  }

  return (
    <div style={styles.container}>
      {/* Header with Region and Timezone controls */}
      <div style={styles.header}>
        {availableRegions.length > 1 && (
          <div style={styles.regionTabs}>
            {availableRegions.map((region) => (
              <button
                key={region}
                style={{
                  ...styles.regionTab,
                  ...(activeRegion === region ? styles.activeRegionTab : styles.inactiveRegionTab),
                }}
                onClick={() => {
                  setActiveRegion(region);
                  const defaultTZForRegion = getDefaultTimezone(data, region);
                  if (defaultTZForRegion) {
                    setActiveTZ(defaultTZForRegion);
                  }
                }}
              >
                {region}
              </button>
            ))}
          </div>
        )}

        {availableTimezones.length > 1 && (
          <div style={styles.timezonePills}>
            {availableTimezones.map((tz) => (
              <button
                key={tz}
                style={{
                  ...styles.timezonePill,
                  ...(activeTZ === tz ? styles.activeTimezonePill : styles.inactiveTimezonePill),
                }}
                onClick={() => setActiveTZ(tz)}
              >
                {tz}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Day strip */}
      <div style={styles.dayStrip}>
        <div style={{ ...styles.dayHeader, minWidth: '80px' }}>Time</div>
        {processedData.days.map((day) => (
          <div
            key={day}
            style={{
              ...styles.dayHeader,
              ...(todayHighlight && isToday(day, todayString) ? styles.todayMarker : {}),
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div style={styles.gridContainer}>
        <div
          style={{
            ...styles.grid,
            gridTemplateColumns: `80px repeat(${processedData.days.length}, 120px)`,
          }}
        >
          {/* Time slots header */}
          {processedData.times.map((time) => (
            <div key={time} style={styles.timeSlot}>
              {time}
            </div>
          ))}

          {/* Program cards */}
          {processedData.days.map((day) =>
            processedData.times.map((time) => {
              const programs = processedData.grid[day]?.[time] || [];
              return (
                <div
                  key={`${day}-${time}`}
                  style={{
                    ...styles.programCard,
                    ...(todayHighlight && isToday(day, todayString) ? styles.todayMarker : {}),
                  }}
                  onMouseEnter={(e) => {
                    Object.assign(e.currentTarget.style, styles.programCardHover);
                  }}
                  onMouseLeave={(e) => {
                    Object.assign(e.currentTarget.style, {});
                  }}
                >
                  {programs.map((program, index) => (
                    <div key={index}>
                      <div
                        style={{
                          ...styles.programTitle,
                          color: program['Text Color'] || textColor,
                          backgroundColor: program['BG Color'] || 'transparent',
                          padding: program['BG Color'] ? '2px 4px' : '0',
                          borderRadius: program['BG Color'] ? '4px' : '0',
                        }}
                      >
                        {program.Title}
                      </div>
                      {(program.Season || program.Episode) && (
                        <div style={styles.programEpisode}>
                          S{program.Season} EP {program.Episode}
                        </div>
                      )}
                      {program.Subtitle && (
                        <div style={styles.programSubtitle}>{program.Subtitle}</div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

// Export for Framer
export { Controls };
