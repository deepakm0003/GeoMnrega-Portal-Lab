import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import MapView from '../components/MapView'
import Legend from '../components/Legend'

export default function Home() {
  const [dataset, setDataset] = useState('geo-mnrega')
  const [year, setYear] = useState('2020')

  return (
    <div className="flex w-full h-screen bg-gray-100 overflow-hidden font-sans">
      {/* Left Sidebar Fixed Width */}
      <Sidebar 
        dataset={dataset} 
        setDataset={setDataset} 
        year={year} 
        setYear={setYear} 
      />
      
      {/* Main Map Area (takes remaining width) */}
      <div className="flex-1 relative h-full">
        {/* We can place the top-center Search here or inside MapView */}
        
        {/* Map */}
        <MapView dataset={dataset} year={year} />

        {/* Floating Legend Bottom Right */}
        <Legend dataset={dataset} />
      </div>
    </div>
  )
}
