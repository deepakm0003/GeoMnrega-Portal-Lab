import React, { useState } from 'react';
import { HelpCircle, Download, FileText, Map as MapIcon, Image as ImageIcon, Info, Database } from 'lucide-react';

export default function Sidebar({ dataset, setDataset, year, setYear }) {
  const [activeCategory, setActiveCategory] = useState('mnrega');

  const categories = [
    {
      id: 'mgnrega-ponds',
      name: 'MGNREGA Farm Ponds',
      variables: [
        { id: 'bhuvan-ponds', name: 'Farm Ponds (Bhuvan Portal)' }
      ]
    },
    {
      id: 'climate-environment',
      name: 'Climate & Environment',
      variables: [
        { id: 'era5-evaporation', name: 'Evaporation' },
        { id: 'era5-precipitation', name: 'Total Precipitation' },
        { id: 'era5-soil-temp-1', name: 'Soil Temperature (Level 1)' },
        { id: 'era5-soil-temp-4', name: 'Soil Temperature (Level 4)' }
      ]
    },
    {
      id: 'rural-infra',
      name: 'Rural Infrastructure (PMGSY)',
      variables: [
        { id: 'pmgsy-facilities', name: 'Facilities' },
        { id: 'pmgsy-habitation', name: 'Habitation' },
        { id: 'pmgsy-roads', name: 'Roads (Candidates / DRRP)' },
        { id: 'pmgsy-tourist', name: 'Tourist Places' }
      ]
    },
    {
      id: 'admin-boundaries',
      name: 'Administrative Boundaries',
      variables: [
        { id: 'gramchitra-gp', name: 'Gram Panchayat Boundaries' },
        { id: 'ind-subdistrict', name: 'Subdistrict Boundaries' },
        { id: 'ind-district', name: 'District Boundaries' }
      ]
    },
    {
      id: 'water-infra',
      name: 'Water Infrastructure (MICES)',
      variables: [
        { id: 'mices_dugwell', name: 'Dugwell Schemes' },
        { id: 'mices_shallow_tubewell', name: 'Shallow Tubewell Schemes' },
        { id: 'mices_medium_tubewell', name: 'Medium Tubewell Schemes' },
        { id: 'mices_deep_tubewell', name: 'Deep Tubewell Schemes' },
        { id: 'mices_surface_flow_scheme', name: 'Surface Flow Schemes' },
        { id: 'mices_surface_lift_scheme', name: 'Surface Lift Schemes' },
        { id: 'mices_total_water_scheme', name: 'Total Water Schemes' }
      ]
    },
    {
      id: 'land-use',
      name: 'Land Use & Environment (NICES)',
      variables: [
        { id: 'nices-cropland', name: 'Annual Cropland' },
        { id: 'nices-forest-class', name: 'Forest Class & Cover' },
        { id: 'nices-soil-carbon', name: 'Soil Carbon Content' },
        { id: 'nices-soil-moisture', name: 'Soil Moisture & Depth' }
      ]
    }
  ];

  return (
    <div className="w-[380px] h-screen flex flex-col bg-[#1a2b3c] text-white shadow-xl z-20 flex-shrink-0">
      {/* Top Navigation Wrapper (mimics SHRUG top nav) */}
      <div className="bg-[#f8f9fa] text-[#1a2b3c] flex flex-col border-b border-gray-300">
        <div className="p-4 flex items-center gap-2 border-b border-gray-200">
          <MapIcon className="w-6 h-6 text-[#007bff]" />
          <h1 className="text-xl font-bold tracking-tight">GeoMNREGA Research Portal</h1>
        </div>
        <div className="flex px-4 py-2 gap-4 text-sm font-medium">
          <a href="#" className="hover:text-[#007bff] transition-colors">About</a>
          <a href="#" className="hover:text-[#007bff] transition-colors">FAQ</a>
          <a href="#" className="hover:text-[#007bff] transition-colors">Download</a>
          <a href="#" className="hover:text-[#007bff] transition-colors">Docs</a>
        </div>
      </div>

      {/* Accordion Control Panel */}
      <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
        {categories.map((category) => (
          <div key={category.id} className="border-b border-gray-700">
            <button
              onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
              className="w-full text-left p-4 hover:bg-gray-800 transition-colors flex justify-between items-center"
            >
              <span className="font-semibold text-sm">{category.name}</span>
              <span className="text-gray-400 text-xl font-light">
                {activeCategory === category.id ? '−' : '+'}
              </span>
            </button>
            
            {activeCategory === category.id && (
              <div className="bg-gray-900 overflow-hidden">
                {category.variables.map((variable) => (
                  <button
                    key={variable.id}
                    onClick={() => setDataset(variable.id)}
                    className={`w-full text-left px-5 py-3 text-sm flex justify-between items-center transition-colors ${
                      dataset === variable.id 
                        ? 'bg-[#e1f5fe] text-[#007bff] font-bold border-l-4 border-[#007bff]' 
                        : 'text-gray-300 hover:bg-gray-800 border-l-4 border-transparent'
                    }`}
                  >
                    <span>{variable.name}</span>
                    <Info className="w-4 h-4 text-gray-500 hover:text-[#007bff]" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Year Selector removed as per requirements */}
      </div>

      {/* Footer Utility Bar */}
      <div className="bg-[#aee6e6] text-[#1a2b3c] py-3 px-2 flex justify-evenly items-center text-xs font-semibold">
        <button className="flex flex-col items-center gap-1 hover:text-[#007bff] transition-colors flex-1 text-center">
          <Database className="w-5 h-5" />
          <span>Data Sources</span>
        </button>
        <button className="flex flex-col items-center gap-1 hover:text-[#007bff] transition-colors flex-1 text-center">
          <FileText className="w-5 h-5" />
          <span>Methodology</span>
        </button>
        <button className="flex flex-col items-center gap-1 hover:text-[#007bff] transition-colors flex-1 text-center">
          <Download className="w-5 h-5" />
          <span>Export Data</span>
        </button>
      </div>
    </div>
  );
}
