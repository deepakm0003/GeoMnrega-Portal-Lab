import React from 'react'

export default function DatasetCards() {
  const datasets = [
    {
      title: 'Geo-MNREGA Works',
      description: 'Spatial distribution of works executed under MNREGA across India.',
      coverage: '2006–2022',
      format: 'GeoJSON / CSV',
    },
    {
      title: 'MNREGA Asset Data',
      description: 'Asset-level geotagged infrastructure created under MNREGA.',
      coverage: 'District-level',
      format: 'CSV',
    },
    {
      title: 'LULC 250m Raster',
      description: 'Land Use Land Cover dataset for spatial analysis.',
      coverage: '2005–2020',
      format: 'GeoTIFF',
    },
  ]

  return (
    <div className="absolute top-24 w-full px-6 z-30">
      <div className="flex gap-4 overflow-x-auto pb-4">
        {datasets.map((dataset, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-80 bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            <h3 className="text-lg font-bold text-primary-blue mb-2">
              {dataset.title}
            </h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {dataset.description}
            </p>
            
            <div className="space-y-2 mb-4 text-xs text-gray-700">
              <div>
                <span className="font-semibold text-gray-800">Coverage:</span> {dataset.coverage}
              </div>
              <div>
                <span className="font-semibold text-gray-800">Format:</span> {dataset.format}
              </div>
            </div>

            <button className="w-full px-4 py-2 bg-soft-green text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors duration-200">
              Explore
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
