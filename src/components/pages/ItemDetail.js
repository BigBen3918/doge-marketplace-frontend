import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from '../menu/footer';
import moment from 'moment';
import M_itemdetailRedux from '../components/M_ItemdetailRedex';
import { useBlockchainContext } from '../../context';
import BuyModal from '../components/BuyModal';
import { styledAddress } from '../../utils';
import { NotificationManager } from 'react-notifications';

export default function Colection() {
    const { id, collection } = useParams();
    const navigate = useNavigate();
    const [state, { buyNFT, cancelOrder, translateLang, bidApprove, getCurrency }] =
        useBlockchainContext();
    const [openMenu, setOpenMenu] = useState(true);
    const [correctCollection, setCorrectCollection] = useState(null);
    const [pageFlag, setPageFlag] = useState(0); // 1 is mine, 2 is saled mine, 3 is others, 4 is saled others
    const [modalShow, setModalShow] = useState(false);
    const [expireTime, setExpireTime] = useState([]);
    const [timeFlag, setTimeFlag] = useState(true);
    const [loading, setLoading] = useState(false);

    // item data
    const [itemData, setItemData] = useState(null);

    useEffect(() => {
        if (itemData !== null)
            if (itemData.marketdata.endTime !== '')
                setInterval(() => {
                    let endTime = moment(Number(itemData.marketdata.endTime));
                    let nowTime = moment(new Date());
                    // test
                    if (endTime < nowTime) setTimeFlag(true);
                    else {
                        let ms = moment(endTime.diff(nowTime));
                        let bump = [];
                        bump.push(Math.floor(moment.duration(ms).asHours() / 24));
                        bump.push(Math.floor(moment.duration(ms).asHours()) % 24);
                        bump.push(moment.utc(ms).format('mm'));
                        bump.push(moment.utc(ms).format('ss'));
                        setExpireTime(bump);
                        setTimeFlag(false);
                    }
                }, 1000);
    }, [itemData]);

    useEffect(() => {
        if (itemData !== null) {
            if (itemData.owner?.toLowerCase() === state.addresses.Marketplace?.toLowerCase()) {
                // on market
                if (!state.auth?.address?.toLowerCase()) {
                    setPageFlag(4);
                    return;
                }
                itemData.marketdata.owner?.toLowerCase() === state.auth?.address?.toLowerCase()
                    ? setPageFlag(2)
                    : setPageFlag(4);
            } else {
                console.log('itemData', 'on user', itemData.owner?.toLowerCase());
                itemData.owner?.toLowerCase() === state.auth?.address?.toLowerCase()
                    ? setPageFlag(1)
                    : setPageFlag(3);
            }
        }
    }, [itemData]);

    useEffect(() => {
        for (let i = 0; i < state.collectionNFT.length; i++) {
            if (state.collectionNFT[i].address === collection) {
                setCorrectCollection(state.collectionNFT[i]);
                if (!state.collectionNFT[i].items[id]) {
                    //go to 404 page
                }
                var itemData = state.collectionNFT[i].items.find((item) => item.tokenID === id);
                if (!itemData) navigate('/explorer');
                else setItemData(itemData);
                break;
            }
        }
    }, [state.collectionNFT, id, collection]);

    const handleBuy = async () => {
        if (!state.signer) {
            navigate('/signPage');
            return;
        }
        try {
            setLoading(true);
            await buyNFT({
                nftAddress: itemData?.collectionAddress,
                assetId: itemData?.tokenID,
                price: itemData?.marketdata.price,
                acceptedToken: itemData?.marketdata.acceptedToken
            });
            NotificationManager.success(translateLang('buynft_success'));
            setLoading(false);
        } catch (err) {
            console.log(err.message);
            NotificationManager.error(translateLang('buynft_error'));
            setLoading(false);
        }
    };

    const handleApproveBid = async () => {
        try {
            if (itemData !== null) {
                setLoading(true);
                await bidApprove({
                    address: collection,
                    id: id,
                    price: itemData.marketdata.bidPrice
                });
                NotificationManager.success(translateLang('approve_succeess'));
                setLoading(false);
            }
        } catch (err) {
            console.log(err.message);
            NotificationManager.error(translateLang('approve_error'));
        }
    };

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

    const handleSell = () => {
        navigate(`/Auction/${collection}/${id}`);
    };

    const handleCancel = async () => {
        if (itemData !== null) {
            setLoading(true);
            try {
                await cancelOrder({
                    nftAddress: collection,
                    assetId: id
                });
                NotificationManager.success(translateLang('cancelorder_success'));

                setLoading(false);
            } catch (err) {
                console.log(err.message);
                NotificationManager.error(translateLang('cancelorder_error'));
                setLoading(false);
            }
        }
    };

    return (
        <div>
            <section className="container">
                {correctCollection === null ? (
                    'Loading...'
                ) : (
                    <>
                        <div className="row mt-md-5 pt-md-4">
                            <div className="col-md-6 text-center">
                                <img
                                    src={
                                        itemData?.metadata?.image ||
                                        '../../img/collections/coll-item-3.jpg'
                                    }
                                    className="img-fluid img-rounded mb-sm-30"
                                    alt=""
                                />
                                <div className="social-link">
                                    {itemData?.metadata?.external_url1 != '' && (
                                        <a href={itemData?.metadata?.external_url1}>
                                            <i className="fa fa-twitter-square"></i>
                                        </a>
                                    )}
                                    {itemData?.metadata?.external_url2 != '' && (
                                        <a href={itemData?.metadata?.external_url2}>
                                            <i className="fa fa-facebook-square"></i>
                                        </a>
                                    )}
                                    {itemData?.metadata?.external_url3 != '' && (
                                        <a href={itemData?.metadata?.external_url3}>
                                            <i className="fa fa-instagram"></i>
                                        </a>
                                    )}
                                    {itemData?.metadata?.external_url4 != '' && (
                                        <a href={itemData?.metadata?.external_url4}>
                                            <i className="fa fa-pinterest-square"></i>
                                        </a>
                                    )}
                                </div>
                            </div>
                            {/* main panel */}
                            <div className="col-md-6">
                                <div className="item_info">
                                    {/* end time */}
                                    {itemData?.marketdata?.endTime === '' ? null : (
                                        <span>
                                            <p>
                                                {translateLang('saletime')}{' '}
                                                {moment(
                                                    Number(itemData?.marketdata?.endTime)
                                                ).format('lll')}
                                            </p>
                                            <div className="spacer-10"></div>
                                            {timeFlag ? null : (
                                                <div>
                                                    <span>
                                                        <h3>{expireTime[0]}</h3>
                                                        <p>{translateLang('day')}</p>
                                                    </span>
                                                    <span>
                                                        <h3>{expireTime[1]}</h3>
                                                        <p>{translateLang('hour')}</p>
                                                    </span>
                                                    <span>
                                                        <h3>{expireTime[2]}</h3>
                                                        <p>{translateLang('minute')}</p>
                                                    </span>
                                                    <span>
                                                        <h3>{expireTime[3]}</h3>
                                                        <p>{translateLang('second')}</p>
                                                    </span>
                                                </div>
                                            )}
                                            <div className="spacer-10"></div>
                                            <h3 style={{ color: '#a48b57' }}>
                                                {itemData?.marketdata?.price === ''
                                                    ? null
                                                    : itemData?.marketdata?.price +
                                                      ' ' +
                                                      getCurrency(
                                                          itemData.marketdata?.acceptedToken
                                                      )?.label}
                                            </h3>
                                            <hr />
                                        </span>
                                    )}
                                    <h2>{itemData?.metadata?.name || 'unknown'}</h2>
                                    <div className="spacer-10"></div>
                                    <div className="item_info_counts">
                                        {/* <div className="item_info_type">
                                            <i className="fa fa-image"></i>NFT
                                        </div>
                                        <div className="item_info_views">
                                            <i className="fa fa-eye"></i>250
                                        </div> */}
                                        <div className="item_info_like">
                                            <i className="fa fa-heart"></i>
                                            {itemData?.likes?.length}
                                        </div>
                                    </div>
                                    <p>{itemData?.metadata?.description}</p>
                                    <div className="spacer-10"></div>
                                    <h5>{translateLang('creator')}</h5>
                                    <div className="item_author">
                                        <div className="author_list_pp">
                                            <span>
                                                <img
                                                    className="lazy"
                                                    src={
                                                        state.usersInfo[itemData?.creator]
                                                            ?.image === undefined
                                                            ? '../../img/author/author-1.jpg'
                                                            : state.usersInfo[itemData?.creator]
                                                                  .image ||
                                                              '../../img/author/author-1.jpg'
                                                    }
                                                    alt=""
                                                />
                                                <i className="fa fa-check"></i>
                                            </span>
                                        </div>
                                        <div className="author_list_info">
                                            <span>{styledAddress(itemData?.creator)}</span>
                                        </div>
                                    </div>
                                    <div className="spacer-30"></div>
                                    <h5>{'Owner'}</h5>
                                    <div className="item_author">
                                        <div className="author_list_pp">
                                            <span>
                                                <img
                                                    className="lazy"
                                                    src={
                                                        state.usersInfo[itemData?.owner]?.image ===
                                                        undefined
                                                            ? '../../img/author/author-1.jpg'
                                                            : state.usersInfo[itemData?.owner]
                                                                  .image ||
                                                              '../../img/author/author-1.jpg'
                                                    }
                                                    alt=""
                                                />
                                                <i className="fa fa-check"></i>
                                            </span>
                                        </div>
                                        <div className="author_list_info">
                                            <span>{styledAddress(itemData?.owner)}</span>
                                        </div>
                                    </div>
                                    <div className="spacer-40"></div>
                                    <div className="de_tab">
                                        <div className="row">
                                            {itemData?.metadata?.attributes.map((item, index) => (
                                                <M_itemdetailRedux
                                                    key={index}
                                                    type={item.key}
                                                    per={'+' + item.value}
                                                />
                                            ))}
                                        </div>
                                        <div className="spacer-40"></div>
                                        {pageFlag === 2 || pageFlag === 4 ? (
                                            <>
                                                <ul className="de_nav">
                                                    <li id="Mainbtn" className="active">
                                                        <span onClick={handleBtnClick}>
                                                            {translateLang('bid')}
                                                        </span>
                                                    </li>
                                                    <li id="Mainbtn1" className="">
                                                        <span onClick={handleBtnClick1}>
                                                            {translateLang('history')}
                                                        </span>
                                                    </li>
                                                </ul>
                                                {/* bidder tab */}
                                                <div className="de_tab_content">
                                                    {openMenu && (
                                                        <div className="tab-1 onStep fadeIn">
                                                            {itemData?.marketdata?.bidders.map(
                                                                (bidder, index) => (
                                                                    <div className="p_list">
                                                                        <div className="p_list_pp">
                                                                            <span>
                                                                                <img
                                                                                    className="lazy"
                                                                                    src={
                                                                                        state
                                                                                            .usersInfo[
                                                                                            bidder
                                                                                        ]?.image ||
                                                                                        '../../img/author/author-1.jpg'
                                                                                    }
                                                                                    alt=""
                                                                                />
                                                                            </span>
                                                                        </div>
                                                                        <div className="p_list_info">
                                                                            {translateLang('bid')}{' '}
                                                                            <b>
                                                                                {
                                                                                    itemData
                                                                                        ?.marketdata
                                                                                        ?.bidPrices[
                                                                                        index
                                                                                    ]
                                                                                }{' '}
                                                                            </b>
                                                                            <span>
                                                                                {translateLang(
                                                                                    'by'
                                                                                )}{' '}
                                                                                <b>
                                                                                    {styledAddress(
                                                                                        bidder
                                                                                    )}
                                                                                </b>{' '}
                                                                                {translateLang(
                                                                                    'at'
                                                                                )}{' '}
                                                                                {itemData
                                                                                    ?.marketdata
                                                                                    ?.bidTime
                                                                                    ? moment(
                                                                                          Number(
                                                                                              itemData
                                                                                                  ?.marketdata
                                                                                                  ?.bidTime[
                                                                                                  index
                                                                                              ]
                                                                                          )
                                                                                      ).format(
                                                                                          'lll'
                                                                                      )
                                                                                    : ''}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                    <div className="spacer-40"></div>
                                    <div>
                                        {itemData === null ? (
                                            'Loading...'
                                        ) : (
                                            <div className="mainside">
                                                {pageFlag === 1 ? (
                                                    <div className="attribute">
                                                        <button
                                                            className="btn-main"
                                                            onClick={handleSell}>
                                                            {translateLang('btn_sell')}
                                                        </button>
                                                    </div>
                                                ) : pageFlag === 2 ? (
                                                    <div>
                                                        {loading ? (
                                                            <button className="btn-main">
                                                                <span
                                                                    className="spinner-border spinner-border-sm"
                                                                    aria-hidden="true"></span>
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="btn-main"
                                                                onClick={handleCancel}>
                                                                {translateLang('btn_cancel')}
                                                            </button>
                                                        )}
                                                        {loading ? (
                                                            <button className="btn-main">
                                                                <span
                                                                    className="spinner-border spinner-border-sm"
                                                                    aria-hidden="true"></span>
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="btn-main"
                                                                onClick={handleApproveBid}>
                                                                {translateLang('btn_approvebid')}
                                                            </button>
                                                        )}
                                                    </div>
                                                ) : pageFlag === 3 ? null : (
                                                    <div>
                                                        {loading ? (
                                                            <button className="btn-main">
                                                                <span
                                                                    className="spinner-border spinner-border-sm"
                                                                    aria-hidden="true"></span>
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="btn-main"
                                                                onClick={handleBuy}>
                                                                {translateLang('btn_buynow')}
                                                            </button>
                                                        )}
                                                        {loading ? (
                                                            <button className="btn-main">
                                                                <span
                                                                    className="spinner-border spinner-border-sm"
                                                                    aria-hidden="true"></span>
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="btn-main"
                                                                onClick={() => setModalShow(true)}>
                                                                {translateLang('btn_makeoffer')}
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <BuyModal show={modalShow} setShow={setModalShow} correctItem={itemData} />
                    </>
                )}
            </section>

            <Footer />
        </div>
    );
}
