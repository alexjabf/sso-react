import React from 'react';
import {Navbar, Nav} from 'react-bootstrap';
import {loggedIn} from "../services/loggedIn";
import Logout from "../components/Logout";

const NavigationBar = () => {
    const currentUser = loggedIn();
    const linkStyles = {
        color: '#fff',
    };

    return (
        <div style={{height: '56px', width: '100%'}}>
            <Navbar bg="dark" expand="lg" className="p-2 navbarStyles">
                <Navbar.Brand href="/" style={linkStyles}>
                    SteelDoor
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar"/>
                <Navbar.Collapse id="navbar">
                    <Nav className="mr-auto">
                        {currentUser ? (
                            <>
                                {currentUser.role_id === 1 && (
                                    <Nav.Link href="/clients" style={linkStyles}>
                                        Clients
                                    </Nav.Link>
                                )}
                                    <Nav.Link href="/create-client" style={linkStyles}>
                                        Create Client
                                    </Nav.Link>
                                    < Nav.Link href="/profile" style={linkStyles}>
                                        User Profile
                                    </Nav.Link>
                                    <Logout style={linkStyles}/>
                            </>
                        ) : (
                            <>
                                <Nav.Link href="/signup" style={linkStyles}>
                                    Sign Up
                                </Nav.Link>
                                <Nav.Link href="/login" style={linkStyles}>
                                    Sign In
                                </Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
};

export default NavigationBar;
