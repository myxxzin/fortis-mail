from PIL import Image

def remove_bg(path):
    try:
        img = Image.open(path).convert("RGBA")
        w, h = img.size
        pixels = img.load()
        
        stack = []
        visited = set()
        
        for x in range(w):
            stack.append((x, 0))
            stack.append((x, h-1))
            visited.add((x, 0))
            visited.add((x, h-1))
            
        for y in range(h):
            stack.append((0, y))
            stack.append((w-1, y))
            visited.add((0, y))
            visited.add((w-1, y))
            
        while stack:
            x, y = stack.pop()
            r, g, b, a = pixels[x, y]
            
            # If the pixel is relatively light or already transparent
            # The shield is dark blue and dark red, so anything above 180 brightness is likely the outside background
            # We also check if it's currently transparent (a == 0) to allow the flood to pass through previously transparent areas
            if a == 0 or (r > 160 and g > 160 and b > 160) or (abs(r-g)<20 and abs(g-b)<20 and r>140):
                pixels[x, y] = (r, g, b, 0) # Make transparent
                for dx, dy in [(0, 1), (1, 0), (0, -1), (-1, 0)]:
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in visited:
                        visited.add((nx, ny))
                        stack.append((nx, ny))
                        
        # Now trim the transparent whitespace
        mask = img.split()[-1]
        bbox = mask.getbbox()
        if bbox:
            img = img.crop(bbox)
            
        img.save(path)
        print("Done", path)
    except Exception as e:
        print("Error", path, e)

remove_bg("public/hub.png")
