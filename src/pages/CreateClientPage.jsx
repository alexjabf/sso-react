import React, {useEffect, useState} from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {createObject, getObject, updateObject} from "../requests/crudOperations";
import {Form, Button, Card, Row, Col} from 'react-bootstrap';
import {toast, ToastContainer} from "react-toastify";
import {useNavigate, useParams} from 'react-router-dom';
import {authorize} from "../services/loggedIn";

const CreateClientPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const currentUser = authorize();
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [customFields, setCustomFields] = useState([]);

    if (!currentUser || parseInt(currentUser.role_id) !== 1) {
        toast.error('You are not authorized to view this page')
        setTimeout(() => {
            navigate('/');
            navigate(0);
        }, 2000);
    }

    // Yup validation schema
    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required').max(50, 'Name must be at most 50 characters'),
        description: Yup.string().required('Description is required').max(5000, 'Description must be at most 5000 characters'),
        client_code: Yup.string()
            .required('Client code is required')
            .max(50, 'Client code must be at most 50 characters')
            .min(10, 'Client code must be at least 10 characters')
            .matches(/^[a-zA-Z0-9]+$/, 'Client code can only contain letters and numbers'),
        configuration: Yup.object({
            client_key: Yup.string().required('Client key is required'),
            client_secret: Yup.string().required('Client secret API is required'),
            client_key_frontend: Yup.string().required('Client key FE API is required'),
            client_secret_frontend: Yup.string().required('Client secret FE is required'),
            provider: Yup.string().required('Provider is required'),
            redirect_uri: Yup.string().required('Redirect URI is required'),
            domain: Yup.string().required('Domain is required'),
            audience: Yup.string().required('Audience is required'),
        }),
    });


    const [client, setClient] = useState()

    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            client_code: '',
            field_name: '',
            field_type: '',
            configuration: {
                provider: 'auth0',
                default_scope: 'email username profile',
                client_key: '',
                client_secret: '',
                client_key_frontend: '',
                client_secret_frontend: '',
                redirect_uri: '',
                domain: '',
                audience: '',
                custom_fields: [],
            },
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            createClient(values);
        },
    });

    useEffect(() => {
        if (id) {
            const getClient = async () => {
                const clientData = await getObject('clients', id);
                formik.setValues({
                    name: clientData.data.attributes.name,
                    description: clientData.data.attributes.description,
                    client_code: clientData.data.attributes.client_code,
                    field_name: clientData.data.attributes.field_name,
                    field_type: clientData.data.attributes.field_type,
                    configuration: {
                        provider: clientData.data.attributes.configuration.provider,
                        default_scope: clientData.data.attributes.configuration.default_scope,
                        client_key: clientData.data.attributes.configuration.client_key,
                        client_secret: clientData.data.attributes.configuration.client_secret,
                        client_key_frontend: clientData.data.attributes.configuration.client_key_frontend,
                        client_secret_frontend: clientData.data.attributes.configuration.client_secret_frontend,
                        redirect_uri: clientData.data.attributes.configuration.redirect_uri,
                        domain: clientData.data.attributes.configuration.domain,
                        audience: clientData.data.attributes.configuration.audience,
                        custom_fields: clientData.data.attributes.configuration.custom_fields,
                    },
                });
                setClient(clientData.data.attributes);
            }
            getClient().then(r => console.log('client', client));
        }
    }, [id]);

    const delay = ms => new Promise(
        resolve => setTimeout(resolve, ms)
    );

    const createClient = async (clientData) => {
        setError('');
        let success = false;
        setIsSubmitting(true);
        delete clientData.field_name;
        delete clientData.field_type;

        const mergedData = Object.assign({}, clientData, {custom_fields: [...customFields]});
        mergedData.configuration.custom_fields = [...customFields]
        if (id) {
            success = await updateObject('clients', {client: mergedData}, id);
        } else {
            success = await createObject('clients', {client: mergedData});
        }
        if (success === true) {
            setTimeout(() => {
                navigate('/clients');
                navigate(0);
            }, 2000);
        } else {
            setError('Something went wrong. Please review your information and try again.');
        }
        setIsSubmitting(false);
    };


    const addCustomField = (field_name, field_type) => {
        const fieldExists = customFields.some((field) => field.name === field_name);

        if (field_name && field_type && !fieldExists) {
            const newField = {name: field_name, type: field_type};
            setCustomFields([...customFields, newField]);
            formik.setFieldValue('field_name', '');
            formik.setFieldValue('field_type', '');
            setError('');
        } else {
            setError('Field name and type are required and field name must be unique.');
        }
    };

    const removeCustomField = (index) => {
        const updatedFields = [...customFields];
        updatedFields.splice(index, 1);
        setCustomFields(updatedFields);
    };

    return (
        <div className={'container mt-4'}>
            <ToastContainer/>
            <Card>
                <Card.Header className='bg-dark text-light'>
                    <Card.Title>{id ? 'Update Client' : 'Create Client'}</Card.Title>
                </Card.Header>
                <Card.Body>
                    <h3>Company Information</h3>
                    <Form onSubmit={formik.handleSubmit}>
                        <Row className='mb-2'>
                            <Col md={6}>
                                <Form.Group controlId="name" className={'mt-2'}>
                                    <Form.Label>Name:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={formik.touched.name && formik.errors.name}
                                    />
                                    <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="client_code" className={'mt-2'}>
                                    <Form.Label>Client Code:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="client_code"
                                        value={formik.values.client_code}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={formik.touched.client_code && formik.errors.client_code}
                                    />
                                    <Form.Control.Feedback
                                        type="invalid">{formik.errors.client_code}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Form.Group controlId="description" className={'mt-2'}>
                                <Form.Label>Description:</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    name="description"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={formik.touched.description && formik.errors.description}
                                />
                                <Form.Control.Feedback
                                    type="invalid">{formik.errors.description}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <h3>Configuration</h3>
                        <Row className='mb-2'>
                            <Col md={6}>
                                <Form.Group controlId="configuration[provider]">
                                    <Form.Label>Provider:</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="configuration[provider]"
                                        value={formik.values.configuration.provider}
                                        placeholder={'Select a provider'}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={formik.values.configuration?.provider && formik.errors.configuration?.provider}
                                    >
                                        <option value="auth0">Auth0</option>
                                        <option value="okta">Okta</option>
                                        <option value="google_oauth2">Google OAuth2</option>
                                    </Form.Control>
                                    <Form.Control.Feedback
                                        type="invalid">{formik.errors.configuration?.provider}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="configuration[redirect_uri]">
                                    <Form.Label>Redirect URI:</Form.Label>
                                    <Form.Control
                                        type="url"
                                        name="configuration[redirect_uri]"
                                        value={formik.values.configuration.redirect_uri}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={formik.touched.configuration?.redirect_uri && formik.errors.configuration?.redirect_uri}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formik.errors.configuration?.redirect_uri}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={6}>
                                <Form.Group controlId="configuration[audience]">
                                    <Form.Label>Audience:</Form.Label>
                                    <Form.Control
                                        type="url"
                                        name="configuration[audience]"
                                        value={formik.values.configuration.audience}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={formik.touched.configuration?.audience && formik.errors.configuration?.audience}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formik.errors.configuration?.audience}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="configuration[domain]">
                                    <Form.Label>Domain:</Form.Label>
                                    <Form.Control
                                        type="url"
                                        name="configuration[domain]"
                                        value={formik.values.configuration.domain}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={formik.touched.configuration?.domain && formik.errors.configuration?.domain}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formik.errors.configuration?.domain}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={6}>
                                <Form.Group controlId="configuration[client_key]">
                                    <Form.Label>Client Key API:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="configuration[client_key]"
                                        value={formik.values.configuration.client_key}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={formik.touched.configuration?.client_key && formik.errors.configuration?.client_key}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formik.errors.configuration?.client_key}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="configuration[client_secret]">
                                    <Form.Label>Client Secret API:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="configuration[client_secret]"
                                        value={formik.values.configuration.client_secret}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={formik.touched.configuration?.client_secret && formik.errors.configuration?.client_secret}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formik.errors.configuration?.client_secret}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={6}>
                                <Form.Group controlId="configuration[client_key_frontend]">
                                    <Form.Label>Client Key FE:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="configuration[client_key_frontend]"
                                        value={formik.values.configuration.client_key_frontend}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={formik.touched.configuration?.client_key_frontend && formik.errors.configuration?.client_key_frontend}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formik.errors.configuration?.client_key_frontend}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="configuration[client_secret_frontend]">
                                    <Form.Label>Client Secret FE:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="configuration[client_secret_frontend]"
                                        value={formik.values.configuration.client_secret_frontend}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={formik.touched.configuration?.client_secret_frontend && formik.errors.configuration?.client_secret_frontend}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formik.errors.configuration?.client_secret_frontend}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className='mb-3'>
                            <strong>Custom Oauth Fields</strong>
                            <Col md={6}>
                                <Form.Group controlId="field_name">
                                    <Form.Label>Name:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="field_name"
                                        value={formik.values.field_name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={formik.touched.field_name && formik.errors.field_name}
                                    />
                                    <Form.Control.Feedback
                                        type="invalid">{formik.errors.field_name}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="field_type">
                                    <Form.Label>Field Type:</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="field_type"
                                        value={formik.values.field_type}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={formik.touched.field_type && formik.errors.field_type}
                                    >
                                        <option value="">Select a field type</option>
                                        <option value="text">Text</option>
                                        <option value="textarea">Text area</option>
                                        <option value="password">Password</option>
                                        <option value="email">Email</option>
                                        <option value="url">Url</option>
                                        <option value="number">Number</option>
                                        <option value="date">Date</option>
                                    </Form.Control>
                                    <Form.Control.Feedback
                                        type="invalid">{formik.errors.field_type}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={6}>
                                {customFields.length > 0 && (
                                    <div>
                                        <strong>Custom Fields:</strong>
                                        <ol>
                                            {customFields.map((field, index) => (

                                                <li key={index}>
                                                    <Row className='mb-2'>
                                                        <Col md={3}>
                                                            {field.name} - {field.type}{' '}
                                                        </Col>
                                                        <Col md={3}>
                                                            <Button
                                                                type="button" variant='danger' className='btn-sm'
                                                                onClick={() => removeCustomField(index)}
                                                            >
                                                                Remove
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                </li>

                                            ))}
                                        </ol>
                                    </div>
                                )}
                            </Col>
                        </Row>
                        <Row className='mb-2'>
                            <Col md={6}>
                                <Button type="button" variant='success' className='btn-sm' disabled={isSubmitting}
                                        onClick={() => {
                                            addCustomField(formik.values.field_name, formik.values.field_type);
                                            formik.setFieldValue('field_name', '');
                                            formik.setFieldValue('field_type', '');
                                        }}
                                >
                                    Add custom field
                                </Button>
                            </Col>
                        </Row>

                        {error && <div className="text-danger">{error}</div>}

                        <Button type="submit" disabled={isSubmitting} className={'mt-4'}>
                            {id ? 'Update Client' : 'Create Client'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default CreateClientPage;
