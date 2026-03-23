from PIL import Image

def fix():
    try:
        img = Image.open("public/ten.png").convert("RGBA")
        w, h = img.size
        pixels = img.load()
        
        c = pixels[0, 0]
        
        if c[3] > 200:
            stack = [(0,0), (w-1,0), (0,h-1), (w-1,h-1)]
            visited = set(stack)
            
            while stack:
                x, y = stack.pop()
                r, g, b, a = pixels[x, y]
                if abs(r-c[0])<45 and abs(g-c[1])<45 and abs(b-c[2])<45:
                    pixels[x, y] = (0,0,0,0)
                    for dx, dy in [(0,1), (1,0), (0,-1), (-1,0)]:
                        nx, ny = x+dx, y+dy
                        if 0<=nx<w and 0<=ny<h and (nx,ny) not in visited:
                            visited.add((nx,ny))
                            stack.append((nx,ny))
                            
        bbox = img.split()[-1].getbbox()
        if bbox: img = img.crop(bbox)
        img.save("public/ten.png")
        print("Success")
    except Exception as e:
        print("Error", e)

fix()
