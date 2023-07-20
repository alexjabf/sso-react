import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingDiv = () => {
    return (
        <div className="d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
            <Spinner animation="border" variant="primary" />
        </div>
    );
};

export default LoadingDiv;