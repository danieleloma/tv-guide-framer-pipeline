import React from 'react'
import ReactDOM from 'react-dom/client'
import TvGuideSimple from './components/TvGuideSimple'
import sampleData from '../data/channel-example.json'

// Convert sample data to JSON string for the component
const sampleDataString = JSON.stringify(sampleData, null, 2);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TvGuideSimple dataJSON={sampleDataString} />
  </React.StrictMode>,
)
