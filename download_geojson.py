import urllib.request
import json
import os

url = "https://raw.githubusercontent.com/geohacker/india/master/state/india_telengana.geojson"
output_path = os.path.join("src", "data", "india_states.json")

print("Downloading India States GeoJSON...")
try:
    urllib.request.urlretrieve(url, output_path)
    print(f"Successfully downloaded to {output_path}")
    
    # Let's inspect the properties of the first feature to see what the state name key is
    with open(output_path, "r", encoding="utf-8") as f:
         data = json.load(f)
         print(f"First feature properties: {data['features'][0]['properties']}")
except Exception as e:
    print(f"Error downloading: {e}")
