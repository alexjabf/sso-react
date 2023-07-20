import axios from 'axios';
import {toast} from "react-toastify";

export async function getObjects(controller, filterValues: {page: 1, perPage: 10, sort_by: 'id', order: 'asc'}) {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_API_ENDPOINT}/api/v1/${controller}`,
            headers(filterValues)
        );

        return response.data;
    } catch (error) {
        handleErrors(error)
    }
}

export async function getObject(controller, id) {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_API_ENDPOINT}/api/v1/${controller}/${id}`,
            headers()
        );

        return response.data;
    } catch (error) {
        handleErrors(error)
    }
}

export async function createObject(controller, formatData) {
    let success = false;
    try {
        await axios.post(
            `${process.env.REACT_APP_API_ENDPOINT}/api/v1/${controller}`,
            formatData,
            headers()
        );
        toast.success('Successfully created.');
        success = true;
    } catch (error) {
        handleErrors(error)
    }

    return success;
}

export async function updateObject(controller, formatData, id) {
    let success = false;
    try {
        await axios.patch(
            `${process.env.REACT_APP_API_ENDPOINT}/api/v1/${controller}/${id}`,
            formatData,
            headers()
        );
        toast.success('Successfully updated.');
        success = true;
    } catch (error) {
        handleErrors(error)
    }

    return success;
}

export async function deleteObject(controller, id) {
    let success = false;
    const confirmed = window.confirm('Are you sure you want to delete this record?');

    if (confirmed) {
        try {
            await axios.delete(
                `${process.env.REACT_APP_API_ENDPOINT}/api/v1/${controller}/${id}`,
                headers()
            );
            toast.success('Successfully deleted.');
            success = true;
        } catch (error) {
            handleErrors(error)
        }
    }

    return success;
}

function headers(filterValues) {
    return {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        params: filterValues,
        withCredentials: true,
    }
}

function handleErrors(error) {
    let error_message = '';
    if (error.response.status === 422) {
        error_message = concatErrorMessages(error.response.data.data.attributes.errors);
    } else {
        error_message = error.response.data.data.message;
    }
    toast.error(error_message);
}

const concatErrorMessages = (errorsHash) => {
    return Object.entries(errorsHash).map(([key, errors]) => {
        return `${key.replace(/_/g, ' ')}: ${errors.join(', ')}.`;
    }).join('. ');
};