import React from "react";
import {Nav} from 'react-bootstrap';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { deleteCookie } from '../services/CookiesHandler';
import axios from "axios";

const Logout = () => {
    const delay = ms => new Promise(
        resolve => setTimeout(resolve, ms)
    );
    const handleLogout = async () => {
        try {
            await axios.delete(
                `${process.env.REACT_APP_API_ENDPOINT}/api/v1/logout`,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true,
                }
            );

            toast.success("You have successfully logged out!");
            deleteCookie('Authorization');
            deleteCookie('CurrentUser');
            await delay(2000);
            window.location.href = '/';
        } catch (error) {
            console.log(error);
            toast.error('Failed to login. Please try again.');
        }
    };


        return (
            <div>
                <Nav.Link onClick={handleLogout} className='text-light'>Logout</Nav.Link>
                <ToastContainer/>
            </div>
        );

};

export default Logout;