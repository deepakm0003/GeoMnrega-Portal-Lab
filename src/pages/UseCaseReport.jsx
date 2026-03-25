import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Download, FileText, Image as ImageIcon, Map as MapIcon, Info, Database } from 'lucide-react';
import imageLulc2009 from '../image/image.png';

export default function UseCaseReport({ datasetId, onBack }) {
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef(null);

  const handleOpenModal = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setIsImageExpanded(true);
  };

  useEffect(() => {
    const container = imageContainerRef.current;
    if (!container || !isImageExpanded) return;

    const handleNativeWheel = (e) => {
      e.preventDefault(); // Stop entire page from zooming or scrolling
      const zoomSensitivity = 0.5;
      
      setScale(prev => {
        const newScale = Math.max(1, Math.min(prev + (e.deltaY < 0 ? zoomSensitivity : -zoomSensitivity), 10));
        if (newScale === 1) {
          setPosition({ x: 0, y: 0 });
        }
        return newScale;
      });
    };

    container.addEventListener('wheel', handleNativeWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleNativeWheel);
  }, [isImageExpanded]);

  const handlePointerDown = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handlePointerMove = (e) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };
  
  let title = 'Land Use Land Cover Output';
  if (datasetId === 'lulc-2005') title = 'Land Use Land Cover (LULC) 2005-06';
  if (datasetId === 'lulc-2009') title = 'Land Use Land Cover (LULC) 2009-10';
  if (datasetId === 'lulc-2015') title = 'Land Use Land Cover (LULC) 2015-16';

  const imageSrc = datasetId === 'lulc-2009' ? imageLulc2009 : null;

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 focus:outline-none"
            title="Back to Interactive Map"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">{title}</h1>
            <p className="text-sm text-gray-500 font-medium tracking-wide">Static Case Study & Visualization</p>
          </div>
        </div>
      </header>
      
      {/* Main Content: 50/50 Split */}
      <div className="flex flex-1 overflow-hidden p-6 gap-6">
        
        {/* Left Side: README / Info */}
        <div className="w-1/2 bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex flex-col mb-2 overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 shrink-0">
            <Info className="w-6 h-6 text-[#2d74b4]" />
            <h2 className="text-xl font-bold text-gray-800">Dataset Documentation</h2>
          </div>
          
          <div className="prose prose-sm text-gray-600 max-w-none space-y-5">
             <p className="text-[15px] leading-relaxed">
               The <strong className="text-gray-900">{title}</strong> dataset provides a comprehensive spatial snapshot of India's environmental classification and human land utilization mapped via high-resolution satellite imagery across the subcontinent.
             </p>
             <h3 className="text-sm font-bold text-gray-800 mt-6 mb-2 uppercase tracking-wide">Overview</h3>
             <p className="text-[15px] leading-relaxed">
               Derived meticulously from multi-temporal satellite data streams, this High-Resolution LULC product categorizes the Indian landmass into diverse morphological and ecological zones. This data is critical for assisting national policy planning, agricultural estimates, watershed management, and extensive ecological conservation efforts.
             </p>
             
             <h3 className="text-sm font-bold text-gray-800 mt-8 mb-3 uppercase tracking-wide">Key Classifications</h3>
             <ul className="list-disc pl-5 space-y-3 text-[14px]">
                <li><span className="font-semibold text-green-700">Forests & Vegetation:</span> Includes dense, moderate, and open forested regions, identifying critical ecological habitats.</li>
                <li><span className="font-semibold text-[#d2b350]">Agriculture:</span> Classifications capturing intensive agricultural utilization, mapping Kharif, Rabi, and Zaid crop cycles.</li>
                <li><span className="font-semibold text-[#467ab2]">Water Bodies:</span> Geolocation of all perennial and non-perennial rivers, reservoirs, natural lakes, and wetlands.</li>
                <li><span className="font-semibold text-gray-600">Built-Up Environment:</span> Outlining the footprint of urban sprawl and highly dense rural administrative expansions.</li>
             </ul>

             <h3 className="text-sm font-bold text-gray-800 mt-8 mb-3 uppercase tracking-wide">Data Source Validation</h3>
             <div className="flex items-center gap-3 text-[14px] bg-gray-50 p-4 rounded border border-gray-100">
               <Database className="w-5 h-5 text-gray-500 shrink-0" />
               <p>Provided by the <strong>National Remote Sensing Centre (NRSC), ISRO</strong> ensuring the highest standard of validation against ground-truth coordinates.</p>
             </div>
             
             <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-sm shadow-sm">
                <strong>Technical Rendering Note:</strong> Due to the massive spatial resolution (1:250k) and legacy WMS server configurations hosting this specific dataset cache, direct interactive tile rendering on the web client map is currently disabled to prevent browser instability. 
                <br /><br />
                We provide high-fidelity static maps and raw GeoTIFF data exports below for your analytical continuity.
             </div>
          </div>
        </div>

        {/* Right Side: Map Image Preview & Actions */}
        <div className="w-1/2 flex flex-col gap-4 mb-2">
           {/* Image Preview Window */}
           <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative flex flex-col">
              <div className="px-5 py-3.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between shrink-0">
                 <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-gray-600" />
                    <span className="font-bold text-sm text-gray-800">Rendered Output Preview</span>
                 </div>
              </div>
              
              <div className="flex-1 flex justify-center items-center bg-[#ecedf0] p-4 relative overflow-hidden group">
                 {/* Map Graphic */}
                 {imageSrc ? (
                    <img 
                       src={imageSrc} 
                       alt={title} 
                       onClick={handleOpenModal}
                       className="w-full h-full object-contain drop-shadow-md rounded transition-transform duration-500 group-hover:scale-105 cursor-zoom-in" 
                    />
                 ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-4 transition-transform duration-500 group-hover:scale-105">
                       <div className="relative">
                          <MapIcon className="w-24 h-24 opacity-20 text-[#2d74b4]" />
                          <div className="absolute inset-0 border-4 border-[#2d74b4] border-dashed rounded-lg opacity-10 animate-pulse"></div>
                       </div>
                       <div className="text-center">
                         <span className="font-bold text-gray-500 block text-lg mb-1">Static Map Preview</span>
                         <span className="text-sm text-gray-400">High Resolution Render Cache (1.2GB)</span>
                       </div>
                    </div>
                 )}
              </div>
           </div>
           
           {/* Action Buttons */}
           <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex justify-end gap-4 shrink-0">
              <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded shadow-sm hover:bg-gray-50 hover:text-gray-900 font-bold transition-colors">
                <Database className="w-4 h-4" /> Download Raw Data (GeoTIFF)
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-[#2d74b4] text-white rounded shadow text-sm font-bold hover:bg-[#23588a] transition-colors">
                <Download className="w-4 h-4" /> Download Full Report PDF
              </button>
           </div>
        </div>
        
      </div>

      {/* Fullcreen Image Modal Overlay */}
      {isImageExpanded && imageSrc && (
        <div 
           className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-8 transition-opacity duration-300"
           onClick={(e) => {
              // Close if clicked outside image directly
              if (e.target === e.currentTarget) setIsImageExpanded(false);
           }}
        >
           <div className="relative w-[85%] h-[85%] bg-white/95 rounded-xl shadow-2xl p-4 flex flex-col items-center justify-center border border-gray-700 overflow-hidden">
             
             {/* Header Controls */}
             <div className="absolute top-0 left-0 right-0 bg-white/80 backdrop-blur border-b border-gray-200 p-4 flex items-center justify-between z-20">
               <h3 className="text-xl font-bold text-gray-800 tracking-wide">{title} - Interactive Viewer</h3>
               <button 
                  className="bg-gray-100 hover:bg-red-50 text-gray-800 hover:text-red-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg shadow-sm transition-colors border border-gray-200"
                  onClick={() => setIsImageExpanded(false)}
               >
                  ×
               </button>
             </div>

             {/* Interactive Image Container */}
             <div 
                ref={imageContainerRef}
                className={`w-full h-full mt-10 p-4 flex items-center justify-center overflow-hidden ${scale > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'}`}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
             >
                 <img 
                    src={imageSrc} 
                    alt={`${title} Expanded`} 
                    style={{
                       transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                       transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.2, 0, 0, 1)'
                    }}
                    className="max-w-full max-h-full object-contain drop-shadow-xl pointer-events-none select-none" 
                    draggable="false"
                 />
             </div>

             {/* Zoom Utility Bar */}
             <div className="absolute bottom-6 flex items-center gap-4 bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-lg border border-gray-200 z-20">
                <button title="Zoom Out" onClick={() => { const s = Math.max(scale - 0.5, 1); setScale(s); if(s===1) setPosition({x:0, y:0}); }} className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 rounded-full transition-colors text-xl">−</button>
                <div className="flex flex-col items-center min-w-[60px]">
                   <span className="text-sm font-bold text-gray-800">{Math.round(scale * 100)}%</span>
                   <span className="text-[10px] text-gray-500 font-medium tracking-wide">ZOOM</span>
                </div>
                <button title="Zoom In" onClick={() => setScale(Math.min(scale + 0.5, 10))} className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 rounded-full transition-colors text-xl">+</button>
                <div className="w-px h-6 bg-gray-200 mx-1"></div>
                <button title="Reset Zoom" onClick={() => { setScale(1); setPosition({x:0, y:0}); }} className="px-3 py-1 font-semibold text-xs text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-colors">RESET</button>
             </div>

             {/* Usage hints */}
             {scale === 1 && (
                <p className="absolute bottom-[80px] text-xs text-gray-500 font-medium bg-white/60 px-3 py-1 rounded-full">Use scroll wheel to zoom • Click and drag to pan • Click outside image to close</p>
             )}
           </div>
        </div>
      )}
    </div>
  );
}
