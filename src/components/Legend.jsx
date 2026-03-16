import React, { useState, useEffect } from 'react'
import indiaMicesData from '../data/india_mices.json'

export default function Legend({ dataset }) {
  if (!dataset) return null;

  let title = "Index Value"
  let labels = ['-0.6', '-0.4', '-0.2', '0', '0.2', '0.4', '0.6+']
  let gradientClass = "bg-gradient-to-r from-red-400 via-[#f4ebd0] to-teal-500"
  
  if (dataset.startsWith('mices_')) {
     title = dataset.replace('mices_', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) + " Count"
     
     let maxVal = 0;
     indiaMicesData.features.forEach(f => {
       const val = f.properties[dataset];
       if (val && val > maxVal) maxVal = val;
     });
     if (maxVal === 0) maxVal = 100;
     
     labels = [0, Math.round(maxVal * 0.2), Math.round(maxVal * 0.4), Math.round(maxVal * 0.6), Math.round(maxVal * 0.8), maxVal];
     
     // '#f2f0f7' to '#54278f'
     gradientClass = "bg-gradient-to-r from-[#f2f0f7] via-[#9e9ac8] to-[#54278f]"
  } else if (dataset === 'nices-cropland') {
     title = "Annual Cropland Classes"
     labels = ["Kharif", "Double", "Rabi", "Zaid"]
     gradientClass = "bg-gradient-to-r from-[#9ecf1f] via-[#ffd100] to-[#ff9e00]" // Kharif, Rabi, Zaid approx
  } else if (dataset === 'nices-forest-class') {
     title = "Forest Classes"
     labels = ["Dark Forest", "Shrub/Light"]
     gradientClass = "bg-gradient-to-r from-[#005e00] to-[#73b82b]"
  }

  return (
    <div className="absolute bottom-6 right-6 z-40 bg-white/95 rounded shadow-lg px-4 py-3 border border-gray-200">
      <div className="flex flex-col items-center">
        {/* Gradient Bar */}
        <div className={`w-64 h-5 rounded shadow-inner flex mb-2 ${gradientClass}`}>
        </div>
        
        {/* Ticks and Labels */}
        <div className="w-full flex justify-between text-[10px] text-gray-500 font-medium px-1">
          {labels.map((lbl, i) => (
             <span key={i}>{lbl}</span>
          ))}
        </div>
        
        <p className="text-xs text-gray-800 font-bold mt-1">{title}</p>
      </div>
    </div>
  )
}
