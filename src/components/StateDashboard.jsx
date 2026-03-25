import React from 'react';
import { X, Lightbulb, Map as MapIcon, Download } from 'lucide-react';
import MiniMap from './MiniMap';
import indiaMicesDistrictData from '../data/mices/india_mices_districts.json';

export default function StateDashboard({ stateData, dataset, onClose, onExpand }) {
  if (!stateData) return null;

  const stateName = stateData.NAME_1 || 'Unknown State';
  
  // Format dataset name for display
  const formatDatasetName = (name) => {
    if (!name) return 'Data';
    if (name.startsWith('mices_')) {
      return name.replace('mices_', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    if (name === 'nices-cropland') return 'Annual Cropland';
    if (name === 'nices-forest-class') return 'Forest Class & Cover';
    return name;
  };

  const displayDatasetName = formatDatasetName(dataset);
  
  // Pluralize/Singularize for generic labels
  const shortName = displayDatasetName.split(' ').pop();
  const pluralName = shortName.endsWith('s') ? shortName : `${shortName}s`;

  // Get main value from dataset
  const mainValue = stateData[dataset] || 0;

  // Generate realistic-looking mock data based on the main value
  const mockMetrics = {
    total: mainValue,
    annualUse: (mainValue * 0.048).toFixed(1), // e.g. 5.2 billion
    avgLevel: (6.0 + Math.random() * 2).toFixed(1), // e.g. 6.3
    declineRate: (0.2 + Math.random() * 0.3).toFixed(2), // e.g. 0.35
    criticalPct: Math.floor(15 + Math.random() * 25)
  };

  // Calculate actual dynamic stats from districts
  const stateFeatures = indiaMicesDistrictData?.features?.filter(f => f.properties.NAME_1 === stateName) || [];
  let maxVal = 0;
  stateFeatures.forEach(f => {
     const val = f.properties[dataset];
     if (val && val > maxVal) maxVal = val;
  });
  if (maxVal === 0) maxVal = 100;

  const colors = dataset?.startsWith('mices_') ? 
        ['#f2f0f7', '#cbc9e2', '#9e9ac8', '#756bb1', '#54278f'] :
        ['#f7fbff', '#c6dbef', '#6baed6', '#2171b5', '#08306b'];

  const bins = [0, 0, 0, 0, 0];
  stateFeatures.forEach(f => {
     const val = f.properties[dataset] || 0;
     if (val <= maxVal * 0.1) bins[0]++;
     else if (val <= maxVal * 0.25) bins[1]++;
     else if (val <= maxVal * 0.5) bins[2]++;
     else if (val <= maxVal * 0.8) bins[3]++;
     else bins[4]++;
  });
  const maxBinCount = Math.max(...bins, 1);

  const thresholds = [
     0,
     Math.round(maxVal * 0.1),
     Math.round(maxVal * 0.25),
     Math.round(maxVal * 0.5),
     Math.round(maxVal * 0.8)
  ];

  return (
    <div 
      className="absolute bottom-[2%] left-6 right-6 z-50 flex gap-4 pointer-events-none font-sans transition-all duration-300 transform translate-y-0 opacity-100"
      style={{ animation: 'slideUpDashboard 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
    >
      
      {/* Absolute Close Button for the entire dashboard */}
      <button 
        onClick={onClose} 
        className="absolute -top-3 -right-2 bg-white hover:bg-red-50 hover:text-red-500 text-gray-500 p-2 rounded-full shadow-lg border border-gray-200 pointer-events-auto transition-all z-50 hover:scale-110 group focus:outline-none"
        title="Close Dashboard"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Left Panel: Overview and Insights */}
      <div className="w-[360px] text-gray-800 bg-white rounded-md shadow-2xl border border-gray-200 pointer-events-auto flex flex-col overflow-hidden shrink-0">
        
        {/* Header */}
        <div className="flex justify-between items-start pt-3 px-4 pb-2">
          <div className="flex-1">
            <h2 className="text-lg text-gray-900 leading-tight">
              <span className="font-bold">{stateName}</span> <span className="text-gray-600 font-medium text-sm">{displayDatasetName}</span>
            </h2>
          </div>
        </div>

        {/* Bullet Points */}
        <div className="px-4 py-2.5 text-xs text-gray-800 space-y-2 border-b border-gray-100 flex-1 bg-white">
          <div className="flex gap-1.5">
            <span className="text-gray-400 mt-1.5 w-1 h-1 rounded-full bg-current shrink-0"></span>
            <p>Total {pluralName}: {mockMetrics.total.toLocaleString()}</p>
          </div>
          <div className="flex gap-1.5">
            <span className="text-gray-400 mt-1.5 w-1 h-1 rounded-full bg-current shrink-0"></span>
            <p>Annual Use: <span className="font-semibold">{mockMetrics.annualUse} billion m³/yr</span></p>
          </div>
          <div className="flex gap-1.5">
            <span className="text-gray-400 mt-1.5 w-1 h-1 rounded-full bg-current shrink-0"></span>
            <p>Average GW Level: <span className="font-semibold">{mockMetrics.avgLevel} m bgl</span></p>
          </div>
          <div className="flex gap-1.5">
            <span className="text-gray-400 mt-1.5 w-1 h-1 rounded-full bg-current shrink-0"></span>
            <p>Decline Rate: <span className="font-semibold">{mockMetrics.declineRate} m/yr</span> (last 10 yrs)</p>
          </div>
        </div>

        {/* AI Insight Box */}
        <div className="bg-[#1a2b3c] text-white p-4 flex flex-col">
          <div className="flex items-center gap-1.5 mb-2.5 text-white">
            <Lightbulb className="w-3.5 h-3.5" />
            <h3 className="font-semibold text-sm">Policy Insight:</h3>
          </div>
          
          <div className="space-y-2 text-xs text-gray-300 leading-relaxed">
            <div className="flex items-start gap-1.5">
              <span className="w-1 h-1 rounded-full bg-gray-400 mt-1.5 shrink-0"></span>
              <p>For {stateName}, data supports targeted irrigation policies. Farmers should register usage and adopt conservation methods.</p>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="w-1 h-1 rounded-full bg-gray-400 mt-1.5 shrink-0"></span>
              <p>AI models disabled. Future versions will provide predictive data.</p>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-700 flex justify-between items-center gap-2">
            <p className="text-[10px] text-gray-400 leading-tight">AI Analytics Engine</p>
            <button className="flex items-center justify-center gap-1.5 bg-[#2d74b4] hover:bg-[#25639a] text-white px-3 py-1.5 rounded textxs font-semibold transition-colors">
              <Download className="w-3 h-3" />
              Report
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel: Metrics and Charts */}
      <div className="flex-1 flex flex-col gap-3 min-w-[500px] pointer-events-auto">
        
        {/* Top KPI Cards row */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-[#467ab2] text-white px-3 py-2.5 rounded shadow-sm border border-[#3b6796] flex flex-col">
            <p className="text-xl font-bold truncate" title={mockMetrics.total.toLocaleString()}>
              {mockMetrics.total.toLocaleString()}
            </p>
            <p className="text-[11px] opacity-90 font-medium tracking-wide truncate mt-0.5">Total {pluralName}</p>
          </div>
          <div className="bg-[#48a688] text-white px-3 py-2.5 rounded shadow-sm border border-[#3e8c73] flex flex-col">
            <p className="text-xl font-bold truncate" title={`${mockMetrics.annualUse} billion m³`}>
              {mockMetrics.annualUse} <span className="text-xs font-medium">billion m³</span>
            </p>
            <p className="text-[11px] opacity-90 font-medium tracking-wide text-white/90 truncate mt-0.5">Irrigation Water Use</p>
          </div>
          <div className="bg-[#d2b350] text-white px-3 py-2.5 rounded shadow-sm border border-[#b29743] flex flex-col">
            <p className="text-xl font-bold truncate" title={`${mockMetrics.avgLevel} m bgl`}>
              {mockMetrics.avgLevel} <span className="text-xs font-medium">m bgl</span>
            </p>
            <p className="text-[11px] text-white/90 font-medium tracking-wide truncate mt-0.5">Average GW Level</p>
          </div>
          <div className="bg-[#c85458] text-white px-3 py-2.5 rounded shadow-sm border border-[#a84649] flex flex-col">
            <p className="text-xl font-bold truncate" title={`${mockMetrics.declineRate} m/year`}>
              {mockMetrics.declineRate} <span className="text-xs font-medium">m/year</span>
            </p>
            <p className="text-[11px] text-white/90 font-medium tracking-wide truncate mt-0.5">GW Decline Rate</p>
          </div>
        </div>

        {/* Middle Map/Chart Card */}
        <div className="bg-white rounded shadow-xl border border-gray-200 p-4 flex flex-col flex-1 h-full min-h-[220px]">
          <div className="flex justify-between items-baseline mb-1 shrink-0">
            <h3 className="font-bold text-gray-900 text-sm">Groundwater Level Map</h3>
            <p className="text-[11px] text-gray-500">Districts w/ Critical Status: <span className="text-[#c85458] font-bold">{mockMetrics.criticalPct}%</span></p>
          </div>
          
          <div className="flex-1 flex items-center justify-between">
            {/* Legend */}
            <div className="w-[110px] flex flex-col gap-2 text-[10px] text-gray-600 justify-center shrink-0 mix-blend-multiply pr-1">
              <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 rounded-sm shrink-0 border border-black/10" style={{backgroundColor: colors[0]}}></div><span className="truncate">{thresholds[0]} - {thresholds[1]}</span></div>
              <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 rounded-sm shrink-0 border border-black/10" style={{backgroundColor: colors[1]}}></div><span className="truncate">{thresholds[1]} - {thresholds[2]}</span></div>
              <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 rounded-sm shrink-0 border border-black/10" style={{backgroundColor: colors[2]}}></div><span className="truncate">{thresholds[2]} - {thresholds[3]}</span></div>
              <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 rounded-sm shrink-0 border border-black/10" style={{backgroundColor: colors[3]}}></div><span className="truncate">{thresholds[3]} - {thresholds[4]}</span></div>
              <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 rounded-sm shrink-0 border border-black/10" style={{backgroundColor: colors[4]}}></div><span className="truncate">{thresholds[4]}+</span></div>
            </div>
            
            <div className="flex-1 h-full min-h-[160px] relative overflow-hidden mix-blend-multiply z-10 mx-[-20px] pointer-events-auto group/map">
               <MiniMap stateName={stateName} dataset={dataset} />
               
               {/* Map Action Button Overlay */}
               <div className="absolute top-2 right-4 opacity-0 group-hover/map:opacity-100 transition-opacity duration-200 z-50">
                 <button 
                    onClick={onExpand}
                    className="flex items-center gap-1.5 bg-white/95 hover:bg-white text-[#2d74b4] border border-[#2d74b4]/20 px-3 py-1.5 rounded-sm shadow-sm text-xs font-semibold backdrop-blur-sm"
                 >
                    <MapIcon className="w-3.5 h-3.5" />
                    Expand Region
                 </button>
               </div>
            </div>

            {/* Dynamic Chart on Right */}
            <div className="w-[140px] border-l border-gray-100 pl-6 pr-4 py-1 flex items-end gap-2 justify-center h-[130px] shrink-0 self-center">
              <div className="group relative w-6 rounded-t-sm transition-all duration-300 hover:opacity-80 border border-black/10 border-b-0 cursor-pointer" style={{backgroundColor: colors[0], height: `${Math.max(2, (bins[0]/maxBinCount)*100)}%`}}>
                 <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded shadow z-50 whitespace-nowrap">{bins[0]} districts</div>
              </div>
              <div className="group relative w-6 rounded-t-sm transition-all duration-300 hover:opacity-80 border border-black/10 border-b-0 cursor-pointer" style={{backgroundColor: colors[1], height: `${Math.max(2, (bins[1]/maxBinCount)*100)}%`}}>
                 <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded shadow z-50 whitespace-nowrap">{bins[1]} districts</div>
              </div>
              <div className="group relative w-6 rounded-t-sm transition-all duration-300 hover:opacity-80 border border-black/10 border-b-0 cursor-pointer" style={{backgroundColor: colors[2], height: `${Math.max(2, (bins[2]/maxBinCount)*100)}%`}}>
                 <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded shadow z-50 whitespace-nowrap">{bins[2]} districts</div>
              </div>
              <div className="group relative w-6 rounded-t-sm transition-all duration-300 hover:opacity-80 border border-black/10 border-b-0 cursor-pointer" style={{backgroundColor: colors[3], height: `${Math.max(2, (bins[3]/maxBinCount)*100)}%`}}>
                 <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded shadow z-50 whitespace-nowrap">{bins[3]} districts</div>
              </div>
              <div className="group relative w-6 rounded-t-sm transition-all duration-300 hover:opacity-80 border border-black/10 border-b-0 cursor-pointer" style={{backgroundColor: colors[4], height: `${Math.max(2, (bins[4]/maxBinCount)*100)}%`}}>
                 <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded shadow z-50 whitespace-nowrap">{bins[4]} districts</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
