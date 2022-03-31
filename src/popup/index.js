import { BrowserRouter, Route, Redirect } from "react-router-dom"
import { Home, Settings, Premium } from "./pages"
import React, { useEffect } from 'react'
import mixpanel from 'mixpanel-browser'
import ReactDOM from "react-dom"


function App() {
    useEffect(() => {
        mixpanel.init('4e5e9d12655f81fb74970ed8ae776ef9')
        mixpanel.track("Popup Opened")
    }, [])

    return (
        <BrowserRouter>
            <Route exact path=""><Redirect to="/home" /></Route>
            <Route exact path="/"><Redirect to="/home" /></Route>
            <Route path="/home" component={Home} />
            <Route path="/settings" component={Settings} />
            <Route path="/premium" component={Premium} />
        </BrowserRouter>
    )
}


ReactDOM.render(<App />, document.getElementById("root"))







