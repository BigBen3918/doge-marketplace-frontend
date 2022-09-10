import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaRegCopy } from 'react-icons/fa';
import ColumnZero from '../components/ColumnZero';
import CoulmnOne from '../components/CoulmnOne';
import Footer from '../menu/footer';
import { useBlockchainContext } from '../../context';
import { copyToClipboard } from '../../utils';
import { NotificationManager } from 'react-notifications';
import { BsTwitter, BsFacebook, BsInstagram } from 'react-icons/bs';

export default function Collection() {
    const navigate = useNavigate();
    const { collection } = useParams();
    const [state, { translateLang }] = useBlockchainContext();
    const [openMenu, setOpenMenu] = useState(true);
    const [correctItem, setCorrectItem] = useState(null);
    const [owners, setOwners] = useState([]);
    const [avgAmount, setAvgAmount] = useState(0);
    const [floorPrice, setFloorPrice] = useState(0);
    const [volumn, setVolumn] = useState(0);

    useEffect(() => {
        if (state.orderList.length !== 0) {
            let bump = 0;
            const currentVolumn = state.orderList.filter((item) => {
                return item.contractAddress === collection && item.status === 'success';
            });
            currentVolumn.map((item) => {
                bump += Number(item.price);
            });
            setVolumn(parseFloat(bump.toFixed(3)));
        }
    }, [state.orderList]);

    useEffect(() => {
        if (!collection) return;
        let itemData;
        state.collectionNFT.map((item) => {
            if (item.address === collection) {
                itemData = item;
            }
        });
        if (!itemData) navigate('/collections');
        setCorrectItem(itemData);
    }, [collection]);

    useEffect(() => {
        if (correctItem !== null) {
            let bump = [];
            let count = 0;
            let sum = 0;
            let floorBump = [];
            for (let i = 0; i < correctItem.items.length; i++) {
                if (bump.indexOf(correctItem.items[i].owner) === -1) {
                    bump.push(correctItem.items[i].owner);
                }
                if (correctItem.items[i].marketdata.price !== '') {
                    floorBump.push(Number(correctItem.items[i].marketdata.price));
                    sum += Number(correctItem.items[i].marketdata.price);
                    count++;
                }
            }
            floorBump.sort();
            if (floorBump.length === 0) setFloorPrice(0);
            else setFloorPrice(parseFloat(floorBump[0].toFixed(3)));
            setOwners(bump);
            setAvgAmount(sum / count / 1000);
        }
    }, [correctItem]);

    const handleBtnClick = () => {
        setOpenMenu(true);
        document.getElementById('Mainbtn').classList.add('active');
        document.getElementById('Mainbtn1').classList.remove('active');
    };

    const handleBtnClick1 = () => {
        setOpenMenu(false);
        document.getElementById('Mainbtn1').classList.add('active');
        document.getElementById('Mainbtn').classList.remove('active');
    };

    const handleaddressCopy = () => {
        copyToClipboard(correctItem.address)
            .then((res) => {
                NotificationManager.success(translateLang('addresscopy_success'));
            })
            .catch((err) => {
                NotificationManager.error(translateLang('operation_error'));
            });
    };

    return (
        <div>
            <section
                id="profile_banner"
                className="jumbotron breadcumb no-bg"
                style={{
                    backgroundImage: `url(${correctItem?.metadata?.coverImage})`
                }}>
                <div className="mainbreadcumb"></div>
            </section>

            {correctItem !== null ? (
                <div>
                    <section className="container d_coll no-top no-bottom">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="d_profile">
                                    <div className="profile_avatar">
                                        <div className="d_profile_img">
                                            <img src={correctItem.metadata.image} alt="" />
                                            <i className="fa fa-check"></i>
                                        </div>

                                        <div className="profile_name">
                                            <h4>
                                                <h2>{correctItem.metadata.name}</h2>
                                                <div className="clearfix"></div>
                                                <span id="wallet" className="profile_wallet">
                                                    <span>
                                                        {correctItem.address.slice(0, 20) + '...'}
                                                    </span>
                                                    <button
                                                        id="btn_copy"
                                                        title="Copy Text"
                                                        onClick={handleaddressCopy}>
                                                        <FaRegCopy />
                                                    </button>
                                                </span>
                                            </h4>
                                            <div>
                                                {correctItem.metadata?.external_url1 != '' && (
                                                    <a href={correctItem.metadata?.external_url1}>
                                                        <BsTwitter />
                                                    </a>
                                                )}
                                                {correctItem.metadata?.external_url2 != '' && (
                                                    <a href={correctItem.metadata?.external_url2}>
                                                        <BsFacebook />
                                                    </a>
                                                )}
                                                {correctItem.metadata?.external_url3 != '' && (
                                                    <a href={correctItem.metadata?.external_url3}>
                                                        <BsInstagram />
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        <div className="collection_info">
                                            {/* <p className="text-center">
                                                {translateLang('by')}{' '}
                                                <b className="color">CLOUD9</b>
                                            </p> */}
                                            <div className="spacer-10"></div>
                                            <span>
                                                <div>
                                                    <h3>{correctItem.items.length}</h3>
                                                    <p>{translateLang('items')}</p>
                                                </div>
                                                <div>
                                                    <h3>{owners.length}</h3>
                                                    <p>{translateLang('owners')}</p>
                                                </div>
                                                <div>
                                                    <h3>{volumn}</h3>
                                                    <p>{'Volumn'}</p>
                                                </div>
                                                <div>
                                                    <h3>{floorPrice}</h3>
                                                    <p>{'Floor'}</p>
                                                </div>
                                                {/* <div>
                                                    <h3>
                                                        {isNaN(avgAmount)
                                                            ? 0
                                                            : avgAmount.toFixed(2)}
                                                        K
                                                    </h3>
                                                    <p>{translateLang('prices')}</p>
                                                </div> */}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="container no-top">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="items_filter">
                                    <ul className="de_nav">
                                        <li id="Mainbtn" className="active">
                                            <span onClick={handleBtnClick}>
                                                {translateLang('onsaled')}
                                            </span>
                                        </li>
                                        <li id="Mainbtn1" className="">
                                            <span onClick={handleBtnClick1}>
                                                {translateLang('owned')}
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {openMenu ? (
                            <div id="zero1" className="onStep fadeIn">
                                <ColumnZero correctItem={correctItem} />
                            </div>
                        ) : (
                            <div id="zero2" className="onStep fadeIn">
                                <CoulmnOne correctItem={correctItem} />
                            </div>
                        )}
                    </section>
                </div>
            ) : (
                'Loading...'
            )}

            <Footer />
        </div>
    );
}
