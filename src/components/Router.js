import React, {useState} from "react";
import {
    HashRouter as Router,
    Route,
    Switch
} from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";

// 인중 로그인 여부에 따라 달라짐
const AppRouter = ({ isLoggedIn }) => {

    return(
        <Router>
            <Switch>
                {isLoggedIn ?(
                    <>
                    <Route exact path = "/">
                        <Home/>
                    </Route>
                    </>
                ): (
                    <Route exact path = "/">
                        <Auth/>
                    </Route>
                    )
                }
            </Switch>
        </Router>
    )
}

export default AppRouter;