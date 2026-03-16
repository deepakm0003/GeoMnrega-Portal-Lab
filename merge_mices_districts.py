import urllib.request
import json
import os
import difflib
import pandas as pd

# 1. Download India Districts GeoJSON
url = "https://raw.githubusercontent.com/geohacker/india/master/district/india_district.geojson"
geojson_path = os.path.join("src", "data", "india_districts.json")

print("Downloading India Districts GeoJSON...")
try:
    if not os.path.exists(geojson_path):
        urllib.request.urlretrieve(url, geojson_path)
        print(f"Successfully downloaded to {geojson_path}")
    else:
        print(f"Already downloaded {geojson_path}")
except Exception as e:
    print(f"Error downloading: {e}")
    exit(1)

# 2. Load the downloaded GeoJSON
with open(geojson_path, "r", encoding="utf-8") as f:
    geojson_data = json.load(f)

# 3. Load the MICES District CSV
mices_df = pd.read_csv("mice_fifth_district.csv")

# Ensure district names are strings
mices_df['district_name'] = mices_df['district_name'].astype(str)
mices_district_names = mices_df['district_name'].tolist()

print(f"Loaded {len(mices_district_names)} district names from CSV.")

found = 0
not_found = 0

for feature in geojson_data['features']:
    # Inspect properties for name fields: NAME_2 or NAME_1, depending on geojson structure
    props = feature['properties']
    # Typically district names in this geojson are under 'NAME_2'
    district_name = props.get('NAME_2', '')
    state_name = props.get('NAME_1', '')
    
    if not district_name:
        continue
        
    district_name_title = district_name.title()
    
    # Try exact match first
    best_match = None
    for name in mices_district_names:
        if name.title() == district_name_title:
            best_match = name
            break
            
    # Fuzzy match using difflib
    if not best_match:
        # Filter CSV rows roughly by state if possible to improve fuzzy search? 
        # GeoJSON has state in 'NAME_1', but spelling might vary. Let's just global fuzzy match.
        matches = difflib.get_close_matches(district_name_title, [n.title() for n in mices_district_names], n=1, cutoff=0.7)
        if matches:
            best_match_title = matches[0]
            for name in mices_district_names:
                if name.title() == best_match_title:
                    best_match = name
                    break

    if best_match:
        found += 1
        # Get row matching district (and ideally state, but let's just use first district match for simplicity)
        row = mices_df[mices_df['district_name'] == best_match].iloc[0]
        
        feature['properties']['mices_dugwell'] = int(row['dugwell'])
        feature['properties']['mices_shallow_tubewell'] = int(row['shallow_tubewell'])
        feature['properties']['mices_medium_tubewell'] = int(row['medium_tubewell'])
        feature['properties']['mices_deep_tubewell'] = int(row['deep_tubewell'])
        feature['properties']['mices_total_gw_scheme'] = int(row['total_gw_scheme'])
        feature['properties']['mices_surface_flow_scheme'] = int(row['surface_flow_scheme'])
        feature['properties']['mices_surface_lift_scheme'] = int(row['surface_lift_scheme'])
        feature['properties']['mices_total_sw_scheme'] = int(row['total_sw_scheme'])
        feature['properties']['mices_total_water_scheme'] = int(row['total_water_scheme'])
        feature['properties']['mices_district'] = best_match
    else:
        not_found += 1
        # Fill with 0
        feature['properties']['mices_total_water_scheme'] = 0

output_path = os.path.join("src", "data", "india_mices_districts.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(geojson_data, f)
    
print(f"Successfully merged MICES District data into {output_path}")
print(f"Matched: {found}, Not Matched: {not_found}")
