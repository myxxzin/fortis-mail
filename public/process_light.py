from PIL import Image

def process():
    try:
        img = Image.open('public/ten.light.png').convert("RGBA")
        width, height = img.size
        pixels = img.load()
        
        # Assume top-left corner is the background color
        c = pixels[0, 0]
        
        for y in range(height):
            for x in range(width):
                r, g, b, a = pixels[x, y]
                
                # Calculate maximum difference from background color
                diff = max(abs(r - c[0]), abs(g - c[1]), abs(b - c[2]))
                
                # If it's very close to background color, completely remove it
                if diff < 15:
                    pixels[x, y] = (r, g, b, 0)
                # If it's a bit further, it's an anti-aliased edge. Give it partial alpha to blend smoothly
                elif diff < 100:
                    alpha = int((diff / 100) * 255)
                    
                    # Darken the pixel proportionally if the background was white to avoid a white halo on dark bg
                    if c[0] > 200:
                        dr = int(r * (diff / 100))
                        dg = int(g * (diff / 100))
                        db = int(b * (diff / 100))
                        pixels[x, y] = (dr, dg, db, alpha)
                    else:
                        pixels[x, y] = (r, g, b, alpha)
                        
        # Trim transparent edges
        bbox = img.split()[-1].getbbox()
        if bbox:
            img = img.crop(bbox)
        
        img.save('public/ten.light.png')
        print("Success cleanly saving ten.light.png")
    except Exception as e:
        print("Error:", e)

process()
