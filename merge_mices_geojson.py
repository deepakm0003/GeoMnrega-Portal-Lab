import json
import os
import difflib
import pandas as pd

# Load the original MICES CSV
mices_df = pd.read_csv("mice_fifth_state.csv")

# Load the downloaded GeoJSON
geojson_path = os.path.join("src", "data", "india_states.json")
with open(geojson_path, "r", encoding="utf-8") as f:
    geojson_data = json.load(f)

mices_state_names = mices_df['state_name'].tolist()

# Iterate through geojson features and merge matching properties
for feature in geojson_data['features']:
    geojson_name = feature['properties']['NAME_1'].title()
    
    # Try an exact match first
    best_match = None
    for name in mices_state_names:
        if name.title() == geojson_name:
            best_match = name
            break
            
    # Fuzzy match using difflib
    if not best_match:
        matches = difflib.get_close_matches(geojson_name, [n.title() for n in mices_state_names], n=1, cutoff=0.6)
        if matches:
            best_match_title = matches[0]
            # Find original case
            for name in mices_state_names:
                if name.title() == best_match_title:
                    best_match = name
                    break

    # If it matched reasonably well, inject the data
    if best_match:
        row = mices_df[mices_df['state_name'] == best_match].iloc[0]
        # Append all MICES fields to the feature properties
        feature['properties']['mices_dugwell'] = int(row['dugwell'])
        feature['properties']['mices_shallow_tubewell'] = int(row['shallow_tubewell'])
        feature['properties']['mices_medium_tubewell'] = int(row['medium_tubewell'])
        feature['properties']['mices_deep_tubewell'] = int(row['deep_tubewell'])
        feature['properties']['mices_total_gw_scheme'] = int(row['total_gw_scheme'])
        feature['properties']['mices_surface_flow_scheme'] = int(row['surface_flow_scheme'])
        feature['properties']['mices_surface_lift_scheme'] = int(row['surface_lift_scheme'])
        feature['properties']['mices_total_sw_scheme'] = int(row['total_sw_scheme'])
        feature['properties']['mices_total_water_scheme'] = int(row['total_water_scheme'])
        feature['properties']['mices_state'] = best_match
    else:
        print(f"Failed to match GeoJSON state: {geojson_name}")

output_path = os.path.join("src", "data", "india_mices.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(geojson_data, f)
    
print(f"Successfully merged MICES data into {output_path}")
