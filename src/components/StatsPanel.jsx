import React from 'react'

export default function StatsPanel({ totalStates = 28, averageValue = 4250, maxValue = 20100, minValue = 1800 }) {
  return (
    <div className="absolute top-24 right-6 z-40 bg-white rounded-lg shadow-lg p-6 w-72 border border-gray-200">
      <h3 className="text-sm font-bold text-primary-blue uppercase tracking-wide mb-4">
        Dataset Summary
      </h3>

      <div className="space-y-4">
        {/* Total Regions Covered */}
        <div className="border-b border-gray-100 pb-3">
          <p className="text-xs text-gray-600 font-medium uppercase tracking-wide mb-1">
            Regions Covered
          </p>
          <p className="text-2xl font-bold text-primary-blue">{totalStates}</p>
        </div>

        {/* Average Value */}
        <div className="border-b border-gray-100 pb-3">
          <p className="text-xs text-gray-600 font-medium uppercase tracking-wide mb-1">
            Average Works Count
          </p>
          <p className="text-2xl font-bold text-soft-green">{averageValue.toLocaleString()}</p>
        </div>

        {/* Highest Value */}
        <div className="border-b border-gray-100 pb-3">
          <p className="text-xs text-gray-600 font-medium uppercase tracking-wide mb-1">
            Highest Value Region
          </p>
          <p className="text-lg font-semibold text-gray-800">{maxValue.toLocaleString()}</p>
        </div>

        {/* Lowest Value */}
        <div className="border-b border-gray-100 pb-3">
          <p className="text-xs text-gray-600 font-medium uppercase tracking-wide mb-1">
            Lowest Value Region
          </p>
          <p className="text-lg font-semibold text-gray-800">{minValue.toLocaleString()}</p>
        </div>

        {/* Last Updated */}
        <div>
          <p className="text-xs text-gray-600 font-medium uppercase tracking-wide mb-1">
            Last Updated
          </p>
          <p className="text-sm font-medium text-gray-700">February 2024</p>
        </div>
      </div>
    </div>
  )
}
