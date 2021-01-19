import os
from PIL import Image
import PIL
import os
import glob

os.chdir(os.getcwd() + "/../dist/media")
files = os.listdir()

for file in files:
    print(file)
    img = Image.open(file)

    img.save("new_"+file, optimize=True, quality=1,compress_level = 9)
    break

