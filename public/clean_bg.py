from PIL import Image

def clean_image(input_path, output_path):
    try:
        img = Image.open(input_path).convert("RGBA")
        width, height = img.size
        # Crop 10 pixels from all sides to remove the faint screenshot border
        img = img.crop((10, 10, width-10, height-10))
        
        # After cropping, let's also make sure any remaining outer black/purple lines are removed
        pixels = img.load()
        w, h = img.size
        
        stack = []
        visited = set()
        
        # Add all transparent or near-black/purple pixels on the edge to the stack
        for x in range(w):
            for y in (0, h-1):
                r, g, b, a = pixels[x, y]
                if a < 255 or (r < 100 and b < 100 and g < 100) or r > 200:
                    stack.append((x, y))
                    visited.add((x, y))
                    pixels[x, y] = (0, 0, 0, 0)
                    
        for y in range(h):
            for x in (0, w-1):
                r, g, b, a = pixels[x, y]
                if a < 255 or (r < 100 and b < 100 and g < 100) or r > 200:
                    stack.append((x, y))
                    visited.add((x, y))
                    pixels[x, y] = (0, 0, 0, 0)

        while stack:
            x, y = stack.pop()
            
            for dx, dy in [(0, 1), (1, 0), (0, -1), (-1, 0)]:
                nx, ny = x + dx, y + dy
                if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in visited:
                    r, g, b, a = pixels[nx, ny]
                    # If neighbor is almost transparent or a dark purple/black pixel or bright white
                    if a < 100 or (r < 100 and b < 100 and g < 100) or r > 230:
                        visited.add((nx, ny))
                        stack.append((nx, ny))
                        pixels[nx, ny] = (0, 0, 0, 0)
        
        img.save(output_path, "PNG")
        print(f"Cleaned {input_path}")
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

clean_image("public/hub.png", "public/hub.png")
clean_image("public/ds.png", "public/ds.png")
