import requests
from lxml import html
import json
from xml.etree import ElementTree


def main():
    root = requests.get("https://shimejis.xyz/directory/)")
    dom = html.fromstring(root.content)

    boxes = dom.xpath("//*[@class='shim-image']/@style")
    urls = []

    for box in boxes:
        url = box.split("'")[1]
        urls.append(url)

    index = 0
    for url in urls:
        img = requests.get(url)
        name = f"sprite{index}.png"
        
        f = open("./sprites/" + name,"wb")
        f.write(img.content)
        f.close()

        print(index)
        index += 1


if __name__ == "__main__":
    main()