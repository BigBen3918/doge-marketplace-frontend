import React from 'react';
import { BsTwitter, BsTelegram, BsDiscord } from 'react-icons/bs';
import { useBlockchainContext } from '../../context';

const Footer = () => {
    const [state, {}] = useBlockchainContext();
    return (
        <footer className="footer-light">
            <div className="container">
                <h2>Follow Us</h2>
                <div>
                    <span>
                        <BsTwitter />
                    </span>
                    <span>
                        <BsTelegram />
                    </span>
                    <span>
                        <BsDiscord />
                    </span>
                </div>
                <div>
                    <h4>&copy; Copyright {new Date().getFullYear()} All Right Resserved</h4>
                </div>
            </div>
        </footer>
    );
};
export default Footer;
