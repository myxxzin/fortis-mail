from PIL import Image

def remove_dark_bg(path):
    try:
        img = Image.open(path).convert("RGBA")
        width, height = img.size
        pixels = img.load()
        
        # Determine the background color by scanning the edges
        bg_color = None
        for x in range(width):
            if pixels[x, 0][3] > 100: bg_color = pixels[x, 0]; break
            if pixels[x, height-1][3] > 100: bg_color = pixels[x, height-1]; break
        if not bg_color:
            for y in range(height):
                if pixels[0, y][3] > 100: bg_color = pixels[0, y]; break
                if pixels[width-1, y][3] > 100: bg_color = pixels[width-1, y]; break
        
        if not bg_color:
            return  # The entire edge is already completely transparent?
            
        stack = []
        visited = set()
        
        for x in range(width):
            stack.append((x, 0))
            stack.append((x, height-1))
            visited.add((x, 0))
            visited.add((x, height-1))
            
        for y in range(height):
            stack.append((0, y))
            stack.append((width-1, y))
            visited.add((0, y))
            visited.add((width-1, y))
            
        def is_similar(c1, c2, tol=30): # increased tolerance slightly for gradient background capture
            return abs(c1[0]-c2[0]) < tol and abs(c1[1]-c2[1]) < tol and abs(c1[2]-c2[2]) < tol
            
        while stack:
            x, y = stack.pop()
            r, g, b, a = pixels[x, y]
            
            # If it's near the background color, OR it's already transparent, eat it
            if a < 255 or is_similar((r, g, b), bg_color, 30):
                pixels[x, y] = (0, 0, 0, 0) # Make transparent
                for dx, dy in [(0, 1), (1, 0), (0, -1), (-1, 0)]:
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < width and 0 <= ny < height and (nx, ny) not in visited:
                        visited.add((nx, ny))
                        stack.append((nx, ny))
                        
        # Now trim the resulting transparent whitespace again
        mask = img.split()[-1]
        bbox = mask.getbbox()
        if bbox:
            img = img.crop(bbox)
            
        img.save(path)
        print("Done", path)
    except Exception as e:
        print("Error", path, e)

remove_dark_bg("public/hub.png")
remove_dark_bg("public/ds.png")
