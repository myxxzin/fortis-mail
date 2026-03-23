from PIL import Image

def trim(path):
    try:
        img = Image.open(path).convert("RGBA")
        mask = img.split()[-1]
        bbox = mask.getbbox()
        if bbox:
            img = img.crop(bbox)
            img.save(path)
            print("Trimmed", path)
    except Exception as e:
        print("Error", path, e)

trim("public/hub.png")
trim("public/ds.png")
