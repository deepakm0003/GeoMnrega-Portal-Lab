import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import indiaMicesDistrictData from '../data/mices/india_mices_districts.json';

export default function MiniMap({ stateName, dataset }) {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (!stateName || !dataset) return;
    
    // We recreate the mini map if state changes to ensure a completely clean render, 
    // or we just update data. Let's recreate to be safe and simple for different bounds.
    if (map.current) {
      map.current.remove();
      map.current = null;
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [78, 21], 
      zoom: 3,
      interactive: false,
      attributionControl: false
    });

    map.current.on('load', () => {
      if (!map.current) return;
      
      // Find features for this state
      const stateFeatures = indiaMicesDistrictData.features.filter(f => f.properties.NAME_1 === stateName);
      
      const geojson = {
        type: 'FeatureCollection',
        features: stateFeatures
      };

      map.current.addSource('state-districts', {
        type: 'geojson',
        data: geojson
      });

      // Find Max Value for this state
      let maxVal = 0;
      stateFeatures.forEach(f => {
         const val = f.properties[dataset];
         if (val && val > maxVal) maxVal = val;
      });
      if (maxVal === 0) maxVal = 100;

      // Color scheme matches the legend
      let colors = ['#f7fbff', '#c6dbef', '#6baed6', '#2171b5', '#08306b']; // Defaults (Blues)
      if (dataset.startsWith('mices_')) colors = ['#f2f0f7', '#cbc9e2', '#9e9ac8', '#756bb1', '#54278f']; // Purples
      else if (dataset.startsWith('nrega_demand')) colors = ['#fff5eb', '#fdd0a2', '#fd8d3c', '#d94801', '#8c2d04']; // Oranges
      else if (dataset.startsWith('nrega_')) colors = ['#f7fcf5', '#c7e9c0', '#74c476', '#238b45', '#00441b']; // Greens

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
          'fill-opacity': 0.8
        }
      });
      map.current.addLayer({
        id: 'districts-line',
        type: 'line',
        source: 'state-districts',
        paint: {
          'line-color': '#ffffff',
          'line-width': 0.5
        }
      });

      // Calculate Bounding Box and fit
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
        map.current.fitBounds(bounds, { padding: 10, duration: 0 });
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [stateName, dataset]);

  return <div ref={mapContainer} className="w-full h-full rounded" />;
}
