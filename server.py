from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from rio_tiler.io import Reader
import uvicorn
import os

app = FastAPI(title="GeoMNREGA Map Tile Server")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TIF_PATH = "lulc_250k_2022.tif"

@app.get("/tiles/{z}/{x}/{y}.png")
async def get_tile(z: int, x: int, y: int, dataset: str = "all"):
    try:
        with Reader(TIF_PATH) as cog:
            img = cog.tile(x, y, z)
            
            # If a specific dataset is asked for, filter the RGBA array
            if dataset in ["nices-cropland", "nices-forest"] and img.data.shape[0] >= 3:
                import numpy as np
                from rio_tiler.models import ImageData
                
                data = img.data.copy()
                target_colors = []
                
                if dataset == "nices-cropland":
                    target_colors = [
                        (158, 207, 31),  # Kharif
                        (107, 120, 31),  # Double / Triple crop
                        (255, 209, 0),   # Rabi
                        (255, 158, 0),   # Zaid
                    ]
                elif dataset == "nices-forest":
                    target_colors = [
                        (0, 94, 0),      # Dark Forest
                        (115, 184, 43),  # Lighter vegetation/shrub
                    ]
                
                if target_colors:
                    mask = np.zeros((data.shape[1], data.shape[2]), dtype=bool)
                    for color in target_colors:
                        r_match = data[0] == color[0]
                        g_match = data[1] == color[1]
                        b_match = data[2] == color[2]
                        mask = mask | (r_match & g_match & b_match)
                    
                    # Ensure there is an alpha channel to modify
                    if data.shape[0] == 4:
                        data[3][~mask] = 0 # Make non-target pixels transparent
                    else:
                        # If 3 bands, we need to add an alpha band
                        alpha = np.where(mask, 255, 0).astype(data.dtype)
                        data = np.vstack([data, alpha[np.newaxis, ...]])

                    img = ImageData(data)

            # Create a PNG image from the tile data
            content = img.render(img_format="PNG")
            return Response(content, media_type="image/png")
    except Exception as e:
        # Return a 1x1 transparent PNG to prevent 404 console errors in Mapbox
        transparent_png = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82'
        return Response(transparent_png, media_type="image/png")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
