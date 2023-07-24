import React, {useState} from 'react';
import {Form, Button, Card, Row, Col} from 'react-bootstrap';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import axios from "axios";
import {setCookie} from '../services/CookiesHandler';
import {useNavigate} from 'react-router-dom';
import {toast, ToastContainer} from "react-toastify";
import {concatErrorMessages} from '../requests/crudOperations';

const SignUpPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const formik = useFormik({
        initialValues: {
            first_name: '',
            last_name: '',
            email: '',
            username: '',
            password: '',
            password_confirmation: '',
            role_id: 1,
            client_id: 1,
        },
        validationSchema: Yup.object({
            first_name: Yup.string().required('First Name is required'),
            last_name: Yup.string().required('Last Name is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            username: Yup.string().required('Username is required'),
            password: Yup.string().required('Password is required'),
        }),
        onSubmit: async (values) => {
            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_API_ENDPOINT}/api/v1/sign_up`,
                    {registration: values}
                );
                toast.success("You have successfully signed up!");
                // Store the token in a cookie that expires in 7 days
                const authToken = response.data.data.meta.authentication_token;
                setCookie('Authorization', authToken, {expires: 7});
                setCookie('CurrentUser', response.data.data.attributes, {expires: 7});
                navigate('/');
                navigate(0);
            } catch (error) {
                console.log(error.response.data.data.attributes.errors)
                const message = Object.entries(error.response.data.data.attributes.errors).map(([key, errors]) => {
                    return `${key.replace(/_/g, ' ')}: ${errors.join(', ')}.`;
                }).join('. ');
                setError('Failed to sign up. Please review your login information and try again.');
                toast.error(message);
            }
        }
    });

    return (
        <div className={'container mt-4'}>
            <Card>
                <Card.Header className='bg-dark text-light'>
                    <Card.Title>Sign Up (Admin)</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={formik.handleSubmit}>
                        <Row className='mb-2'>
                            <Col md={6}>
                                <Form.Group controlId="first_name">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your first name"
                                        name="first_name"
                                        value={formik.values.first_name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={formik.touched.first_name && formik.errors.first_name}
                                        required={true}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formik.errors.first_name}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="last_name">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your last name"
                                        name="last_name"
                                        value={formik.values.last_name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={formik.touched.last_name && formik.errors.last_name}
                                        required={true}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formik.errors.last_name}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={6}>
                                <Form.Group controlId="email">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter your email"
                                        name="email"
                                        autoComplete="email"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={formik.touched.email && formik.errors.email}
                                        required={true}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formik.errors.email}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="username">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your username"
                                        name="username"
                                        autoComplete="username"
                                        value={formik.values.username}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={formik.touched.username && formik.errors.username}
                                        required={true}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formik.errors.username}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={6}>
                                <Form.Group controlId="password">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter your password"
                                        name="password"
                                        autoComplete="current-password"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={formik.touched.password && formik.errors.password}
                                        required={true}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formik.errors.password}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="password_confirmation">
                                    <Form.Label>Password Confirmation</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter password confirmation"
                                        name="password_confirmation"
                                        autoComplete="current-password"
                                        value={formik.values.password_confirmation}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={formik.touched.password_confirmation && formik.errors.password_confirmation}
                                        required={true}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formik.errors.password_confirmation}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        {error && <div className="text-danger">{error}</div>}

                        <Button variant="dark" type="submit" className={'mt-4'}>
                            Sign Up
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
            <ToastContainer/>
        </div>
    );
};

export default SignUpPage;
