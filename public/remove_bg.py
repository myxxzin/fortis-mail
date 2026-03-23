from PIL import Image

def remove_background(input_path, output_path, tolerance=40):
    try:
        img = Image.open(input_path).convert("RGBA")
        width, height = img.size
        pixels = img.load()
        
        corners = [(0, 0), (width-1, 0), (0, height-1), (width-1, height-1), (width//2, 0), (0, height//2)]
        visited = set()
        stack = []
        
        bg_colors = []
        for c in corners:
            bg_colors.append(pixels[c])
            stack.append(c)
            visited.add(c)
            
        def is_similar(c1, c2, tol):
            return abs(c1[0]-c2[0]) < tol and abs(c1[1]-c2[1]) < tol and abs(c1[2]-c2[2]) < tol

        while stack:
            x, y = stack.pop()
            current_color = pixels[x, y]
            
            match = False
            for bg in bg_colors:
                if is_similar(current_color, bg, tolerance):
                    match = True
                    break
                    
            if match:
                pixels[x, y] = (current_color[0], current_color[1], current_color[2], 0)
                
                for dx, dy in [(0, 1), (1, 0), (0, -1), (-1, 0)]:
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < width and 0 <= ny < height and (nx, ny) not in visited:
                        visited.add((nx, ny))
                        stack.append((nx, ny))
        
        img.save(output_path, "PNG")
        print(f"Processed {input_path}")
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

remove_background("public/hub.png", "public/hub.png")
remove_background("public/ds.png", "public/ds.png")
