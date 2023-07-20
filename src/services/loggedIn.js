import {getCookie} from './CookiesHandler';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {getObject} from "../requests/crudOperations";

export function loggedIn() {
    const currentUser = getCookie('CurrentUser');
    const Authorization = getCookie('Authorization');
    if (currentUser && Authorization) {
        // User is already logged in
        return currentUser;
    }
    // User is not logged in
    return false;
}

export function authorize() {
    const currentUser = loggedIn();
    if (loggedIn())
        return currentUser;

    //alert('You need to login before continuing. Redirecting to login page...');
    toast.error('You need to login before continuing. Redirecting to login page...');
    window.location.href = '/';
}

// Although the user's abilities are stored in the CurrentUser cookie,
// we need to check if the user is logged in and get the abilities from the server
// so that we can be sure that the user's abilities are up to date
export async function userAbilities() {
    const currentUser = getCookie('CurrentUser');
    let abilities = {can: {manage: false, create: false, read: false, update: false, delete: false}};
    if (currentUser) {
        try {
            const userProfile = await getObject('users', currentUser.id);
            return userProfile['data']['meta']['permissions'];
        } catch (error) {
            console.log(error)
        }
    }
    return abilities;
}



