import React from 'react';
import indiaMicesDistrictData from '../data/mices/india_mices_districts.json';

export default function Legend({ dataset }) {
  if (!dataset) return null;

  let title = "Index Value"
  let labels = ['-0.6', '-0.4', '-0.2', '0', '0.2', '0.4', '0.6+']
  let gradientClass = "bg-gradient-to-r from-red-400 via-[#f4ebd0] to-teal-500"
  
  if (dataset.startsWith('mices_') || dataset.startsWith('nrega_')) {
     title = dataset.replace('mices_', '').replace('nrega_', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
     if (dataset.startsWith('mices_')) title += " Count";
     
     let maxVal = 0;
     indiaMicesDistrictData.features.forEach(f => {
       const val = f.properties[dataset];
       if (val && val > maxVal) maxVal = val;
     });
     if (maxVal === 0) maxVal = 100;
     
     labels = [0, Math.round(maxVal * 0.2).toLocaleString(), Math.round(maxVal * 0.4).toLocaleString(), Math.round(maxVal * 0.6).toLocaleString(), Math.round(maxVal * 0.8).toLocaleString(), Math.round(maxVal).toLocaleString()];
     
     if (dataset.startsWith('mices_')) {
        gradientClass = "bg-gradient-to-r from-[#f2f0f7] via-[#9e9ac8] to-[#54278f]";
     } else if (dataset.startsWith('nrega_demand')) {
        gradientClass = "bg-gradient-to-r from-[#fff5eb] via-[#fd8d3c] to-[#8c2d04]";
     } else if (dataset.startsWith('nrega_')) {
        gradientClass = "bg-gradient-to-r from-[#f7fcf5] via-[#74c476] to-[#00441b]";
     }
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
