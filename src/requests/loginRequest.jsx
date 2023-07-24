import {toast} from "react-toastify";
import {setCookie} from "../services/CookiesHandler";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export async function loginRequest(data, client_id) {
    await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/api/v1/omniauth_callbacks/auth/${client_id}`,
        data,
        {headers: {'Content-Type': 'application/json'}}
    ).then((response) => {
        const data = response.data.data.attributes
        if (response.status === 200) {
            toast.success("You have successfully logged in!");
            // Store the token in a cookie that expires in 7 days
            setCookie('Authorization', response.data.data.meta.authentication_token, 7);
            setCookie('CurrentUser', response.data.data.attributes, 7);
            setTimeout(() => {
                window.location.href = '/profile';
            }, 2000);
        } else {
            console.log(response.data.data.attributes.attribute_errors);
        }
    }).catch((error) => {
        console.log(error.response.data);
        const error_message = error.response.data.data.attributes.attribute_errors.email.message;
        toast.error(error_message);
    });
}