import React, {useState, useEffect} from 'react';
import {Navbar, Nav} from 'react-bootstrap';

const NavigationBar = () => {
    const loggedIn = false;

    const linkStyles = {
        color: '#fff',
    };
    return (
        <div style={{height: '56px', width: '100%'}}>
            <Navbar bg="dark" expand="lg" className="p-2 navbarStyles">
                <Navbar.Brand href="/" style={linkStyles}>
                    eLearning Platform
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar"/>
                <Navbar.Collapse id="navbar">
                    <Nav className="mr-auto">
                        {!loggedIn ? (
                            <>
                                <Nav.Link href="/signup" style={linkStyles}>
                                    Sign Up
                                </Nav.Link>
                                <Nav.Link href="/login" style={linkStyles}>
                                    Sign In
                                </Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link href="/profile" style={linkStyles}>
                                    User Profile
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
