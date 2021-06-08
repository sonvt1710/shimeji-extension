import React from 'react'
import styled from "styled-components"
import {Link} from "react-router-dom"
import {GoGear} from "react-icons/go"
import {AiFillHome} from "react-icons/ai"
import { useLocation } from 'react-router-dom'



const NavStyle = styled.nav`
    height:45px;
    min-height:45px;
    display:flex;
    justify-content:flex-start;
    align-items:center;
    background:var(--white);
    padding:0 15px;

    &>*{
        margin-right:10px;
    }

    a{
        height:100%;
        text-decoration:none;
        display:flex;
        align-items:center;
        justify-content:center;
        border-radius:15px 15px 0 0;
        padding:0 10px;

        &.active,&:hover{
            background:linear-gradient(45deg,hsl(138deg 62% 85%),hsl(207deg 46% 85%));
        }
        &.active{
            color:var(--blue);
        }

        svg{
            height:18px;
            width:18px;
            margin-right:5px;
        }
    }
    
`


export function Nav() {
    const location = useLocation()
    let url = location.pathname;

    return (
        <NavStyle>
            <Link to="/home" className={url === "/home" ? "active" : ""}>
              <AiFillHome/>
              Home
            </Link>
            <Link to="/settings" className={url === "/settings" ? "active" : ""}>
               <GoGear/>
               Settings
            </Link>    
        </NavStyle>
    )
}
