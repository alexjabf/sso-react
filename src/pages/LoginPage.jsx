import React, {useState} from 'react';
import {Form, Button, Card} from 'react-bootstrap';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import axios from "axios";
import { setCookie }  from '../services/CookiesHandler';
import { useNavigate } from 'react-router-dom';
import {toast, ToastContainer} from "react-toastify";
import Auth0Login from "../components/Auth0Login";
import {loggedIn} from "../services/loggedIn";

const LoginPage = ({authConfig, client}) => {
    const currentUser = loggedIn();
    const navigate = useNavigate();

    if (currentUser) {
        toast.error("You are already logged in!");
        navigate('/profile');
        navigate(0);
    }
    const [error, setError] = useState('');
    const delay = ms => new Promise(
        resolve => setTimeout(resolve, ms)
    );

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().required('Password is required')
        }),
        onSubmit: async (values) => {
            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_API_ENDPOINT}/api/v1/login`,
                    { session: values }
                );
                toast.success("You have successfully logged in!");
                // Store the token in a cookie that expires in 7 days
                setCookie('Authorization', response.data.data.meta.authentication_token, 7);
                setCookie('CurrentUser', response.data.data.attributes, 7);
                await delay(2000);
                navigate('/');
                navigate(0);
            } catch (error) {
                toast.error("Failed to logged in!");
                setError('Failed to login. Please review your login information and try again.');
            }
        }
    });

    return (
        <div className={'container mt-4'}>
            <ToastContainer/>
            <Card>
                <Card.Header className='bg-dark text-light'>
                    <Card.Title>Admin Sign In</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={formik.handleSubmit}>
                        <Form.Group controlId="email">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                name="email"
                                autoComplete="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={formik.touched.email && formik.errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                name="password"
                                autoComplete="current-password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={formik.touched.password && formik.errors.password}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>

                        {error && <div className="text-danger">{error}</div>}

                        <Button variant="dark" type="submit" className={'mt-4'}>
                            Login
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
            <Auth0Login authConfig={authConfig} client={client}/>
        </div>
    );
};

export default LoginPage;
