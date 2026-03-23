from PIL import Image
import os

def process_ten():
    path = "public/ten.png.png"
    out_path = "public/ten.png"
    if not os.path.exists(path):
        if os.path.exists("public/ten.png"):
            path = "public/ten.png"
        else:
            print("Not found")
            return
            
    try:
        img = Image.open(path).convert("RGBA")
        w, h = img.size
        pixels = img.load()
        
        c1 = pixels[0, 0]
        c2 = pixels[w-1, 0]
        bg_color = c1 if c1[3] > 100 else c2
        
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
            
        def is_similar(p1, p2, tol=40):
            return abs(p1[0]-p2[0]) < tol and abs(p1[1]-p2[1]) < tol and abs(p1[2]-p2[2]) < tol

        while stack:
            x, y = stack.pop()
            r, g, b, a = pixels[x, y]
            
            if a < 255 or is_similar((r, g, b), bg_color, 40):
                pixels[x, y] = (0, 0, 0, 0)
                for dx, dy in [(0, 1), (1, 0), (0, -1), (-1, 0)]:
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in visited:
                        visited.add((nx, ny))
                        stack.append((nx, ny))
                        
        mask = img.split()[-1]
        bbox = mask.getbbox()
        if bbox:
            img = img.crop(bbox)
            
        img.save(out_path)
        print("Done process_ten")
    except Exception as e:
        print("Error", e)

process_ten()
