// Mock GeoJSON data for Indian states with MNREGA values - Polygon geometry for choropleth
export const statesGeoJSON = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', properties: { name: 'Andhra Pradesh', mnrega_value: 18500, year: 2020 }, geometry: { type: 'Polygon', coordinates: [[[77, 13], [85, 13], [85, 20], [77, 20], [77, 13]]] } },
    { type: 'Feature', properties: { name: 'Karnataka', mnrega_value: 12300, year: 2020 }, geometry: { type: 'Polygon', coordinates: [[[74, 11], [79, 11], [79, 18], [74, 18], [74, 11]]] } },
    { type: 'Feature', properties: { name: 'Tamil Nadu', mnrega_value: 15600, year: 2020 }, geometry: { type: 'Polygon', coordinates: [[[78, 8], [82, 8], [82, 13], [78, 13], [78, 8]]] } },
    { type: 'Feature', properties: { name: 'Telangana', mnrega_value: 14200, year: 2020 }, geometry: { type: 'Polygon', coordinates: [[[77, 15], [82, 15], [82, 20], [77, 20], [77, 15]]] } },
    { type: 'Feature', properties: { name: 'Rajasthan', mnrega_value: 19800, year: 2020 }, geometry: { type: 'Polygon', coordinates: [[[70, 23], [77, 23], [77, 29], [70, 29], [70, 23]]] } },
    { type: 'Feature', properties: { name: 'Gujarat', mnrega_value: 11400, year: 2020 }, geometry: { type: 'Polygon', coordinates: [[[68, 20], [74, 20], [74, 26], [68, 26], [68, 20]]] } },
    { type: 'Feature', properties: { name: 'Maharashtra', mnrega_value: 16700, year: 2020 }, geometry: { type: 'Polygon', coordinates: [[[73, 16], [78, 16], [78, 23], [73, 23], [73, 16]]] } },
    { type: 'Feature', properties: { name: 'Madhya Pradesh', mnrega_value: 17400, year: 2020 }, geometry: { type: 'Polygon', coordinates: [[[75, 20], [83, 20], [83, 27], [75, 27], [75, 20]]] } },
    { type: 'Feature', properties: { name: 'Uttar Pradesh', mnrega_value: 20100, year: 2020 }, geometry: { type: 'Polygon', coordinates: [[[77, 25], [84, 25], [84, 31], [77, 31], [77, 25]]] } },
    { type: 'Feature', properties: { name: 'Bihar', mnrega_value: 13500, year: 2020 }, geometry: { type: 'Polygon', coordinates: [[[83, 25], [88, 25], [88, 29], [83, 29], [83, 25]]] } },
    { type: 'Feature', properties: { name: 'Jharkhand', mnrega_value: 9800, year: 2020 }, geometry: { type: 'Polygon', coordinates: [[[83, 21], [87, 21], [87, 25], [83, 25], [83, 21]]] } },
    { type: 'Feature', properties: { name: 'West Bengal', mnrega_value: 11200, year: 2020 }, geometry: { type: 'Polygon', coordinates: [[[85, 24], [89, 24], [89, 28], [85, 28], [85, 24]]] } },
    { type: 'Feature', properties: { name: 'Odisha', mnrega_value: 14800, year: 2020 }, geometry: { type: 'Polygon', coordinates: [[[84, 19], [88, 19], [88, 23], [84, 23], [84, 19]]] } },
    { type: 'Feature', properties: { name: 'Chhattisgarh', mnrega_value: 12600, year: 2020 }, geometry: { type: 'Polygon', coordinates: [[[80, 19], [85, 19], [85, 24], [80, 24], [80, 19]]] } },
    { type: 'Feature', properties: { name: 'Punjab', mnrega_value: 8400, year: 2020 }, geometry: { type: 'Polygon', coordinates: [[[74, 30], [77, 30], [77, 33], [74, 33], [74, 30]]] } },
    { type: 'Feature', properties: { name: 'Himachal Pradesh', mnrega_value: 6200, year: 2020 }, geometry: { type: 'Polygon', coordinates: [[[75, 31], [78, 31], [78, 34], [75, 34], [75, 31]]] } },
    { type: 'Feature', properties: { name: 'Haryana', mnrega_value: 7900, year: 2020 }, geometry: { type: 'Polygon', coordinates: [[[77, 27], [80, 27], [80, 30], [77, 30], [77, 27]]] } },
    { type: 'Feature', properties: { name: 'Assam', mnrega_value: 10100, year: 2020 }, geometry: { type: 'Polygon', coordinates: [[[89, 25], [96, 25], [96, 29], [89, 29], [89, 25]]] } },
    { type: 'Feature', properties: { name: 'Kerala', mnrega_value: 4500, year: 2020 }, geometry: { type: 'Polygon', coordinates: [[[76, 8], [78, 8], [78, 12], [76, 12], [76, 8]]] } },
    { type: 'Feature', properties: { name: 'Goa', mnrega_value: 5200, year: 2020 }, geometry: { type: 'Polygon', coordinates: [[[73, 14], [75, 14], [75, 16], [73, 16], [73, 14]]] } },
    { type: 'Feature', properties: { name: 'Uttarakhand', mnrega_value: 8900, year: 2020 }, geometry: { type: 'Polygon', coordinates: [[[79, 29], [81, 29], [81, 31], [79, 31], [79, 29]]] } },
    { type: 'Feature', properties: { name: 'Tripura', mnrega_value: 4100, year: 2020 }, geometry: { type: 'Polygon', coordinates: [[[91, 23], [92, 23], [92, 24], [91, 24], [91, 23]]] } },
    { type: 'Feature', properties: { name: 'Meghalaya', mnrega_value: 3800, year: 2020 }, geometry: { type: 'Polygon', coordinates: [[[90, 25], [92, 25], [92, 26], [90, 26], [90, 25]]] } },
    { type: 'Feature', properties: { name: 'Manipur', mnrega_value: 3200, year: 2020 }, geometry: { type: 'Polygon', coordinates: [[[94, 24], [95, 24], [95, 25], [94, 25], [94, 24]]] } },
    { type: 'Feature', properties: { name: 'Nagaland', mnrega_value: 2800, year: 2020 }, geometry: { type: 'Polygon', coordinates: [[[94, 26], [95, 26], [95, 27], [94, 27], [94, 26]]] } },
    { type: 'Feature', properties: { name: 'Mizoram', mnrega_value: 2500, year: 2020 }, geometry: { type: 'Polygon', coordinates: [[[93, 23], [94, 23], [94, 24], [93, 24], [93, 23]]] } },
    { type: 'Feature', properties: { name: 'Sikkim', mnrega_value: 1800, year: 2020 }, geometry: { type: 'Polygon', coordinates: [[[88, 27], [89, 27], [89, 28], [88, 28], [88, 27]]] } },
    { type: 'Feature', properties: { name: 'Arunachal Pradesh', mnrega_value: 3500, year: 2020 }, geometry: { type: 'Polygon', coordinates: [[[93, 28], [97, 28], [97, 29], [93, 29], [93, 28]]] } },
  ],
}

// Function to generate data for different years
export function getMnregaDataByYear(year) {
  const yearMultiplier = {
    '2018': 0.75,
    '2019': 0.85,
    '2020': 1.0,
    '2021': 1.1,
  }

  const multiplier = yearMultiplier[year] || 1.0

  return {
    type: 'FeatureCollection',
    features: statesGeoJSON.features.map((feature) => ({
      ...feature,
      properties: {
        ...feature.properties,
        mnrega_value: Math.round(feature.properties.mnrega_value * multiplier),
        year: parseInt(year),
      },
    })),
  }
}
