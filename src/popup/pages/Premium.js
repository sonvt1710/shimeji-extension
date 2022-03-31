import mixpanel from "mixpanel-browser"
import styled from "styled-components"
import { Nav } from "../components"
import React, { useEffect } from "react"


const PremiumStyle = styled.main`
    section{
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
    
        & > div{
            width:50vw;
            height:40px;
            margin:20px 0;
            display:flex;
            justify-content:space-between;
            align-items:center;
        }
    }
`

export function Premium() {
    useEffect(() => {
        mixpanel.track("Premium")
    }, [])

    return (
        <PremiumStyle>
            <Nav />

            <section>
                <h1>Premium</h1>
                <hr />

                <p>
                    Coming soon, are there any features you wish Sugoi Shimeji had? <br /> 
                    <a href="https://forms.gle/JEhWxmq4DRj2GZhMA" target="_blank" onClick={() => mixpanel.track("Form Submit")}>Submit them here.</a>
                </p>
            </section>
        </PremiumStyle>
    )
}