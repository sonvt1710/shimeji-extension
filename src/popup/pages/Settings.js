import React, { useState,useEffect } from 'react'
import { Nav } from "../components"
import {fireMessage,browser} from "../../browser"
import styled from "styled-components"
import BootstrapSwitchButton from 'bootstrap-switch-button-react'


const SettingsStyle = styled.main`
    section{
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
      
        &>div{
            width:50vw;
            height:40px;
            margin:20px 0;
            display:flex;
            justify-content:space-between;
            align-items:center;
        }
    }
`


export function Settings() {
    let [settings, setSettings] = useState({})

    useEffect(()=>{
        let savedSettings = localStorage.getItem("settings")

        if(savedSettings)
            savedSettings = JSON.parse(savedSettings)
        else{
            let defaultSettings = {
                multiply:false,
                grow:false,
                autoSpawn:true
            }
            localStorage.setItem("settings",JSON.stringify(defaultSettings))
            browser.storage.sync.set({"settings":defaultSettings})
            savedSettings = defaultSettings
        }

        setSettings(savedSettings)
        browser.storage.sync.set({"settings":savedSettings})
    },[])

    function updateSettings(name,value){
        let newSettings = {
            ...settings,
            [name]:value
        }
        localStorage.setItem("settings",JSON.stringify(newSettings))
        setSettings(newSettings)
        browser.storage.sync.set({"settings":newSettings})

        fireMessage("refresh settings")
    }

    return (
        <SettingsStyle>
            <Nav />
            <section>
                <h1>Settings</h1>
                <hr />

                <div>
                    Allow characters to multiply
                    <BootstrapSwitchButton
                        checked={!!settings["multiply"]}
                        onlabel='On'
                        offlabel='Off'
                        onstyle="primary"
                        onChange={(checked) => {
                            updateSettings("multiply",checked)
                        }}
                    />
                </div>

                <div>
                    Allow characters to grow
                    <BootstrapSwitchButton
                        checked={!!settings["grow"]}
                        onlabel='On'
                        offlabel='Off'
                        onstyle="primary"
                        onChange={(checked) => {
                            updateSettings("grow",checked)
                        }}
                    />
                </div>

                <div>
                    Automatically spawn favorite characters on new tabs
                    <BootstrapSwitchButton
                        checked={!!settings["autoSpawn"]}
                        onlabel='On'
                        offlabel='Off'
                        onstyle="primary"
                        onChange={(checked) => {
                            updateSettings("autoSpawn",checked)
                        }}
                    />
                </div>
            </section>
        </SettingsStyle>
    )
}
