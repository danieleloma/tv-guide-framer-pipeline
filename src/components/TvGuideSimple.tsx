import React, { useState, useEffect } from 'react';

// Simple version of the TV Guide component
export default function TvGuideSimple({ dataJSON }: { dataJSON: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!dataJSON) return;

    setLoading(true);
    setError(null);

    try {
      const jsonData = JSON.parse(dataJSON);
      setData(jsonData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse JSON');
    } finally {
      setLoading(false);
    }
  }, [dataJSON]);

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading TV Guide...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;
  }

  if (!data) {
    return <div style={{ padding: '20px' }}>No data available</div>;
  }

  return (
    <div style={{ 
      fontFamily: 'Inter, sans-serif', 
      padding: '20px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1>TV Guide - {data.channelId}</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Regions: {data.regions.join(', ')}</h2>
        <h3>Sample Data ({data.rows.length} rows):</h3>
      </div>

      <div style={{ 
        display: 'grid', 
        gap: '10px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
      }}>
        {data.rows.slice(0, 6).map((row: any, index: number) => (
          <div key={index} style={{
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            border: row['BG Color'] ? `3px solid ${row['BG Color']}` : '1px solid #e0e0e0'
          }}>
            <h4 style={{ 
              margin: '0 0 10px 0',
              color: row['Text Color'] || '#333'
            }}>
              {row.Title}
            </h4>
            <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
              <strong>Date:</strong> {row.Date}
            </p>
            <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
              <strong>Time:</strong> {row['Start Time']} - {row['End Time']}
            </p>
            <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
              <strong>Region:</strong> {row.Region} ({row.Timezone})
            </p>
            {row.Season && row.Episode && (
              <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                <strong>Episode:</strong> S{row.Season} EP{row.Episode}
              </p>
            )}
            {row.Subtitle && (
              <p style={{ margin: '5px 0', fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
                {row.Subtitle}
              </p>
            )}
          </div>
        ))}
      </div>

      {data.rows.length > 6 && (
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
          ... and {data.rows.length - 6} more programs
        </p>
      )}
    </div>
  );
}
