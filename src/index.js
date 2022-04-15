import mixpanel from "mixpanel-browser"
import { browser } from "./browser"
import spritesheets from "./spritesheets"

let shimeji = (function () {
    return {
        spritesheets,
        spawnIndex: 1,
        mouse: [0, 0],
        buds: [],
        setStyle: function (bud) {
            bud.canvas.style.position = "fixed"
            bud.canvas.style.zIndex = 9998
            bud.canvas.style.top = 0
            bud.canvas.style.left = 0
        },
        spawn: function (sprite = this.favs[0], x = 100, y = 100) {
            let canvas = document.createElement("canvas")
            document.body.appendChild(canvas)
            let shinyInt = Math.floor(Math.random() * 100)

            let bud = {
                index: this.spawnIndex,
                sprite,
                actionData: {
                    walkDirection: 1,
                    paintedChatBox: false
                },
                action: "idle",
                actionFrameCount: 0,
                pauseActions: false,
                animationIndex: 0,
                lastAnimationDraw: 0,
                floor: "window",
                x, y,
                canvas,
                canvasFilter: "",
                velocity: [0, 0],
                torque: 0,
                scale: 1
            }
            if (shinyInt == 2)
                bud.canvasFilter = "hue-rotate(210deg)"
            this.buds.push(bud)
            this.attatchEvents(bud)
            this.setStyle(bud)
            this.spawnIndex++
        },
        remove: function (bud) {
            this.cleanActions(bud)
            bud.canvas.remove()

            this.buds = this.buds.filter(innerBud => {
                return innerBud.index !== bud.index
            })
        },
        attatchEvents: function (bud) {
            bud.canvas.addEventListener("mousedown", (e) => {
                this.setAction(bud, "dragging")
            })
            document.body.addEventListener("mouseup", () => {
                if (bud.action == "dragging")
                    this.setAction(bud, "falling")
            })
            document.body.addEventListener("mousemove", e => {
                this.mouse = [e.x, e.y]

                if (bud.action == "dragging") {
                    e.preventDefault()
                    bud.velocity = [e.movementX, e.movementY]
                    bud.x += e.movementX
                    bud.y += e.movementY
                    bud.torque += e.movementX
                    if (bud.torque < -100)
                        bud.torque = -100
                    if (bud.torque > 100)
                        bud.torque = 100
                }
            })

        },
        updateAnimation: function (bud) {
            let canvasContext = bud.canvas.getContext("2d")
            let currentSprite = this.spritesheets[bud.sprite]
            let frames = currentSprite.actions[bud.action]
            let length = frames.length

            //check if enough time has passed for next sprite
            let d = new Date()
            let fps = 12
            if (bud.lastAnimationDraw + (1000 / fps) > d.getTime())
                return

            bud.lastAnimationDraw = d.getTime()

            //update to next sprite
            bud.animationIndex += 1
            if (bud.animationIndex >= length) {
                bud.animationIndex = 0
            }

            //draw and chache sprites
            let frame = frames[bud.animationIndex]
            let { x, y, height: h, width: w } = currentSprite.atlas[frame]
            //remove edge fragments
            y += 1
            x += 1
            h -= 1
            w -= 1

            bud.canvas.height = h * bud.scale
            bud.canvas.width = w * bud.scale
            canvasContext.filter = bud.canvasFilter

            canvasContext.clearRect(0, 0, bud.canvas.width, bud.canvas.height)
            canvasContext.drawImage(currentSprite.img, x, y, w, h, 0, 0, bud.canvas.width, bud.canvas.height)
        },
        updatePosition: function (bud) {
            bud.canvas.style.left = `${bud.x}px`
            bud.canvas.style.top = `${bud.y}px`
            bud.canvas.style.transform = `rotate(${bud.torque}deg)`
        },
        setAction: function (bud, action) {
            this.cleanActions(bud)
            bud.pauseActions = true
            bud.actionFrameCount = 0
            bud.lastAnimationDraw = 0
            bud.action = action
        },
        releaseAction: function (bud) {
            bud.pauseActions = false
            bud.lastAnimationDraw = 0
        },
        cleanActions: function (bud) {
            switch (bud.action) {
                case "talk":
                    document.body.removeChild(bud.actionData.pElm)
                    bud.actionData.paintedChatBox = false
                    break
                case "take":
                    bud.actionData.tookItem.style.visibility = "visible"
                    bud.actionData.tookItemClone.remove()
                    bud.actionData.tookItem = null
                    bud.actionData.tookItemClone = null
                    break
                case "walk":
                    let randomDirection = [1, -1][Math.floor(Math.random() * 2)]
                    bud.actionData.walkDirection = randomDirection
                    break
                case "dragging":
                    bud.canvas.style.transform = ""
                    break
                case "split":
                    this.spawn(bud.sprite, bud.x + 10, bud.y)
                    break
            }
        },
        updateAction: function (bud) {
            // [probability,duration in frames]
            let actions = {
                walk: [80, 60],
                idle: [70, 60 * 3],
                jump: [20, 60],
                special: [10, 60 * 4],
                take: [4, 60 * 10]
            }

            if (this.settings.grow)
                actions.eat = [5, 60]
            if (this.settings.multiply)
                actions.split = [5, 60]

            //dynamic actions
            if (bud.x - 10 <= 0 || bud.x + 10 >= (window.innerWidth - bud.canvas.width)) {
                actions["climb"] = [12, 60 * 8]
            }

            if (bud.pauseActions) return
            bud.actionFrameCount -= 1

            //generate new random action 
            if (bud.actionFrameCount <= 0) {
                this.cleanActions(bud)

                let actionList = []
                for (let key in actions) {
                    let array = Array(actions[key][0]).fill(String(key))
                    actionList.push(...array)
                }
                let actionIndex = Math.floor(Math.random() * actionList.length)
                let action = actionList[actionIndex]
                bud.action = action
                bud.actionFrameCount = actions[action][1]
                bud.lastAnimationDraw = 0
            }
        },
        updateActionData: function (bud) {
            let floor = window.innerHeight
            if (bud.floor != "window") {
                let box = bud.floor.getBoundingClientRect()
                floor = box.y + box.height
            }

            if (bud.y + bud.canvas.height >= floor) {
                bud.actionData["floored"] = true
                if (bud.action == "falling") this.releaseAction(bud)
            } else {
                bud.actionData["floored"] = false
            }

        },
        applyAction: function (bud) {
            switch (bud.action) {
                case "jump":
                    if (bud.actionFrameCount <= 30) return
                    bud.y -= 16 * bud.scale
                    break
                case "walk":
                    bud.x += 2.5 * bud.actionData.walkDirection
                    bud.canvas.style.transform = `scaleX(${-bud.actionData.walkDirection})`
                    break
                case "take":
                    if (!bud.actionData.tookItem) {
                        let elms = Array.from(document.body.querySelectorAll("video,img")).filter(elm => {
                            if (elm.name === "clone")
                                return false
                            if (elm.style.visibility === "hidden")
                                return false
                            if (elm.clientHeight < bud.canvas.height / 2)
                                return false
                            if (elm.clientWidth < bud.canvas.width / 2)
                                return false

                            return true
                        })
                        if (elms.length === 0) {
                            bud.actionData.tookItem = document.createElement("i")
                            bud.actionData.tookItemClone = document.createElement("i")
                            this.setAction(bud, "idle")
                            this.releaseAction(bud)
                            return
                        }

                        let randomIndex = Math.floor(Math.random() * (elms.length - 1))
                        let elm = elms[randomIndex]
                        bud.actionData.tookItem = elm
                        let clone = elm.cloneNode(true)
                        clone.name = "clone"

                        let computedElmStyle = getComputedStyle(elm)
                        for (let style in computedElmStyle) {
                            try {
                                clone.style[style] = computedElmStyle[style]
                            } catch (err) { }
                        }

                        clone.style.position = "fixed"
                        clone.style.zIndex = "9999"
                        clone.style.borderRadius = "0"
                        clone.onclick = e => {
                            e.preventDefault()
                            this.setAction(bud, "idle")
                            this.releaseAction(bud)
                        }
                        document.body.appendChild(clone)
                        bud.actionData.tookItemClone = clone
                        elm.style.visibility = "hidden"
                        bud.actionData.takeJumpFrames = 0
                    } else {
                        let randomJump = Math.floor(Math.random() * 100)
                        if (bud.actionData.takeJumpFrames > 0) {
                            bud.y -= 16 * bud.scale
                            bud.actionData.takeJumpFrames--
                        }
                        if (randomJump == 1 && bud.actionData["floored"]) {
                            bud.actionData.takeJumpFrames = 30
                        }

                        bud.canvas.style.transform = `scaleX(-1)`
                        bud.actionData.tookItemClone.style.left = `${bud.x + (bud.canvas.width * .4)}px`
                        let top = bud.y - bud.actionData.tookItemClone.offsetHeight + (bud.canvas.height * .6)
                        bud.actionData.tookItemClone.style.top = `${top}px`
                    }
                    break
                case "climb":
                    bud.y -= 11 * bud.scale
                    if (bud.x > 100) {
                        bud.canvas.style.transform = `scaleX(-1)`
                        bud.x = window.innerWidth - (bud.canvas.width / 2)
                    } else {
                        bud.x = 0 - (bud.canvas.width / 2)
                    }

                    break
                case "eat":
                    bud.x += 5 * bud.actionData.walkDirection
                    bud.canvas.style.transform = `scaleX(${-bud.actionData.walkDirection})`

                    let start = bud.x
                    let end = bud.x + bud.canvas.width;
                    [...this.buds].forEach(innerBud => {
                        if (innerBud.index == bud.index) return

                        let validX = innerBud.x >= start && innerBud.x <= end
                        let validY = innerBud.y >= bud.y - 40
                        let smaller = innerBud.scale <= bud.scale

                        if (validX && validY && smaller) {
                            this.remove(innerBud)
                            bud.scale += .2
                        }
                    })
                    break
            }
        },
        applyPhysics: function (bud) {
            if (bud.torque !== 0) {
                if (bud.torque > 1)
                    bud.torque -= 5
                else
                    bud.torque += 5
            }
            if (bud.torque <= 5 && bud.torque >= -5)
                bud.torque = 0

            if (bud.action != "dragging") {
                let gravity = 10 * bud.scale
                let floor = window.innerHeight

                if (bud.floor != "window") {
                    let box = bud.floor.getBoundingClientRect()
                    floor = box.y + box.height
                }

                if (bud.y + bud.canvas.height < floor) {
                    bud.x += bud.velocity[0]
                    bud.y += gravity + bud.velocity[1]
                    bud.velocity = bud.velocity.map(v => {
                        let decay = 2
                        if (v == 0) return v
                        if (v < 0) {
                            if (v + decay > 0) return 0
                            return v + decay
                        }
                        if (v > 0) {
                            if (v - decay < 0) return 0
                            return v - decay
                        }
                    })
                }

                //reset velocity if on the floor
                if (bud.actionData.floored) {
                    bud.velocity = [0, 0]
                }
                //cap velocity
                let cap = 75
                if (bud.velocity[0] < -cap) bud.velocity[0] = -cap
                if (bud.velocity[1] < -cap) bud.velocity[1] = -cap
                if (bud.velocity[0] > cap) bud.velocity[0] = cap
                if (bud.velocity[1] > cap) bud.velocity[1] = cap
                //bounce of walls 
                if (bud.x + bud.canvas.width > window.innerWidth) {
                    bud.x = window.innerWidth - bud.canvas.width
                    bud.velocity[0] *= -1
                }
                if (bud.x < 0) {
                    bud.x = 0
                    bud.velocity[0] *= -1
                }
                if (bud.y + bud.canvas.height > window.innerHeight) {
                    bud.y = window.innerHeight - bud.canvas.height
                    bud.velocity[1] *= -1
                }
                if (bud.y < 0) {
                    bud.y = 0
                    bud.velocity[1] *= -1
                }
            }
        },
        clear: function () {
            this.buds.forEach(bud => {
                this.cleanActions(bud)
                bud.canvas.remove()
            })
            this.buds = []
        },
        renderLoop: function () {
            setInterval(function () {
                this.buds.forEach((bud) => {
                    this.updateAnimation(bud)
                    this.updatePosition(bud)
                    this.applyPhysics(bud)
                    this.updateAction(bud)
                    this.updateActionData(bud)
                    this.applyAction(bud)
                })
            }.bind(this), 1000 / 60)
        },
        settings: {
            autoSpawn: true,
            grow: false,
            multiply: false,
            steal: true
        },
        favs: ["my-hero-academia-katsuki-bakugo-kacchan-by-superevey"],
        setup: async function () {
            this.spritesheets = await this.spritesheets

            if (this.settings.autoSpawn) {
                for (let character of this.favs) {
                    this.spawn(character)
                }
            }

            this.renderLoop()
        }
    }
})()


browser.storage.sync.get(["settings", "favs"], function (items) {
    if (items["settings"])
        shimeji.settings = items.settings
    if (items["favs"])
        shimeji.favs = items.favs

    shimeji.setup()
});


browser.runtime.onMessage.addListener((req, sender, reply) => {
    if (req.type == "spawn") shimeji.spawn(req.payload)
    if (req.type == "clear") shimeji.clear()
    if (req.type == "ping") reply("im awake")
    if (req.type == "refresh settings") {
        browser.storage.sync.get(["settings"], function (obj) {
            shimeji.settings = obj.settings
        })
    }
    if (req.type == "spawn favorites") {
        for (let character of shimeji.favs) {
            shimeji.spawn(character)
        }
    }

    return true
})


function ContextMenu() {
    return (
        <section>
            <button>Remove</button>
            <button>Remote Control</button>
        </section>
    )
}






