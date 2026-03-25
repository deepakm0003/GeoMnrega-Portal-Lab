import React, { useState } from 'react'
import Home from './pages/Home'
import StateReport from './pages/StateReport'
import UseCaseReport from './pages/UseCaseReport'

function App() {
  const [reportState, setReportState] = useState(null)
  const [reportDataset, setReportDataset] = useState(null)
  const [useCaseDataset, setUseCaseDataset] = useState(null)

  const handleOpenReport = (stateData, dataset) => {
    setReportState(stateData)
    setReportDataset(dataset)
  }

  const handleCloseReport = () => {
    setReportState(null)
  }

  const isHidden = reportState || useCaseDataset;

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Hide the Home page visully instead of unmounting/display:none to preserve map render cache and prevent resize glitches */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${isHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <Home 
          onOpenReport={handleOpenReport} 
          onOpenUseCase={(datasetId) => setUseCaseDataset(datasetId)}
        />
      </div>

      {/* Render the State Report over it when active */}
      {reportState && (
        <div className="absolute inset-0 z-40 bg-white">
          <StateReport 
            stateData={reportState} 
            dataset={reportDataset} 
            onBack={handleCloseReport} 
          />
        </div>
      )}

      {/* Render the Use Case Report over it when active */}
      {useCaseDataset && (
        <div className="absolute inset-0 z-50 bg-white">
          <UseCaseReport 
            datasetId={useCaseDataset} 
            onBack={() => setUseCaseDataset(null)} 
          />
        </div>
      )}
    </div>
  )
}

export default App
