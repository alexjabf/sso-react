import {Route, Routes} from "react-router-dom";
import HomePage from "../pages/HomePage";
import React from "react";

const RoutesWrapper = () => {
    return (
            <Routes>
                <Route exact path="/" element={<HomePage/>}/>
            </Routes>
    )
}

export default RoutesWrapper;