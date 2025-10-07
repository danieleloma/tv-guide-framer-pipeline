import React from 'react'
import ReactDOM from 'react-dom/client'
import TvGuide from './components/TvGuide'
import sampleData from '../data/channel-example.json'

// Convert sample data to JSON string for the component
const sampleDataString = JSON.stringify(sampleData, null, 2);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TvGuide
      dataJSON={sampleDataString}
      channelId="zee-world"
      regionsEnabled={["South Africa", "Rest Of Africa"]}
      tzEnabled={["WAT", "CAT", "EST"]}
      defaultRegion="South Africa"
      defaultTZ="CAT"
      todayHighlight={true}
      todayOverride="Monday, October 6, 2025"
      fontFamily="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
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
  </React.StrictMode>,
)
