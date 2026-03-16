import React, { useState } from 'react'

export default function ControlPanel({ onDatasetChange, onYearChange }) {
  const [dataset, setDataset] = useState('geo-mnrega')
  const [year, setYear] = useState('2020')
  const [geoLevel, setGeoLevel] = useState('state')

  const handleDatasetChange = (e) => {
    const value = e.target.value
    setDataset(value)
    onDatasetChange(value)
  }

  const handleYearChange = (e) => {
    const value = e.target.value
    setYear(value)
    onYearChange(value)
  }

  const handleGeoLevelChange = (e) => {
    setGeoLevel(e.target.value)
  }

  return (
    <div className="absolute top-24 left-6 z-40 bg-white rounded-lg shadow-lg p-6 w-72 border border-gray-200">
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-primary-blue uppercase tracking-wide mb-4">
          Dataset Controls
        </h2>
        
        {/* Dataset Selector */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Dataset
          </label>
          <select
            value={dataset}
            onChange={handleDatasetChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue"
          >
            <option value="geo-mnrega">Geo-MNREGA Works</option>
            <option value="mnrega-assets">MNREGA Assets</option>
            <option value="lulc">LULC 250m (Demo)</option>
          </select>
        </div>

        {/* Year Selector */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Year
          </label>
          <select
            value={year}
            onChange={handleYearChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue"
          >
            <option value="2018">2018</option>
            <option value="2019">2019</option>
            <option value="2020">2020</option>
            <option value="2021">2021</option>
          </select>
        </div>

        {/* Geographic Level Selector */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Geographic Level
          </label>
          <select
            value={geoLevel}
            onChange={handleGeoLevelChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue"
          >
            <option value="state">State</option>
            <option value="district">District</option>
          </select>
        </div>

        {/* Apply Layer Button */}
        <button className="w-full mt-5 px-4 py-2.5 bg-primary-blue text-white text-sm font-medium rounded-md hover:bg-blue-900 transition-colors duration-200">
          Apply Layer
        </button>
      </div>
    </div>
  )
}
