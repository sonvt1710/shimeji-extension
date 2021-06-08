import React from 'react'
import ReactDOM from "react-dom"
import {Root,Settings} from "./pages"
import {BrowserRouter,Route,Redirect} from "react-router-dom"


function App(){
    return (
        <BrowserRouter>
            <Route exact path=""><Redirect to="/home" /></Route>
            <Route exact path="/"><Redirect to="/home" /></Route>
            <Route path="/home" component={Root}/>
            <Route path="/settings" component={Settings}/>
        </BrowserRouter>
    )   
}


ReactDOM.render(<App/>,document.getElementById("root"))







