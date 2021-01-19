/*! For license information please see index.js.LICENSE.txt */
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
`;function _h(i){let[e,s]=(0,h.useState)(null),[p,m]=(0,h.useState)([]),t=!("false"===localStorage.getItem("autoSpawn"));(0,h.useEffect)((()=>{if(null!==i.activeSprite){let h=e.getContext("2d"),g=i.spritesheets[i.activeSprite],n=g.img,{x:s,y:p,height:m,width:t}=g.atlas[g.actions.walk[0]];e.height=m,e.width=t,h.clearRect(0,0,e.width,e.height),h.drawImage(n,s,p,t,m,0,0,t,m)}}),[i.activeSprite]),(0,h.useEffect)((()=>{Object.keys(i.spritesheets).length&&localStorage.getItem("favs")&&m(JSON.parse(localStorage.getItem("favs")))}),[i.spritesheets]);let d=p.map((e=>{let{x:g,y:n,height:s,width:p}=i.spritesheets[e].atlas[i.spritesheets[e].actions.walk[0]];return h.createElement("div",{className:"fav @grow"},h.createElement("canvas",{onClick:()=>i.setActiveSprite(e),ref:h=>{if(!h)return;let m=h.getContext("2d"),t=i.spritesheets[e].img;m.clearRect(0,0,h.width,h.height),m.drawImage(t,g,n,p,s,0,0,p,s)},height:s,width:p}))}));return h.createElement(Gh,null,h.createElement("section",{className:"settings"},h.createElement("label",{htmlFor:"autoSpawn"},h.createElement("input",{defaultChecked:!!t,name:"autoSpawn",type:"checkbox",onChange:function(h){let i=h.target.checked;localStorage.setItem("autoSpawn",i),g.storage.sync.set({autoSpawn:i},(function(){}))}}),"Auto Spawn"),h.createElement("button",{onClick:function(){null!==i.activeSprite&&g.storage.sync.set({autoSpawnIndex:i.activeSprite},(function(){}))}},"Set Spawn Character"),h.createElement("button",{onClick:function(){if(null===i.activeSprite)return;let h=localStorage.getItem("favs"),e=h?JSON.parse(h):[];e.unshift(i.activeSprite),e=e.slice(0,5),localStorage.setItem("favs",JSON.stringify(e)),m(e)}},"Save in Favorites"),h.createElement("button",{onClick:function(){localStorage.setItem("favs","[]"),m([])},className:"red"},"Clear Favorites"),h.createElement("button",{onClick:function(){n("clear")},className:"red"},"Clear Active")),h.createElement("section",{className:"sprite"},h.createElement("pre",null,i.activeSprite?i.activeSprite.split("-").join(" "):" "),h.createElement("canvas",{ref:h=>{s(h)}}),h.createElement("button",{onClick:function(){n("changeSprite",i.activeSprite),n("spawn")}},"Spawn")),h.createElement("section",{className:"favs"},d))}let Ph=Fh.div`
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
`;function Mh(i){let[e,g]=(0,h.useState)([]),[n,s]=(0,h.useState)({});return(0,h.useEffect)((async()=>{if(!Object.keys(i.spritesheets).length)return;let e=[],n={};for(let s in i.spritesheets)await Uh((()=>{let{x:g,y:p,height:m,width:t}=i.spritesheets[s].atlas[i.spritesheets[s].actions.walk[0]];e.push(h.createElement("div",{className:"sprite @grow"},h.createElement("canvas",{onClick:()=>i.setActiveSprite(s),ref:h=>{if(!h)return;n[s]=h;let e=h.getContext("2d"),d=i.spritesheets[s].img;e.clearRect(0,0,h.width,h.height),e.drawImage(d,g,p,t,m,0,0,t,m)},height:m,width:t})))}),this),e.length%75==0&&g([...e]);g([...e]),s(n)}),[i.spritesheets]),h.createElement(Ph,{className:"Sprites"},h.createElement("input",{type:"text",placeholder:e.length==Object.keys(i.spritesheets).length?`Search for Character (${Object.keys(i.spritesheets).length} Total)`:"Loading...",onChange:function(h){if(!e.length)return;let i=h.target.value.trim().toLowerCase();for(let h in n){let e=n[h],g=!1;h.toLowerCase().split("-").forEach((h=>{g=""===i||g||i.split(" ").reduce(((i,e)=>i||h.startsWith(e)),!1)})),e.parentNode.style.display=g?"flex":"none"}}}),h.createElement("div",{className:"spriteBox"},e.length?e:Array(40).fill(null).map(((i,e)=>h.createElement("div",{className:"placeholder animate",key:e})))))}let Bh=Fh.main`
    height:100%;
    width:100%;
    display:flex;
    flex-direction:column;
    background:#b5e2f275;
    overflow:hidden;
`;function Hh(){let[i,e]=(0,h.useState)(null),[g,n]=(0,h.useState)({});return(0,h.useEffect)((()=>{p.then((h=>{n(h)}))}),[]),h.createElement(Bh,null,h.createElement(_h,{activeSprite:i,setActiveSprite:e,spritesheets:g}),h.createElement(Mh,{setActiveSprite:e,spritesheets:g}))}i.render(h.createElement(Hh,null),document.getElementById("root"))})()})();