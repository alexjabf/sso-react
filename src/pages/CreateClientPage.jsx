import React, {useState} from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {createObject} from "../requests/crudOperations";
import {Form, Button, Card, Row, Col} from 'react-bootstrap';
import {ToastContainer} from "react-toastify";
import {useNavigate} from 'react-router-dom';

const CreateClientPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [customFields, setCustomFields] = useState([]);

    // Yup validation schema
    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required').max(50, 'Name must be at most 50 characters'),
        description: Yup.string().required('Description is required').max(5000, 'Description must be at most 5000 characters'),
        client_code: Yup.string()
            .required('Client code is required')
            .max(50, 'Client code must be at most 50 characters')
            .min(10, 'Client code must be at least 10 characters')
            .matches(/^[a-zA-Z0-9]+$/, 'Client code can only contain letters and numbers'),
    });

    // Formik form setup
    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            client_code: '',
            field_name: '',
            field_type: '',
            custom_fields: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            createClient(values);
        },
    });

    // Function to handle form submission
    const createClient = async (clientData) => {
        let success = false;
        setIsSubmitting(true);
        delete clientData.field_name;
        delete clientData.field_type;

        const mergedData = Object.assign({}, clientData, { custom_fields: [...customFields] });

        success = await createObject('clients', {client: mergedData});
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
            setError('Field name and type are required and field name must be uniq.');
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
                    <Card.Title>Create Client</Card.Title>
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
                        <Row className='mb-2'>
                            <h3>Custom Oauth Fields</h3>
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
                                        type="invalid">{formik.errors.field_name}</Form.Control.Feedback>
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
                                        <option value="number">Number</option>
                                        <option value="date">Date</option>
                                        <option value="checkbox">Checkbox</option>
                                        <option value="radio">Radio</option>
                                        <option value="select">Select</option>
                                        <option value="file">File</option>
                                        {/* Add other available field types as options */}
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
                            Create Client
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default CreateClientPage;
