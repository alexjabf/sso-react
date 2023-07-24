import {useAuth0} from '@auth0/auth0-react';
import React, {useEffect, useState} from "react";
import Select from 'react-select';
import {ToastContainer} from "react-toastify";
import {Button, Card, Col, Form, Modal, Row} from "react-bootstrap";
import axios from "axios";
import {loginRequest} from "../requests/loginRequest";
import {getCookieAuth0} from "../services/CookiesHandler";

const Auth0Login = ({authConfig, client}) => {
    const [clients, setClients] = useState([]);
    const [clientSelected, setClientSelected] = useState(client.value !== undefined);
    const {loginWithPopup} = useAuth0();
    const [showModal, setShowModal] = useState(false);
    const [formValues, setFormValues] = useState({});

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_ENDPOINT}/api/v1/clients/all`,)
            .then((response) => {
                setClients(response.data);
            })
            .catch((error) => {
                console.error('Error fetching companies:', error);
            });
    }, []);

    const handleClientChange = async (selectedClient) => {
        await authConfig(selectedClient);
        setClientSelected(true);
    };

    const Auth0logIn = async () => {
        await loginWithPopup();
        try {
            const data = {custom_fields:  formValues, access_token: await getAccessTokenSilently()}
            console.log(data)
            loginRequest(data, client.value)
                .then((response) => {
                    console.log(response);
                })
                .catch((error) => {
                    console.error(error);
                });
        } catch (error) {
            console.error(error);
        }
    };

    const logIn = async () => {
        await authConfig(client);
        const auth0_cookie = getCookieAuth0('auth0')
        if (!auth0_cookie && client && client.custom_fields && client.custom_fields.length > 0) {
            setShowModal(true);
        } else {
            await Auth0logIn();
        }
    };

    const {getAccessTokenSilently} = useAuth0();

    const saveFormValues = async () => {
        await Auth0logIn();
        handleClose();
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value
        }));
    };

    const handleClose = () => {
        setShowModal(false);
    };


    return (
        <div>
            <ToastContainer/>
            <Card>
                <Card.Header className='bg-dark text-light'>
                    <Card.Title>Client Sign In</Card.Title>
                </Card.Header>
                <Card.Body>
                    <small className="text-muted">Select a client to sign in with. This is only to simulate the flow
                        where the user is coming from one of the registered clients.</small>
                    <Select
                        options={clients.map((client) => ({
                            value: client.id,
                            provider: client.provider,
                            default_scope: client.default_scope,
                            domain: client.domain,
                            audience: client.audience,
                            redirectUri: client.redirect_uri,
                            clientId: client.client_key_frontend,
                            client_secret: client.client_secret_frontend,
                            custom_fields: client.custom_fields,
                            label: client.name,
                        }))}
                        value={client}
                        onChange={handleClientChange}
                        placeholder="Select a client"
                        className={'mb-3'}
                        isClearable
                    />
                    {(client.value !== undefined) && (
                        <div>
                            <p><strong>Selected Client:</strong></p>
                            <p>Client Id: {client.value}</p>
                            <p>Client Name: {client.label}</p>
                            <p>Client Provider: {client.provider}</p>
                            <p>Client
                                Domain: {client.domain.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '')}</p>
                            <p>Client Custom Fields:</p>
                            {client.custom_fields.map((field, index) => (
                                <ol>
                                    <li key={index}>
                                        <Row className='mb-2'>
                                            <Col md={3}>
                                                {field.name} - {field.type}{' '}
                                            </Col>
                                        </Row>
                                    </li>
                                </ol>
                            ))}
                        </div>
                    )}
                    <Card.Text>
                        <Button variant={'primary'} onClick={() => logIn()} disabled={!clientSelected}>
                            Log In
                        </Button>
                    </Card.Text>
                </Card.Body>
            </Card>
            {client.custom_fields && client.custom_fields.length > 0 && (
                <Modal show={showModal} onHide={handleClose}>
                    <Modal.Header closeButton className='bg-dark text-light'>
                        <Modal.Title>Additional Information</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* Dynamically generate form fields from the clientFields array */}
                        <Form>
                            {client.custom_fields.map((field, index) => (
                                <Form.Group key={index} controlId={field.name}>
                                    <Form.Label>{field.name}</Form.Label>
                                    <Form.Control
                                        key={index}
                                        type={field.type}
                                        name={field.name}
                                        value={formValues[field.name] || ''}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            ))}
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={saveFormValues}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    )
        ;
};

export default Auth0Login;
