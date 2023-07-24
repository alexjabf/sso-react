import React from "react";
import {Route, Routes} from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";
import UserProfilePage from "../pages/UserProfilePage";
import CreateClientPage from "../pages/CreateClientPage";
import ClientsPage from "../pages/ClientsPage";

const RoutesWrapper = ({authConfig, client}) => {
    return (
            <Routes>
                <Route exact path="/" element={<HomePage/>}/>
                <Route path="/login" element={<LoginPage authConfig={authConfig} client={client}/>}/>
                <Route path="/signup" element={<SignUpPage/>}/>
                <Route path="/profile" element={<UserProfilePage/>}/>
                <Route path="/create-client" element={<CreateClientPage/>}/>
                <Route path="/edit-client/:id" element={<CreateClientPage/>}/>
                <Route path="/clients" element={<ClientsPage/>}/>
            </Routes>
    )
}

export default RoutesWrapper;