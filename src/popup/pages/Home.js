import React, { useState, useEffect } from "react"
import { fireMessage, browser } from "../../browser"
import spritesheet_data from "../../spritesheets"
import mixpanel from "mixpanel-browser"
import styled from "styled-components"
import { Nav } from "../components"


let HomeStyle = styled.main`
    height:100%;
    width:100%;
    display:flex;
    flex-direction:column;
    overflow:hidden;
`


export function Home() {
    let [activeSprite, setActiveSprite] = useState(null)
    let [spritesheets, setSpritesheets] = useState({})

    useEffect(() => {
        spritesheet_data.then(sheet => {
            setSpritesheets(sheet)
        })
    }, [])

    return (
        <HomeStyle>
            <Nav />
            <Header {...{ activeSprite, setActiveSprite, spritesheets }} />
            <Sprites {...{ setActiveSprite, spritesheets }} />
        </HomeStyle>
    )
}


let HeaderStyle = styled.header`
    min-height:calc(50% - 22.5px);
    display:flex;

    .settings{
        width:25%;

        button,label{
            width:90%;
            margin:5%;
            box-sizing:border-box;
        }

        .break{
            height:4px;
            width:40%;
            border-bottom:2px dashed var(--red);
            margin:0 auto;
        }
    }

    .sprite{
        width:50%;
        display:flex;
        flex-direction:column;
        justify-content:space-evenly;
        align-items:center;

        canvas{
            height:60%;
            max-width:100%;
        }

    }

    .favs{
        width:25%;
        display:flex;
        flex-direction:column;
        align-items:center;

        .favsBox{
            max-height:80%;
            display:flex;
            flex-direction:column;
            align-items:center;
            align-content:center;
            justify-content:flex-start;
            flex-wrap:wrap;
        }
        
        .fav{
            height:45px;
            width:45px;
            margin-top:5px;
            border:2px solid #ffde25;
            border-radius:10px 0 10px 0;
            background:linear-gradient(45deg,rgba(0,0,0,0),#ffde25);
            display:flex;
            justify-content:center;
            overflow:hidden;

            canvas{
                height:50px;
            }
        }
    }
`


function Header(props) {
    let [canvas, setCanvas] = useState(null)
    let [showWarning, setShowWarning] = useState(false)
    let [favs, setFavs] = useState([])

    useEffect(() => {
        fireMessage("ping", "are you there", (msg) => {
            if (!msg)
                setShowWarning(true)
        })
    }, [])

    useEffect(() => {
        if (props.activeSprite !== null) {
            let ctx = canvas.getContext("2d")
            let sprite = props.spritesheets[props.activeSprite]
            let img = sprite.img
            let { x, y, height, width } = sprite.atlas[sprite.actions.walk[0]]

            canvas.height = height
            canvas.width = width
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(img, x, y, width, height, 0, 0, width, height)
        }
    }, [props.activeSprite])

    useEffect(() => {
        if (!Object.keys(props.spritesheets).length) return

        let localFavs = []

        if (localStorage.getItem("favs")) {
            localFavs = JSON.parse(localStorage.getItem("favs"))
            setFavs(localFavs)
        } else {
            let defaultFavs = ["my-hero-academia-katsuki-bakugo-kacchan-by-superevey"]
            localFavs = defaultFavs
            localStorage.setItem("favs", JSON.stringify(defaultFavs))
            setFavs(defaultFavs)
        }

        browser.storage.sync.set({ "favs": localFavs })
    }, [props.spritesheets])

    function handleSpawn() {
        mixpanel.track(`Home: Spawn: ${props.activeSprite}`)
        fireMessage("spawn", props.activeSprite)
    }

    function handleClear() {
        fireMessage("clear")
    }

    function handleFavorite() {
        if (props.activeSprite === null) return

        let localFavs = localStorage.getItem("favs")
        let favs = localFavs ? JSON.parse(localFavs) : []
        favs.unshift(props.activeSprite)
        favs = favs.slice(0, 12)

        localStorage.setItem("favs", JSON.stringify(favs))
        browser.storage.sync.set({ "favs": favs })
        setFavs(favs)
    }

    function handleClearFavorites() {
        localStorage.setItem("favs", "[]")
        browser.storage.sync.set({ "favs": [] })
        setFavs([])
    }

    let favBoxes = favs.map((name) => {
        let { x, y, height, width } = props.spritesheets[name].atlas[props.spritesheets[name].actions.walk[0]]
        return (
            <div className="fav @grow">
                <canvas
                    onClick={() => props.setActiveSprite(name)}
                    ref={(canvas) => {
                        if (!canvas) return
                        let ctx = canvas.getContext("2d")
                        let img = props.spritesheets[name].img
                        ctx.clearRect(0, 0, canvas.width, canvas.height)
                        ctx.drawImage(img, x, y, width, height, 0, 0, width, height)
                    }} height={height} width={width}></canvas>
            </div>
        )
    })

    return (
        <HeaderStyle>
            <section className="settings">
                <h1>Actions</h1>
                <button onClick={handleFavorite}>Save in Favorites</button>
                <div className="break"></div>
                <button onClick={handleClearFavorites} className="red">Clear Favorites</button>
                <button onClick={handleClear} className="red">Clear Active Characters</button>
            </section>

            <section className="sprite">
                <h1>{props.activeSprite ? props.activeSprite.split("-").join(" ") : " "}</h1>
                <canvas ref={e => { setCanvas(e) }}></canvas>
                <button onClick={handleSpawn}>Spawn</button>
            </section>

            <section className="favs">
                <h1>Favorites</h1>
                <div className="favsBox">
                    {favBoxes}
                </div>
            </section>

            <aside class={`bg-warning p-3 fixed-top w-100 ${showWarning ? "d-flex" : "d-none"}`}>
                <b class="text-white">Sugoi Shimeji is not allowed to run on the current page, please try a different website.</b>
            </aside>
        </HeaderStyle>
    )
}


let SpritesStyle = styled.div`
    min-height:calc(50% - 22.5px);
    margin:10px 0;
    display:flex;
    flex-direction:column;

    .spriteBox{
        width:532px;
        margin:0 auto;
        display:flex;
        flex-wrap:wrap;
        overflow:auto;
    }

    .sprite{
        height:80px;
        width:42.5px;
        margin:4px;
        overflow:hidden;
        display:flex;
        justify-content:center;
        border:2px solid var(--blue);
        border-radius:10px 0 10px 0;
        background:linear-gradient(45deg,rgba(0,0,0,0),var(--blue));
        
        img{
            height:75px;
        }
    }

    input{
        min-height:45px;
        text-align:center;
        border-radius: 10px 0 10px 0;
        transition:.25s ease;
    }

    input:focus{
        outline:none;
        border:2px solid #333;
    }
`

function Sprites(props) {
    let [sprites, setSprites] = useState([])

    useEffect(() => {
        let initialSprites = []

        let index = 0
        for (let name in props.spritesheets) {
            initialSprites.push([name, index, true])
            index++
        }

        setSprites(initialSprites)
    }, [props.spritesheets])

    function handleSearch(e) {
        let newSpriteArray = []
        let usersSearch = e.target.value.trim().toLowerCase()

        sprites.forEach(([name, index, flag]) => {
            let valid = true
            usersSearch.split(" ").forEach(keyword => {
                if (!name.trim().toLowerCase().includes(keyword))
                    valid = false
            })

            if (usersSearch === "")
                valid = true

            newSpriteArray.push([name, index, valid])
        })

        setSprites(newSpriteArray)
    }

    return (
        <SpritesStyle className="Sprites">
            <input type="text"
                placeholder={`Search for Character (${Object.keys(props.spritesheets).length} Total)`}
                onChange={handleSearch} />

            <div className="spriteBox">
                {sprites.filter(arr => arr[2]).map(([name, index, flag]) => {
                    return (
                        <div className="sprite @grow" onClick={() => props.setActiveSprite(name)}>
                            <img src={`/media/sprites/sprite${index}.webp`} />
                        </div>
                    )
                })}
            </div>
        </SpritesStyle>
    )
}


