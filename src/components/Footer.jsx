import React from 'react';

const Footer = () => {
    return (
        <>
            <footer
                className="bg-dark text-light text-center py-3 mt-5"
                style={{
                    position: 'fixed',
                    bottom: '0',
                    left: '0',
                    width: '100%',
                    height: '56px',
                    zIndex: '1000'
                }}
            >
                <div className="container">
                    <p className="mb-0">
      <span style={{marginRight: '10px'}}>
        &copy; {new Date().getFullYear()} All rights reserved.
      </span>
                        <a href="/" className="text-light">
                            eLearning Platform
                        </a>
                        {' | '}
                        <a
                            href="https://www.alexballesteros.com/"
                            className="text-light"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Alejandro Ballesteros
                        </a>
                    </p>
                </div>
            </footer>
        </>
    );
};

export default Footer;
