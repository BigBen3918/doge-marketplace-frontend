import { useWallet } from 'use-wallet';
import Footer from '../menu/footer';

export default function Wallet() {
    const wallet = useWallet();

    const HandleConnect = () => {
        wallet.connect();
    };

    return (
        <div>
            <section className="jumbotron breadcumb no-bg">
                <div className="mainbreadcumb">
                    <div className="container">
                        <h1 className="text-center">{'Wallet'}</h1>
                    </div>
                </div>
            </section>

            <section className="container">
                <div className="row">
                    <div className="col-lg-3 mb30">
                        <span className="box-url left p-3" onClick={HandleConnect}>
                            <span className="box-url-label">Most Popular</span>
                            <img src="./img/wallet/1.png" alt="" className="mb20" />
                            <h4>Metamask</h4>
                            <p>
                                Start exploring blockchain applications in seconds. Trusted by over
                                1 million users worldwide.
                            </p>
                        </span>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
