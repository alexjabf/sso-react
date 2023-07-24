import React, {useEffect, useState} from 'react';
import {authorize} from "../services/loggedIn";
import {Card} from "react-bootstrap";
import LoadingDiv from "../components/LoadingDiv";
import {getObject} from "../requests/crudOperations";

const UserProfilePage = () => {
    const currentUser = authorize()
    const [user, setUser] = useState(null)
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDetails = await getObject('users', currentUser.id);
                setUser(userDetails['data']['attributes']);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserData().then(r => r);
    }, [currentUser.id]);

    if (!user) {
        return (<LoadingDiv/>);
    }

    return (

        <div className="container mt-4">
            <Card>
                <Card.Header className='bg-dark text-light'>
                    <Card.Title>User Profile: {user.first_name + ' ' + user.last_name}</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Card.Subtitle className="mb-2 text-muted">
                        <strong>ID:</strong> {user.id}
                    </Card.Subtitle>
                    <Card.Text>
                        <strong>First Name:</strong> {user.first_name}
                    </Card.Text>
                    <Card.Text>
                        <strong>Last Name:</strong> {user.last_name}
                    </Card.Text>
                    <Card.Text>
                        <strong>Email:</strong> {user.email}
                    </Card.Text>
                    <Card.Text>
                        <strong>Role Name:</strong> {user.role_name}
                    </Card.Text>
                    <Card.Text>
                        <strong>Registered:</strong> {user.created_at}
                    </Card.Text>
                    <Card.Text>
                        <strong>Updated At:</strong> {user.updated_at}
                    </Card.Text>
                    {Object.entries(user.custom_fields).map(([key, value]) => (
                        <Card.Text key={key}>
                            <strong>{key}:</strong> {value}
                        </Card.Text>
                    ))}
                </Card.Body>
            </Card>
        </div>
    );
};

export default UserProfilePage;
