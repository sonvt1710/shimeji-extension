import requests
from lxml import html
import json
from xml.etree import ElementTree


def parse_xml(xml_str):
    lang_map = {
        "振り向く":"Look",
        "変位":"Offset",
        "立つ":"Stand",
        "歩く":"Walk",
        "走る":"Run",
        "猛ダッシュ":"Dash",
        "座る":"Sit",
        "座って見上げる":"SitAndLookUp",
        "座ってマウスを見上げる":"SitAndLookAtMouse",
        "座って首が回る":"SitAndSpinHeadAction",
        "楽に座る":"SitWithLegsUp",
        "足を下ろして座る":"SitWithLegsDown",
        "足をぶらぶらさせる":"SitAndDangleLegs",
        "寝そべる":"Sprawl",
        "ずりずり":"Creep",
        "天井に掴まる":"GrabCeiling",
        "天井を伝う":"ClimbCeiling",
        "壁に掴まる":"GrabWall",
        "壁を登る":"ClimbWall",
        "IEを持って落ちる":"FallWithIe",
        "IEを持って歩く":"WalkWithIe",
        "IEを持って走る":"RunWithIe",
        "IEを投げる":"ThrowIe",
        "ジャンプ":"Jumping",
        "落ちる":"Falling",
        "跳ねる":"Bouncing",
        "転ぶ":"Tripping",
        "つままれる":"Pinched",
        "抵抗する":"Resisting"
    }
    json_data = {}
    xml = ElementTree.fromstring(xml_str)

    for action in list(xml)[0]:
        jap_name = action.get("名前")
        name = action.get("Name")
        jap_mode = True if jap_name else False
        
        if jap_mode:
            if jap_name not in lang_map:
                continue
            name = lang_map[jap_name]

        if len(list(action)) == 0:
            continue

        poses = []
        for pose in list(action)[0]:
            frame_name = "Image" if not jap_mode else "画像"
            poses.append(pose.get(frame_name))

        json_data[name] = poses

    return json_data

        
def main(): 
    root = requests.get("https://shimejis.xyz/directory/)")
    dom = html.fromstring(root.content)

    boxes = dom.xpath("//*[@class='shim-image']/@style")
    urls = []
    for box in boxes:
        url = box.split("'")[1]
        base = url.split("/")[:-2]
        urls.append("/".join(base))

    spritesheet = "/spritesheet.png"
    actions = "/actions.xml"
    atlas = "/sprites.json"

    spritesheet_data = {}
    i = 0
    for base in urls:
        sheet = {}
        unique_name = base.split("/")[-1]
        spritesheet_file = requests.get(base+spritesheet)
        spritesheet_name = f"spritesheet{i}.png"
        f = open("./spritesheets/" + spritesheet_name,"wb")
        f.write(spritesheet_file.content)
        f.close()

        actions_file = requests.get(base+actions)
        actions_json = parse_xml(actions_file.content.decode('UTF-8'))

        atlas_file = requests.get(base+atlas)
        atlas_json = json.loads(atlas_file.text)

        spritesheet_data[unique_name] = {
            "img":spritesheet_name,
            "atlas":atlas_json,
            "actions":actions_json
        }

        i+=1
        print(i)

    f = open("./data/spritesheet_data.json","w+")
    f.write(json.dumps(spritesheet_data))


if __name__ == "__main__":
    main()