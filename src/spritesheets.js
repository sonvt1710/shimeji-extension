import {browser} from "./browser"
import spritesheets from "./spritesheet_data.json"

for(let key in spritesheets){
    spritesheets[key].img = browser.runtime.getURL(`/media/spritesheets/${spritesheets[key].img}`)

    spritesheets[key].actions.walk = spritesheets[key].actions.Walk
    spritesheets[key].actions.idle = spritesheets[key].actions.Sit
    spritesheets[key].actions.jump = spritesheets[key].actions.Jumping
    spritesheets[key].actions.take = spritesheets[key].actions.RunWithIe
    spritesheets[key].actions.special = spritesheets[key].actions.SitAndLookUp
    spritesheets[key].actions.split = spritesheets[key].actions.Creep
    spritesheets[key].actions.eat = spritesheets[key].actions.Dash
    spritesheets[key].actions.dragging = spritesheets[key].actions.Pinched
    spritesheets[key].actions.falling = spritesheets[key].actions.Falling
    spritesheets[key].actions.climb = spritesheets[key].actions.ClimbWall
}

async function prepImages(){
    let images = []

    for(let name in spritesheets){
        images.push(new Promise((res,rej)=>{
            let image = new Image()
            image.onload = ()=>{
                spritesheets[name].img = image
                res(`${name} image loaded`)
            }
            image.onerror = err => rej(err)
            image.src = spritesheets[name].img
        }))
    }
    await Promise.all(images)
    return spritesheets
}

export default prepImages()
