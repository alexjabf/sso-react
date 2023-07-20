import './App.css';
import RoutesWrapper from './components/RoutesWrapper';
import NavigationBar from "./components/NavigationBar";
import Footer from "./components/Footer";
import {ToastContainer} from "react-toastify";
import React from "react";
const App = () => {
    return (
        <>
            <NavigationBar/>
            <RoutesWrapper/>
            <Footer/>
            <ToastContainer/>
        </>
    );
};

export default App;
