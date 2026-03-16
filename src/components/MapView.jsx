import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import indiaMicesData from '../data/india_mices.json'
import indiaMicesDistrictData from '../data/india_mices_districts.json'
import { getMnregaDataByYear } from '../data/mockData'

// Set your Mapbox access token here
// Get free token at: https://account.mapbox.com/auth/signin/

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
export default function MapView({ dataset, year }) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [tooltip, setTooltip] = useState(null)
  const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/streets-v12')
  const currentStyleRef = useRef(mapStyle)
  const [styleLoadedTrigger, setStyleLoadedTrigger] = useState(0)

  useEffect(() => {
    if (map.current) return // Initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [78, 21],
      zoom: 4.5,
      pitch: 0,
      bearing: 0,
    })

    // Event listeners are bound here once
    
    // Click to zoom into state
    map.current.on('click', 'states-fill', (e) => {
       map.current.flyTo({
          center: e.lngLat,
          zoom: 6.2,
          essential: true
       })
    })
        
        let hoveredStateId = null;
        let hoveredDistId = null;
        
        map.current.on('mousemove', 'states-fill', (e) => {
          if (e.features.length > 0) {
            if (hoveredStateId !== null) {
              map.current.setFeatureState({ source: 'states', id: hoveredStateId }, { hover: false });
            }
            hoveredStateId = e.features[0].id;
            map.current.setFeatureState({ source: 'states', id: hoveredStateId }, { hover: true });
            
            const feature = e.features[0]
            setTooltip({
              x: e.point.x,
              y: e.point.y,
              data: feature.properties
            })
          }
        })
        
        map.current.on('mouseleave', 'states-fill', () => {
          if (hoveredStateId !== null) {
            map.current.setFeatureState({ source: 'states', id: hoveredStateId }, { hover: false });
          }
          hoveredStateId = null;
          setTooltip(null)
        })
        
        map.current.on('mousemove', 'districts-fill', (e) => {
          if (e.features.length > 0) {
            if (hoveredDistId !== null) {
              map.current.setFeatureState({ source: 'districts', id: hoveredDistId }, { hover: false });
            }
            hoveredDistId = e.features[0].id;
            map.current.setFeatureState({ source: 'districts', id: hoveredDistId }, { hover: true });

            const feature = e.features[0]
            setTooltip({
              x: e.point.x,
              y: e.point.y,
              data: feature.properties,
              isDistrict: true
            })
          }
        })
        
        map.current.on('mouseleave', 'districts-fill', () => {
          if (hoveredDistId !== null) {
            map.current.setFeatureState({ source: 'districts', id: hoveredDistId }, { hover: false });
          }
          hoveredDistId = null;
          setTooltip(null)
        })
        
    // We update the style trigger ONLY when the map is fully idle and all sources/layers are parsed
    // This fixes the bug where applying colors too early during a style switch gets wiped by WebGL
    map.current.on('idle', () => {
      if (map.current && map.current.isStyleLoaded()) {
         // Safe to apply dataset stylings
         setStyleLoadedTrigger(prev => prev + 1);
      }
    })

    return () => {
      // Cleanup is handled by Mapbox
    }
  }, []) // Empty dependency array, initializes once

  // Update map style when mapStyle state changes
  useEffect(() => {
    if (!map.current) return
        
    if (currentStyleRef.current !== mapStyle) {
       currentStyleRef.current = mapStyle;
       map.current.setStyle(mapStyle)
    }
  }, [mapStyle])

  // Update data when dataset or year changes
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return

    // Ensure all vector sources reliably exist
    if (!map.current.getSource('states')) {
      map.current.addSource('states', { type: 'geojson', data: indiaMicesData, generateId: true });
    }
    if (!map.current.getSource('districts')) {
      map.current.addSource('districts', { type: 'geojson', data: indiaMicesDistrictData, generateId: true });
    }
    
    // Ensure boundary outline layers reliably exist
    if (!map.current.getLayer('states-line')) {
      map.current.addLayer({
        id: 'states-line',
        type: 'line',
        source: 'states',
        maxzoom: 5.5,
        paint: {
          'line-color': '#000000',
          'line-width': ['case', ['boolean', ['feature-state', 'hover'], false], 2, 0.5],
          'line-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.3]
        }
      });
    }
    if (!map.current.getLayer('districts-line')) {
      map.current.addLayer({
        id: 'districts-line',
        type: 'line',
        source: 'districts',
        minzoom: 5.5,
        paint: {
          'line-color': '#000000',
          'line-width': ['case', ['boolean', ['feature-state', 'hover'], false], 2, 0.2],
          'line-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.2]
        }
      });
    }

    const isNicesDataset = dataset === 'nices-cropland' || dataset === 'nices-forest'
    const isMicesDataset = dataset?.startsWith('mices_')

    // Handle NICES Raster Tiles
    if (isNicesDataset) {
      if (map.current.getLayer('lulc-layer')) map.current.removeLayer('lulc-layer')
      if (map.current.getSource('lulc-tif')) map.current.removeSource('lulc-tif')

      map.current.addSource('lulc-tif', {
        type: 'raster',
        tiles: [`http://localhost:8000/tiles/{z}/{x}/{y}.png?dataset=${dataset}`],
        tileSize: 256
      })
      map.current.addLayer({
        id: 'lulc-layer',
        type: 'raster',
        source: 'lulc-tif',
        paint: { 'raster-opacity': 0.8 }
      })
      map.current.flyTo({ center: [78, 21], zoom: 4.5 })
    } else {
      if (map.current.getLayer('lulc-layer')) map.current.removeLayer('lulc-layer')
      if (map.current.getSource('lulc-tif')) map.current.removeSource('lulc-tif')
    }

    // Handle MICES Vector Choropleth
    if (isMicesDataset) {
      // Find max state value
      let maxStateVal = 0;
      indiaMicesData.features.forEach(f => {
         const val = f.properties[dataset];
         if (val && val > maxStateVal) maxStateVal = val;
      });
      if (maxStateVal === 0) maxStateVal = 100;
      
      // Find max district value
      let maxDistVal = 0;
      indiaMicesDistrictData.features.forEach(f => {
         const val = f.properties[dataset];
         if (val && val > maxDistVal) maxDistVal = val;
      });
      if (maxDistVal === 0) maxDistVal = 100;
      
      if (map.current.getLayer('states-fill')) {
         map.current.removeLayer('states-fill');
      }
      if (map.current.getSource('states')) {
         map.current.addLayer({
            id: 'states-fill',
            type: 'fill',
            source: 'states',
            maxzoom: 5.5,
            paint: {
              'fill-color': [
                  'interpolate',
                  ['exponential', 0.5],
                  ['coalesce', ['get', dataset], 0],
                  0, '#f2f0f7',
                  maxStateVal * 0.1, '#cbc9e2',
                  maxStateVal * 0.25, '#9e9ac8',
                  maxStateVal * 0.5, '#756bb1',
                  maxStateVal, '#54278f'
              ],
              'fill-opacity': 0.8,
              'fill-outline-color': 'rgba(0,0,0,0)'
            }
         }, map.current.getLayer('states-line') ? 'states-line' : undefined);
      }
      
      if (map.current.getLayer('districts-fill')) {
         map.current.removeLayer('districts-fill');
      }
      if (map.current.getSource('districts')) {
         map.current.addLayer({
            id: 'districts-fill',
            type: 'fill',
            source: 'districts',
            minzoom: 5.5,
            paint: {
              'fill-color': [
                  'interpolate',
                  ['exponential', 0.5],
                  ['coalesce', ['get', dataset], 0],
                  0, '#f2f0f7',
                  maxDistVal * 0.1, '#cbc9e2',
                  maxDistVal * 0.25, '#9e9ac8',
                  maxDistVal * 0.5, '#756bb1',
                  maxDistVal, '#54278f'
              ],
              'fill-opacity': 0.8,
              'fill-outline-color': 'rgba(0,0,0,0)'
            }
         }, map.current.getLayer('districts-line') ? 'districts-line' : undefined);
      }
      
    } else {
       if (map.current.getLayer('states-fill')) {
          map.current.setPaintProperty('states-fill', 'fill-opacity', 0);
       }
       if (map.current.getLayer('districts-fill')) {
          map.current.setPaintProperty('districts-fill', 'fill-opacity', 0);
       }
    }
  }, [year, dataset, styleLoadedTrigger])

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (e) => {
    const query = e.target.value
    setSearchQuery(query)

    if (!query.trim()) {
      setSearchResults([])
      return
    }

    try {
      setIsSearching(true)
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${mapboxgl.accessToken}&limit=5`
      )
      const data = await res.json()
      setSearchResults(data.features || [])
    } catch (err) {
      console.error('Error fetching geocoding results:', err)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelectLocation = (feature) => {
    const [lng, lat] = feature.center
    if (map.current) {
      map.current.flyTo({
        center: [lng, lat],
        zoom: 10,
        essential: true // this animation is considered essential with respect to prefers-reduced-motion
      })
    }
    setSearchQuery(feature.place_name)
    setSearchResults([]) // hide dropdown
  }

  return (
    <div className="relative w-full h-full">
      {/* Top Center Search Bar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-96 font-sans">
        <div className="bg-white rounded-md shadow-md flex items-center px-3 py-2 border border-gray-100">
          <svg className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search Location Worldwide..." 
            value={searchQuery}
            onChange={handleSearch}
            className="w-full bg-transparent outline-none text-sm text-gray-800"
          />
          {isSearching && (
            <div className="w-4 h-4 border-2 border-gray-300 border-t-[#007bff] rounded-full animate-spin ml-2"></div>
          )}
        </div>
        
        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute top-full mt-1 w-full bg-white rounded-md shadow-lg border border-gray-100 overflow-hidden max-h-60 overflow-y-auto">
            {searchResults.map((result) => (
              <button
                key={result.id}
                onClick={() => handleSelectLocation(result)}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-50 last:border-0 text-sm transition-colors"
              >
                <p className="font-medium text-gray-800 truncate">{result.text}</p>
                <p className="text-xs text-gray-500 truncate">{result.place_name}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Top Right Map Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button 
          onClick={() => setMapStyle('mapbox://styles/mapbox/satellite-streets-v12')}
          className={`p-2 text-xl rounded shadow transition-colors ${mapStyle === 'mapbox://styles/mapbox/satellite-streets-v12' ? 'bg-[#007bff] text-white opacity-90' : 'bg-white hover:bg-gray-50'}`} 
          title="Satellite View"
        >
          🛰️
        </button>
        <button 
          onClick={() => setMapStyle('mapbox://styles/mapbox/streets-v12')}
          className={`p-2 text-xl rounded shadow transition-colors ${mapStyle === 'mapbox://styles/mapbox/streets-v12' ? 'bg-[#007bff] text-white opacity-90' : 'bg-white hover:bg-gray-50'}`} 
          title="Street/Choropleth View"
        >
          🗺️
        </button>
      </div>

      {/* Dataset Info Overlay */}
      {(dataset === 'nices-cropland' || dataset === 'nices-forest') && (
        <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur rounded shadow-md border border-gray-200 p-3">
          <p className="text-sm font-semibold text-gray-800">
            LULC: {dataset === 'nices-cropland' ? 'Annual Cropland' : 'Forest Class & Cover'}
          </p>
          <p className="text-xs text-gray-600 font-medium mt-1">
            <span className="text-gray-400 mr-2">📅 Year of Mapping:</span>
            <span className="bg-[#e1f5fe] text-[#007bff] px-2 py-0.5 rounded font-bold">2022</span>
          </p>
        </div>
      )}
      {dataset?.startsWith('mices_') && (
        <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur rounded shadow-md border border-gray-200 p-3 max-w-sm">
          <p className="text-sm font-semibold text-gray-800">
            MICES: Water Infrastructure
          </p>
          <p className="text-xs text-gray-600 font-medium mt-1">
            <span className="text-gray-400 mr-2">📅 Edition:</span>
            <span className="bg-[#e1f5fe] text-[#007bff] px-2 py-0.5 rounded font-bold">5th Census</span>
          </p>
        </div>
      )}

      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Tooltip */}
      {tooltip && tooltip.data && (
        <div
          className="fixed bg-white rounded shadow-lg px-3 py-2 z-50 pointer-events-none text-sm border border-gray-100"
          style={{
            left: `${tooltip.x + 15}px`,
            top: `${tooltip.y + 15}px`,
          }}
        >
          {tooltip.isDistrict && tooltip.data.NAME_2 ? (
             <p className="font-bold text-gray-800 border-b pb-1 mb-1">{tooltip.data.NAME_2}, {tooltip.data.NAME_1}</p>
          ) : tooltip.data.NAME_1 ? (
            <p className="font-bold text-gray-800 border-b pb-1 mb-1">{tooltip.data.NAME_1}</p>
          ) : null}
          
          {dataset?.startsWith('mices_') ? (
            <div className="mt-1 text-gray-600">
               <p><span className="font-medium mr-1">{dataset.replace('mices_', '').replace(/_/g, ' ')}:</span>{tooltip.data[dataset] || 0}</p>
            </div>
          ) : tooltip.data.name ? (
            <div className="mt-1 text-gray-600">
              <p className="font-bold text-gray-800">{tooltip.data.name}</p>
              <p><span className="font-medium mr-1">Value:</span>{tooltip.data.mnrega}</p>
              <p><span className="font-medium mr-1">Year:</span>{tooltip.data.year}</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
