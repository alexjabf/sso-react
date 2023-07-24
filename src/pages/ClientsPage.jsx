import React, {useEffect, useState} from 'react';
import {getObjects} from "../requests/crudOperations";
import {authorize} from "../services/loggedIn";
import {Button, Card, Col, Form, Row, Table} from "react-bootstrap";
import LoadingDiv from "../components/LoadingDiv";
import PaginationLinks from '../components/PaginationLinks';
import {Link, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

const ClientsPage = () => {
    const navigate = useNavigate();
    const currentUser = authorize();

    if (!currentUser || parseInt(currentUser.role_id) !== 1) {
        toast.error('You are not authorized to view this page')
        setTimeout(() => {
            navigate('/');
            navigate(0);
        }, 2000);
    }

    const urlSearchParams = new URLSearchParams(window.description);
    const [clients, setClients] = useState([]);
    const [links, setLinks] = useState({});
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [filterValues, setFilterValues] = useState({
        name: urlSearchParams.get('name') || '',
        client_code: urlSearchParams.get('client_code') || '',
        description: urlSearchParams.get('description') || '',
        custom_fields: urlSearchParams.get('custom_fields') || '',
        order: urlSearchParams.get('order') || 'desc',
        sort_by: urlSearchParams.get('sort_by') || 'id',
        page: urlSearchParams.get('page') || 1,
        per_page: urlSearchParams.get('per_page') || 10
    });

    const fetchData = async () => {
        const nonEmptyParams = Object.fromEntries(
            Object.entries(filterValues).filter(([_, value]) => value !== '')
        );

        setFilterValues(nonEmptyParams);
        try {
            const clientsList = await getObjects('clients', nonEmptyParams) || [];
            setClients(clientsList.data.map(client => {
                return {
                    id: parseInt(client.id),
                    name: client.attributes.name,
                    client_code: client.attributes.client_code,
                    description: client.attributes.description,
                    provider: client.attributes?.configuration?.provider,
                    custom_fields: client.attributes?.configuration?.custom_fields,
                }
            }));
            setTotalRecords((clientsList.links.total_pages * clientsList.data.length) || 0);
            setTotalPages(clientsList.links.total_pages);
            setLinks(clientsList.links);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchData().then(r => r);
    }, [filterValues.sort_by, filterValues.order, filterValues.page, filterValues.per_page]);

    if (!clients) {
        return (<LoadingDiv/>);
    }

    const handleInputChange = async (e) => {
        const {name, value} = e.target;
        setFilterValues((prevValues) => ({
            ...prevValues,
            [name]: value
        }));
    };

    const handleFilter = async (e) => {
        handleInputChange(e).then(r => r);
        await fetchData().then(r => r);
    };

    const handleFilterForm = async (e) => {
        e.preventDefault();
        filterValues.page = 1;
        handleFilter(e).then(r => r);
    };

    const handleFilterLink = async (e) => {
        const linkParams = new URLSearchParams(e.target.href.split('?')[1]);
        e.preventDefault();

        filterValues.page = linkParams.get('page') || 1;
        handleInputChange(e).then(r => r);
    };

    const handleClear = async (e) => {
        e.preventDefault();
        window.location.reload();
    };

    return (
        clients && (
            <div className={'container mt-4'}>
                <Card>
                    <Card.Header className='bg-dark text-light'>
                        <Card.Title>Clients</Card.Title>
                    </Card.Header>
                    <Card.Body>

                        <Form onSubmit={handleFilterForm}>
                            <Row>
                                <Col className='m-lg-4'>
                                    <Form.Group controlId="name">
                                        <Form.Label>Company Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={filterValues.name || ""}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col className='m-lg-4'>
                                    <Form.Group controlId="client_code">
                                        <Form.Label>Client Code</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="client_code"
                                            value={filterValues.client_code || ""}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col className='m-lg-4'>

                                    <Form.Group controlId="description">
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="description"
                                            value={filterValues.description || ""}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col className='m-lg-2'>
                                    <Row>
                                        <Col className='m-lg-12 w-100'>
                                            <Form.Group controlId="sort_by">
                                                <Form.Label>Sort By</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    name="sort_by"
                                                    value={filterValues.sort_by || "id"}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="id">Id</option>
                                                    <option value="name">Company Name</option>
                                                    <option value="description">Description</option>
                                                    <option value="client_code">Client Code</option>
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                        <Col className='m-lg-12 w-100'>
                                            <Form.Group controlId="order">
                                                <Form.Label>Order By</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    name="order"
                                                    value={filterValues.order || "desc"}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="desc">Descending</option>
                                                    <option value="asc">Ascending</option>
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col className='m-lg-2'>
                                    <Row>
                                        <Col className='m-lg-12 w-100'>
                                            <Form.Group controlId="per_page">
                                                <Form.Label>Results Per</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    name="per_page"
                                                    value={filterValues.per_page || 10}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="10">10</option>
                                                    <option value="20">20</option>
                                                    <option value="30">30</option>
                                                    <option value="40">40</option>
                                                    <option value="50">50</option>
                                                    <option value="60">60</option>
                                                    <option value="70">70</option>
                                                    <option value="80">80</option>
                                                    <option value="90">90</option>
                                                    <option value="100">100</option>
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                        <Col className='m-lg-12 w-100'>
                                            <Form.Group controlId="page">
                                                <Form.Label>Page</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    name="page"
                                                    value={filterValues.page}
                                                    onChange={handleInputChange}
                                                >
                                                    {[...Array(totalPages)].map((_, index) => (
                                                        <option key={index + 1} value={index + 1}>
                                                            {index + 1}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col className='m-lg-2 w-100'>
                                    <Form.Label>Filter Clients</Form.Label>
                                    <Row>
                                        <Col className='m-lg-12 w-100'>
                                            <Button variant="primary" type="submit" className='w-100'>
                                                Filter
                                            </Button>
                                        </Col>
                                        <Col className='m-lg-12 w-100'>
                                            <Button variant="secondary" type="button" className='w-100'
                                                    onClick={handleClear}>
                                                Clear
                                            </Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Form>
                    </Card.Body>
                    <Card.Footer>
                        {clients.length === 0 ? (
                            <div className="text-danger mb-2">No results available</div>
                        ) : (
                            <div className="text-success mb-2">
                                Showing {clients.length} out of {totalRecords} results found.
                            </div>
                        )}

                        <PaginationLinks links={links} handleFilter={handleFilterLink} params={filterValues}/>
                    </Card.Footer>
                </Card>
                <Card>
                    <Card.Header className='bg-dark text-light'>
                        <Card.Title>Search Clients</Card.Title>
                    </Card.Header>
                    <Card.Body className={'table-responsive'}>
                        <Table hover>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Client Name</th>
                                <th>Client Code</th>
                                <th>Description</th>
                                <th>Provider</th>
                                <th>Custom Fields</th>
                                <th>Edit Client</th>
                            </tr>
                            </thead>
                            <tbody>
                            {clients.map((client, index) => (
                                <tr key={client.id}>
                                    <td>{client.id}</td>
                                    <td>{client.name}</td>
                                    <td>{client.client_code}</td>
                                    <td>{client.description}</td>
                                    <td>{client.provider}</td>
                                    <td>
                                        <ul>
                                            {Array.isArray(client.custom_fields) && client.custom_fields.map((item, index) => (
                                                <li key={index}>
                                                    {item.name}: {item.type}
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td>
                                        <Link to={`/edit-client/${client.id}`} lassName={`btn btn-success btn-sm`}>Edit</Link>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>

                        <Card.Footer>
                            {clients.length === 0 ? (
                                <div className="text-danger mb-2">No results available</div>
                            ) : (
                                <div className="text-success mb-2">
                                    Showing {clients.length} out of {totalRecords} results found.
                                </div>
                            )}

                            <PaginationLinks links={links} handleFilter={handleFilterLink} params={filterValues}/>
                        </Card.Footer>
                    </Card.Body>
                </Card>
            </div>
        )
    );
};

export default ClientsPage;
