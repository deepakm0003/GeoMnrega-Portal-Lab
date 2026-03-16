from rio_tiler.io import Reader
from rio_tiler.models import ImageData
import numpy as np
import os

TIF_PATH = "lulc_250k_2022.tif"

with Reader(TIF_PATH) as cog:
    # Get a tile from central India (where we saw the colors)
    img = cog.tile(23, 14, 5)
    
    data = img.data.copy()
    print("Original shape:", data.shape)
    
    target_colors = [
        (158, 207, 31),
        (107, 120, 31),
        (255, 209, 0),
        (255, 158, 0),
    ]
    
    mask = np.zeros((data.shape[1], data.shape[2]), dtype=bool)
    for color in target_colors:
        r_match = data[0] == color[0]
        g_match = data[1] == color[1]
        b_match = data[2] == color[2]
        mask = mask | (r_match & g_match & b_match)
        
    print(f"Matched {np.sum(mask)} pixels for cropland")
    
    # Set alpha channel to 0 for non-matches
    if data.shape[0] == 4:
        data[3][~mask] = 0
    
    new_img = ImageData(data)
    content = new_img.render(img_format="PNG")
    
    with open("test_render_crop.png", "wb") as f:
        f.write(content)
        print("Wrote test_render_crop.png")
