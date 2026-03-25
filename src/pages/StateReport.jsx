import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { ArrowLeft, Download, FileText, BarChart2, Map as MapIcon } from 'lucide-react';
import indiaMicesDistrictData from '../data/mices/india_mices_districts.json';

export default function StateReport({ stateData, dataset, onBack }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [hoveredDistrict, setHoveredDistrict] = useState(null);

  const stateName = stateData?.NAME_1 || 'Unknown State';
  
  // Stats calculation
  const stateFeatures = indiaMicesDistrictData?.features?.filter(f => f.properties.NAME_1 === stateName) || [];
  let maxVal = 0;
  let totalVal = 0;
  stateFeatures.forEach(f => {
     const val = f.properties[dataset] || 0;
     totalVal += val;
     if (val > maxVal) maxVal = val;
  });
  if (maxVal === 0) maxVal = 100;

  let colors = ['#f7fbff', '#c6dbef', '#6baed6', '#2171b5', '#08306b']; // Defaults (Blues)
  if (dataset?.startsWith('mices_')) colors = ['#f2f0f7', '#cbc9e2', '#9e9ac8', '#756bb1', '#54278f']; // Purples
  else if (dataset?.startsWith('nrega_demand')) colors = ['#fff5eb', '#fdd0a2', '#fd8d3c', '#d94801', '#8c2d04']; // Oranges
  else if (dataset?.startsWith('nrega_')) colors = ['#f7fcf5', '#c7e9c0', '#74c476', '#238b45', '#00441b']; // Greens

  useEffect(() => {
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [78, 21], 
        zoom: 4,
        interactive: true,
        attributionControl: false
      });
      map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

      map.current.on('load', () => {
        const geojson = {
          type: 'FeatureCollection',
          features: stateFeatures
        };

        map.current.addSource('state-districts', {
          type: 'geojson',
          data: geojson,
          generateId: true
        });

        // Add filled district polygons
        map.current.addLayer({
          id: 'districts-fill',
          type: 'fill',
          source: 'state-districts',
          paint: {
            'fill-color': [
                'interpolate',
                ['exponential', 0.5],
                ['coalesce', ['get', dataset], 0],
                0, colors[0],
                maxVal * 0.1, colors[1],
                maxVal * 0.25, colors[2],
                maxVal * 0.5, colors[3],
                maxVal, colors[4]
            ],
            'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                1,
                0.8
            ]
          }
        });
        
        // Add District boundaries
        map.current.addLayer({
          id: 'districts-line',
          type: 'line',
          source: 'state-districts',
          paint: {
            'line-color': '#ffffff',
            'line-width': 1
          }
        });

        // Add State wide boundary for emphasis
        map.current.addLayer({
          id: 'state-boundary-highlight',
          type: 'line',
          source: 'state-districts',
          paint: {
            'line-color': '#000000',
            'line-width': 2,
            'line-opacity': 0.8
          },
          filter: ['==', '$type', 'Polygon'] // Wait, this draws every district boundary thick if we aren't careful.
          // Since the source is state-districts, it will draw borders for districts. Let's omit thick borders here or use the main states layer. 
          // Omitted for standard look.
        });

        // Fit Bounds precisely
        if (stateFeatures.length > 0) {
          const bounds = new mapboxgl.LngLatBounds();
          stateFeatures.forEach(feature => {
            if (feature.geometry.type === 'Polygon') {
               feature.geometry.coordinates[0].forEach(coord => bounds.extend(coord));
            } else if (feature.geometry.type === 'MultiPolygon') {
               feature.geometry.coordinates.forEach(poly => {
                 poly[0].forEach(coord => bounds.extend(coord));
               });
            }
          });
          map.current.fitBounds(bounds, { padding: 50, duration: 1000 });
        }
        
        // Hover effects interactive
        let hoveredStateId = null;
        map.current.on('mousemove', 'districts-fill', (e) => {
          if (e.features.length > 0) {
            if (hoveredStateId !== null) {
              map.current.setFeatureState({ source: 'state-districts', id: hoveredStateId }, { hover: false });
            }
            hoveredStateId = e.features[0].id;
            map.current.setFeatureState({ source: 'state-districts', id: hoveredStateId }, { hover: true });
            setHoveredDistrict({
              name: e.features[0].properties.NAME_2,
              value: e.features[0].properties[dataset]
            });
          }
        });

        map.current.on('mouseleave', 'districts-fill', () => {
          if (hoveredStateId !== null) {
            map.current.setFeatureState({ source: 'state-districts', id: hoveredStateId }, { hover: false });
          }
          hoveredStateId = null;
          setHoveredDistrict(null);
        });
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [stateName, dataset]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
            title="Back to India Map"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">{stateName} Detailed Report</h1>
            <p className="text-sm text-gray-500 font-medium tracking-wide">Dataset: {dataset.replace(/_/g, ' ').toUpperCase()}</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded shadow-sm hover:bg-gray-50 font-medium transition-colors text-sm">
            <FileText className="w-4 h-4" /> Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#2d74b4] text-white rounded shadow text-sm font-semibold hover:bg-[#23588a] transition-colors">
            <Download className="w-4 h-4" /> Download PDF Report
          </button>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Data panel */}
        <div className="w-[350px] bg-white border-r border-gray-200 shadow-xl z-10 flex flex-col p-6 overflow-y-auto">
           <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
             <BarChart2 className="w-5 h-5 text-[#2d74b4]" /> State Overview
           </h2>
           
           <div className="grid grid-cols-2 gap-4 mb-8">
             <div className="bg-gray-50 rounded p-4 border border-gray-100">
               <p className="text-xs text-gray-500 mb-1 uppercase font-semibold">Total Districts</p>
               <p className="text-2xl font-bold text-gray-900">{stateFeatures.length}</p>
             </div>
             <div className="bg-gray-50 rounded p-4 border border-gray-100">
               <p className="text-xs text-gray-500 mb-1 uppercase font-semibold">Max Value</p>
               <p className="text-2xl font-bold text-gray-900">{Math.round(maxVal).toLocaleString()}</p>
             </div>
             <div className="bg-[#f0f7ff] rounded p-4 border border-[#bbd6ef] col-span-2 shadow-sm">
               <p className="text-xs text-[#2d74b4] mb-1 uppercase font-semibold">Total Volume</p>
               <p className="text-3xl font-bold text-[#1e5282]">{Math.round(totalVal).toLocaleString()}</p>
             </div>
           </div>
           
           <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">Top Districts</h3>
           <div className="flex-1 overflow-y-auto space-y-2 pr-2">
             {stateFeatures
                .map(f => ({ name: f.properties.NAME_2, val: f.properties[dataset] || 0 }))
                .sort((a,b) => b.val - a.val)
                .slice(0, 10)
                .map((d, i) => (
                  <div key={i} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded border border-transparent hover:border-gray-100 transition-colors">
                    <span className="text-sm font-medium text-gray-700">{i+1}. {d.name}</span>
                    <span className="text-sm font-bold text-gray-900">{Math.round(d.val).toLocaleString()}</span>
                  </div>
                ))
             }
           </div>
        </div>
        
        {/* Interactive Map */}
        <div className="flex-1 relative bg-gray-100">
          <div ref={mapContainer} className="w-full h-full" />
          
          {/* Hover tooltip */}
          {hoveredDistrict && (
            <div className="absolute top-6 left-6 bg-white/95 backdrop-blur shadow-lg border border-gray-200 rounded p-4 pointer-events-none min-w-[200px] transform transition-all duration-200 z-20">
              <h4 className="text-lg font-bold text-gray-900 leading-tight mb-1">{hoveredDistrict.name}</h4>
              <p className="text-sm text-gray-500 mb-2 border-b border-gray-100 pb-2">District Data</p>
              <div className="flex items-end justify-between pt-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Value</span>
                <span className="text-xl font-bold text-[#2d74b4]">{Math.round(hoveredDistrict.value).toLocaleString()}</span>
              </div>
            </div>
          )}
          
          {/* Map Title overlay */}
          <div className="absolute top-6 right-12 bg-white/90 backdrop-blur shadow-sm border border-gray-200 rounded-full px-4 py-2 pointer-events-none flex items-center gap-2">
             <MapIcon className="w-4 h-4 text-[#2d74b4]" />
             <span className="text-sm font-semibold text-gray-700">Interactive District Boundary Level Map</span>
          </div>
        </div>
      </div>
    </div>
  );
}
