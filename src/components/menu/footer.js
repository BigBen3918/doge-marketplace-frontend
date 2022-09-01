import React from 'react';
import { useBlockchainContext } from '../../context';

const Footer = () => {
    const [state, {}] = useBlockchainContext();
    return (
        <footer className="footer-light">
            <div className="container">
                <div>
                    <img src="/img/footer_logo.png" alt="" />
                </div>
                <h4>&copy; Copyright {new Date().getFullYear()} All Right Resserved</h4>
            </div>
        </footer>
    );
};
export default Footer;
