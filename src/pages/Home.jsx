import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import MapView from '../components/MapView'
import Legend from '../components/Legend'
import StateDashboard from '../components/StateDashboard'

export default function Home({ onOpenReport, onOpenUseCase }) {
  const [dataset, setDataset] = useState('geo-mnrega')
  const [year, setYear] = useState('2020')
  const [selectedState, setSelectedState] = useState(null)

  return (
    <div className="flex w-full h-screen bg-gray-100 overflow-hidden font-sans">
      {/* Left Sidebar Fixed Width */}
      <Sidebar 
        dataset={dataset} 
        setDataset={(id) => {
           if (id.startsWith('lulc-')) {
              onOpenUseCase && onOpenUseCase(id);
           } else {
              setDataset(id);
           }
        }} 
        year={year} 
        setYear={setYear} 
      />
      
      {/* Main Map Area (takes remaining width) */}
      <div className="flex-1 relative h-full">
        {/* We can place the top-center Search here or inside MapView */}
        
        {/* Map */}
        <MapView 
          dataset={dataset} 
          year={year} 
          onStateSelect={setSelectedState} 
          selectedState={selectedState}
        />

        {/* Floating Legend Bottom Right */}
        <Legend dataset={dataset} />
        
        {/* State Dashboard Overlay */}
        <StateDashboard 
          stateData={selectedState} 
          dataset={dataset} 
          onClose={() => setSelectedState(null)} 
          onExpand={() => onOpenReport(selectedState, dataset)}
        />
      </div>
    </div>
  )
}
