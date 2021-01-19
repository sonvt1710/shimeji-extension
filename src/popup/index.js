import React,{useState,useEffect} from "react"
import ReactDOM from "react-dom"
import {fireMessage,browser} from "../browser"
import spritesheet_data from "../spritesheets"
import styled from "styled-components"


function queue(func,self){
    return new Promise((res,rej)=>{
        setTimeout(()=>{
            res(func.call(self))
        },10)
    })
}


let HeaderStyle = styled.header`
    height:50%;
    display:flex;

    .settings{
        width:25%;

        &>*{
            margin:5%;
        }
        button,label{
            width:90%;
            box-sizing:border-box;
        }
    }
    .sprite{
        width:50%;
        display:flex;
        flex-direction:column;
        justify-content:space-evenly;
        align-items:center;

        pre{
            color:#238bdc;
            margin:0;
            font-size:20px;
            white-space:normal;
            text-align:center;
        }

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
        
        .fav{
            height:50px;
            width:50px;
            margin-top:5px;
            border-radius:50%;
            border:2px solid #ffde25;
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

function Header(props){
    let [canvas,setCanvas] = useState(null)
    let [favs,setFavs] = useState([])
    let autoSpawnCheck = !(localStorage.getItem("autoSpawn") === "false")
    
    useEffect(()=>{
        if(props.activeSprite !== null){       
            let ctx = canvas.getContext("2d")
            let sprite = props.spritesheets[props.activeSprite]
            let img = sprite.img
            let {x,y,height,width} = sprite.atlas[sprite.actions.walk[0]]

            canvas.height = height
            canvas.width = width
            ctx.clearRect(0,0,canvas.width,canvas.height)
            ctx.drawImage(img,x,y,width,height,0,0,width,height)
        }
    },[props.activeSprite])

    useEffect(()=>{
        if(!Object.keys(props.spritesheets).length) return 

        if(localStorage.getItem("favs")){
            setFavs(JSON.parse(localStorage.getItem("favs")))
        }
    },[props.spritesheets])

    function handleSpawn(){
        fireMessage("changeSprite",props.activeSprite)
        fireMessage("spawn")
    }

    function handleClear(){
        fireMessage("clear")
    }

    function handleFavorite(){
        if(props.activeSprite === null) return

        let localFavs = localStorage.getItem("favs")
        let favs = localFavs ? JSON.parse(localFavs) : false || []
        favs.unshift(props.activeSprite)
        favs = favs.slice(0,5)
        localStorage.setItem("favs",JSON.stringify(favs))
        setFavs(favs)
    }

    function handleClearFavorites(){
        localStorage.setItem("favs","[]")
        setFavs([])
    }

    function handleAutoSpawn(e){
        let check = e.target.checked
        localStorage.setItem("autoSpawn", check)
        
        browser.storage.sync.set({"autoSpawn":check}, function() {
        });
    }

    function handleSetAutoSpawn(){
        if(props.activeSprite === null) return

        browser.storage.sync.set({"autoSpawnIndex":props.activeSprite}, function() {
        });
    }

    
    let favBoxes = favs.map((name)=>{
        let {x,y,height,width} = props.spritesheets[name].atlas[props.spritesheets[name].actions.walk[0]]
        return (
            <div className="fav @grow">
            <canvas 
            onClick={()=>props.setActiveSprite(name)}
            ref={(canvas)=>{
                if(!canvas) return 
                let ctx = canvas.getContext("2d")
                let img = props.spritesheets[name].img 
                ctx.clearRect(0,0,canvas.width,canvas.height)
                ctx.drawImage(img,x,y,width,height,0,0,width,height)
            }} height={height} width={width}></canvas>
            </div>
        )
    }) 
    

    return (
        <HeaderStyle>
            <section className="settings">
                <label htmlFor="autoSpawn">
                    <input defaultChecked={!!autoSpawnCheck} name="autoSpawn" type="checkbox" onChange={handleAutoSpawn}/>
                    Auto Spawn
                </label>
                <button onClick={handleSetAutoSpawn}>Set Spawn Character</button>
                <button onClick={handleFavorite}>Save in Favorites</button>
                <button onClick={handleClearFavorites} className="red">Clear Favorites</button>
                <button onClick={handleClear} className="red">Clear Active</button>
            </section>

            <section className="sprite">
                <pre>{props.activeSprite ? props.activeSprite.split("-").join(" ") : " "}</pre>
                <canvas ref={e=>{setCanvas(e)}}></canvas>
                <button onClick={handleSpawn}>Spawn</button>
            </section>

            <section className="favs">
                {favBoxes}
            </section>
        </HeaderStyle>
    )
}





let SpritesStyle = styled.div`
    height:50%;
    display:flex;
    flex-direction:column;

    .spriteBox{
        width:532px;
        margin:auto;
        display:flex;
        flex-wrap:wrap;
        overflow:auto;
    }

    .sprite{
        height:50px;
        width:40px;
        margin:4px;
        overflow:hidden;
        display:flex;
        justify-content:center;
        background:linear-gradient(45deg,#b5e2f2,#238bdc);
        border:2px solid #333;
        
        canvas{
            height:75px;
        }
    }

    .placeholder{
        height:50px;
        width:40px;
        margin:4px;
        border:2px solid white;
        border-radius:5px;
    }

    .animate {
        animation : shimmer 5s infinite alternate;
        background: linear-gradient(45deg, #eff1f3 10%, #e2e2e2 25%, #eff1f3 36%);
        background-size: 1000px 100%;
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

function Sprites(props){
    let [sprites,setSprites] = useState([])
    let [canvasRefs,setCanvasRefs] = useState({})

    useEffect(async ()=>{
        if(!Object.keys(props.spritesheets).length) return

        let tempSprites = []
        let refs = {}
        for(let name in props.spritesheets){
            await queue(()=>{
                let {x,y,height,width} = props.spritesheets[name].atlas[props.spritesheets[name].actions.walk[0]]
                 tempSprites.push((
                    <div 
                        className="sprite @grow"> 
                        <canvas  
                        onClick={()=>props.setActiveSprite(name)}
                        ref={(canvas)=>{
                            if(!canvas) return
                            refs[name] = canvas
                            let ctx = canvas.getContext("2d")
                            let img = props.spritesheets[name].img
                            ctx.clearRect(0,0,canvas.width,canvas.height)
                            ctx.drawImage(img,x,y,width,height,0,0,width,height)
                        }} height={height} width={width}></canvas>
                    </div>
                 ))
            },this)

            if(tempSprites.length % 75 === 0){
                setSprites([...tempSprites])
            }
        }
       
        setSprites([...tempSprites])
        setCanvasRefs(refs)

    },[props.spritesheets])

    function handleSearch(e){
        if(!sprites.length) return 
        let value = e.target.value.trim().toLowerCase()

        for(let refName in canvasRefs){
            let ref = canvasRefs[refName]
            let valid = false
            let keywords = refName.toLowerCase().split("-")

            keywords.forEach(word=>{
                if(value === ""){
                    valid = true
                    return 
                }
                valid = valid || value.split(" ").reduce((acc,val)=>{
                    return acc || word.startsWith(val)
                },false)
            })
            
            if(!valid)
                ref.parentNode.style.display = "none"
            else
                ref.parentNode.style.display = "flex"
        }
    }
    
    return (
        <SpritesStyle className="Sprites">
            <input type="text" 
            placeholder={(sprites.length == Object.keys(props.spritesheets).length) ? 
                `Search for Character (${Object.keys(props.spritesheets).length} Total)` : "Loading..."} 
            onChange={handleSearch}/>

            <div className="spriteBox">
                {sprites.length ? sprites : Array(40).fill(null).map((e,i)=>{
                    return (<div className="placeholder animate" key={i}></div>)  
                })}
            </div>
        </SpritesStyle>
    )
}




let AppStyle = styled.main`
    height:100%;
    width:100%;
    display:flex;
    flex-direction:column;
    background:#b5e2f275;
    overflow:hidden;
`

function App(){
    let [activeSprite,setActiveSprite] = useState(null)
    let [spritesheets,setSpritesheets] = useState({})

    useEffect(()=>{
        spritesheet_data.then(sheet=>{
            setSpritesheets(sheet)
        })
    },[])

    return (
        <AppStyle>
            <Header {...{activeSprite,setActiveSprite,spritesheets}}/>
            <Sprites {...{setActiveSprite,spritesheets}}/>
        </AppStyle>
    )
}

ReactDOM.render(<App/>,document.getElementById("root"))







