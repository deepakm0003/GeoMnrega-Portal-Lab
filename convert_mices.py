import pandas as pd
import json
import os

df = pd.read_csv("mice_fifth_state.csv")

# We want to format this into something the frontend can easily merge with its map properties
# Example format: { "ANDHRA PRADESH": { dugwell: 123, total_water_scheme: 456, ... }, ... }

data_dict = {}

for _, row in df.iterrows():
    state_name = str(row['state_name']).title() # Clean up string casing
    
    # Manually fix some state names to match Mapbox/mockData standard if needed
    if state_name == "Andaman & Nicobars": state_name = "Andaman & Nicobar Islands"
    if state_name == "Chhatisgarh": state_name = "Chhattisgarh"
    if state_name == "Delhi": state_name = "NCT of Delhi"
    
    data_dict[state_name] = {
        "dugwell": int(row['dugwell']),
        "shallow_tubewell": int(row['shallow_tubewell']),
        "medium_tubewell": int(row['medium_tubewell']),
        "deep_tubewell": int(row['deep_tubewell']),
        "total_gw_scheme": int(row['total_gw_scheme']),
        "surface_flow_scheme": int(row['surface_flow_scheme']),
        "surface_lift_scheme": int(row['surface_lift_scheme']),
        "total_sw_scheme": int(row['total_sw_scheme']),
        "total_water_scheme": int(row['total_water_scheme']),
    }

output_path = os.path.join("src", "data", "mices_state_data.json")
with open(output_path, "w") as f:
    json.dump(data_dict, f, indent=2)

print(f"Successfully wrote MICES dataset to {output_path}")
