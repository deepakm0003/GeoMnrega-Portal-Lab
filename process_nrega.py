import json
import csv
import os
from collections import defaultdict

# File paths
DISTRICT_GEOJSON = 'src/data/mices/india_mices_districts.json'
WORK_DEMAND_CSV = 'src/data/nrega_reports/Work Demand Pattern/work_demand_pattern_hh_district.csv'
EMPLOYMENT_CSV = 'src/data/nrega_reports/Employment - SC-ST/employment_scst_district.csv'

def clean_name(name):
    if not name: return ""
    return name.strip().upper()

def process():
    print("Loading NREGA Work Demand...")
    # dict structure: data[district][year] = { 'demand': 0, 'employment': 0, ... }
    nrega_data = defaultdict(lambda: defaultdict(lambda: {
        'nrega_demand': 0,
        'nrega_employment_total': 0,
        'nrega_women_employment': 0,
        'nrega_persondays_total': 0
    }))
    
    # Process Work Demand
    # Headers: state_name,district_name,year,month,demand
    if os.path.exists(WORK_DEMAND_CSV):
        with open(WORK_DEMAND_CSV, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            # Find the exact column name for demand since the header was "deman       nd" or similar in raw dump
            demand_col = next(c for c in reader.fieldnames if 'deman' in c.lower())
            
            for row in reader:
                district = clean_name(row.get('district_name', ''))
                year = str(row.get('year', '')).strip()
                try:
                    demand = int(float(row.get(demand_col, 0)))
                except (ValueError, TypeError):
                    demand = 0
                
                if district and year:
                    nrega_data[district][year]['nrega_demand'] += demand

    print("Loading NREGA Employment SC/ST...")
    # headers: state_name,state_code,district_name,financial_year,hh_issued_jobcards_sc,hh_issued_jobcards_st,hh_issued_jobcards_others,hh_issued_jobcards_total,hh_provided_employment_sc,hh_provided_employment_st,hh_provided_employment_others,hh_provided_employment_total,women_provided_employment,persondays_sc,persondays_st,persondays_others,persondays_total,persondays_women,families_completing_100_days_sc,families_completing_100_days_st,families_completing_100_days_others,families_completing_100_days_total
    if os.path.exists(EMPLOYMENT_CSV):
        with open(EMPLOYMENT_CSV, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                district = clean_name(row.get('district_name', ''))
                fy = str(row.get('financial_year', ''))
                # fy is usually '2014-2015', extract the first part
                year = fy.split('-')[0].strip() if '-' in fy else fy.strip()
                
                try:
                    emp_total = int(float(row.get('hh_provided_employment_total', 0)))
                except: emp_total = 0
                
                try:
                    emp_women = int(float(row.get('women_provided_employment', 0)))
                except: emp_women = 0
                
                try:
                    persondays = int(float(row.get('persondays_total', 0)))
                except: persondays = 0

                if district and year:
                    nrega_data[district][year]['nrega_employment_total'] += emp_total
                    nrega_data[district][year]['nrega_women_employment'] += emp_women
                    nrega_data[district][year]['nrega_persondays_total'] += persondays


    print("Loading GeoJSON and injecting properties...")
    with open(DISTRICT_GEOJSON, 'r', encoding='utf-8') as f:
        geojson = json.load(f)
    
    matched = 0
    unmatched = set()
    
    for feature in geojson['features']:
        dist_name = clean_name(feature['properties'].get('NAME_2', ''))
        # NREGA data comes in varying years. We will add keys directly like nrega_demand_2020.
        # Check direct match
        if dist_name in nrega_data:
            matched += 1
            for yr, metrics in nrega_data[dist_name].items():
                # Inject directly into properties
                feature['properties'][f'nrega_demand_{yr}'] = metrics['nrega_demand']
                feature['properties'][f'nrega_employment_total_{yr}'] = metrics['nrega_employment_total']
                feature['properties'][f'nrega_women_employment_{yr}'] = metrics['nrega_women_employment']
                feature['properties'][f'nrega_persondays_total_{yr}'] = metrics['nrega_persondays_total']
                
                # Also fallback to base key without year just in case frontend requests default
                # Or set the base key to the latest year (2024 or whatever)
                feature['properties']['nrega_demand'] = metrics['nrega_demand']
                feature['properties']['nrega_employment_total'] = metrics['nrega_employment_total']
                feature['properties']['nrega_women_employment'] = metrics['nrega_women_employment']
                feature['properties']['nrega_persondays_total'] = metrics['nrega_persondays_total']
        else:
            # Maybe try to match without spacing, or exact subset. This is often an issue with district splits.
            # We'll keep it simple: direct uppercase match is usually 85%+ accurate for standard names.
            unmatched.add(dist_name)
    
    print(f"Matched {matched} out of {len(geojson['features'])} districts.")
    print(f"Sample unmatched: {list(unmatched)[:10]}")

    print("Saving modified GeoJSON (this may take a few seconds)...")
    with open(DISTRICT_GEOJSON, 'w', encoding='utf-8') as f:
        json.dump(geojson, f, separators=(',', ':'))
        
    print("Done!")

if __name__ == '__main__':
    process()
