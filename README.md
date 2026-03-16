# GeoMNREGA Portal

A modern React-based geospatial research dashboard for visualizing MNREGA statistics across Indian states.

--------------------------------------------------

OVERVIEW

GeoMNREGA Portal is an academic research visualization platform designed to explore geospatial datasets related to the Mahatma Gandhi National Rural Employment Guarantee Act (MNREGA).

The portal provides an interactive choropleth map of India where users can explore employment, asset creation, and geographic statistics through a clean and responsive interface.

--------------------------------------------------

FEATURES

- Interactive full-screen map of India
- Choropleth visualization with MNREGA data
- Dataset selector for multiple MNREGA datasets
- Year range selector (2018–2021)
- Hover tooltips displaying state-level data
- Responsive research dashboard layout
- Academic research portal UI design

--------------------------------------------------

TECHNOLOGY STACK

React 18      : UI Framework  
Vite          : Build Tool  
MapLibre GL JS: Interactive Map Rendering  
Tailwind CSS  : Styling Framework  
PostCSS       : CSS Processing  

--------------------------------------------------

INSTALLATION

1. Clone the repository

git clone https://github.com/deepakm0003/GeoMnrega-Portal-Lab.git

2. Navigate to the project folder

cd GeoMnrega-Portal-Lab

3. Install dependencies

npm install

4. Start the development server

npm run dev

The application will run at:

http://localhost:5173

--------------------------------------------------

PROJECT STRUCTURE

src/
│
├── components/
│   ├── Navbar.jsx        - Navigation bar
│   ├── MapView.jsx       - MapLibre map component
│   ├── ControlPanel.jsx  - Dataset and year selector
│   ├── StatsPanel.jsx    - Statistics display
│   ├── Legend.jsx        - Color scale legend
│   └── Footer.jsx        - Footer section
│
├── pages/
│   └── Home.jsx          - Main homepage
│
├── data/
│   └── mockData.js       - Mock GeoJSON dataset
│
├── App.jsx               - Root application component
├── main.jsx              - Application entry point
└── index.css             - Tailwind styles

--------------------------------------------------

STYLING

The project uses Tailwind CSS with custom color variables:

Primary Blue : #1E3A8A  
Soft Green   : #10B981  
Light Gray   : #F3F4F6  
Panel Gray   : #E5E7EB  

--------------------------------------------------

MOCK DATA

The application currently uses mock GeoJSON data for demonstration purposes.

Real data integration can be done by:

1. Replacing the GeoJSON inside src/data/mockData.js
2. Adding API endpoints for dynamic data fetching
3. Implementing filtering logic in components

--------------------------------------------------

