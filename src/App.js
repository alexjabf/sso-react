import './App.css';
import RoutesWrapper from './components/RoutesWrapper';
import NavigationBar from "./components/NavigationBar";
import Footer from "./components/Footer";
import {ToastContainer} from "react-toastify";
import React, {useState} from "react";
import {Auth0Provider} from "@auth0/auth0-react";

const App = () => {
    const setAuthConfig = async (tmpClient) => {
        setClient(tmpClient);
    }

    const [client, setClient] = useState({
        default_scope: 'openid profile email',
        domain: '' || process.env.REACT_APP_AUTH0_DOMAIN,
        clientId: '' || process.env.REACT_APP_AUTH0_CLIENT_ID,
        redirectUri: '' || process.env.REACT_APP_AUTH0_REDIRECT_URI,
        audience: '' || process.env.REACT_APP_AUTH0_AUDIENCE
    });

    return (
        <>
            <Auth0Provider
                key={client.value}
                domain={client.domain.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '')}
                clientId={client.clientId}
            >
                <NavigationBar/>
                <RoutesWrapper authConfig={setAuthConfig} client={client}/>
                <Footer/>
                <ToastContainer/>
            </Auth0Provider>
        </>
    );
};

export default App;
