import React, { useState } from 'react';
import { NotificationManager } from 'react-notifications';
import axios from 'axios';

import Footer from '../menu/footer';
import Action from '../../service';
import { useBlockchainContext } from '../../context';

export default function CreateCollection() {
    const [state, { translateLang }] = useBlockchainContext();

    const [logoImage, _setLogoImage] = useState(null);
    const [selectedLogoFile, setSeletedLogoFile] = useState(null);
    const [bannerImage, _setBannerImage] = useState(null);
    const [selectedBannerFile, setSeletedBannerFile] = useState(null);
    const [name, setName] = useState('');
    const [extLink1, setExtLink1] = useState('');
    const [extLink2, setExtLink2] = useState('');
    const [extLink3, setExtLink3] = useState('');
    const [desc, setDesc] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [verify, setVerify] = useState(false);

    const handleVerify = async () => {
        if (address.trim() === '') {
            NotificationManager.error('Please enter contract address');
            return;
        }

        try {
            setLoading(true);
            const result = await axios.post(
                process.env.REACT_APP_SERVERENDPOINT + '/api/nft-verify',
                {
                    address: address
                }
            );
            if (result.data.success) {
                setVerify(result.data.success);
                NotificationManager.success('Successfully Verified');
            }
            setLoading(false);
        } catch (err) {
            NotificationManager.error('Server Error');
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        try {
            if (!verify) {
                NotificationManager.error('Please verify contract address');
                return;
            }
            if (address.trim() === '') {
                NotificationManager.error('Please enter contract address');
                return;
            }
            if (!selectedLogoFile) {
                NotificationManager.error(translateLang('chooselogo_error'));
                return;
            }
            if (!selectedBannerFile) {
                NotificationManager.error(translateLang('choosebanner_error'));
                return;
            }
            if (name.trim() === '') {
                NotificationManager.error(translateLang('fillcollection_error'));
                return;
            }
            setLoading(true);
            var formData = new FormData();
            formData.append('address', address);
            formData.append('logoImage', selectedLogoFile);
            formData.append('bannerImage', selectedBannerFile);
            formData.append('name', name.trim());
            formData.append('extUrl1', extLink1.trim());
            formData.append('extUrl2', extLink2.trim());
            formData.append('extUrl3', extLink3.trim());
            formData.append('desc', desc.trim());

            const uploadData = await Action.create_collection(formData);
            if (uploadData) {
                NotificationManager.success(translateLang('createcollection_success'));
                reset();
            } else {
                NotificationManager.error(translateLang('createcollection_error'));
            }
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.log(err);
            NotificationManager.error(translateLang('operation_error'));
        }
    };

    const reset = () => {
        cleanup();
        _setLogoImage(null);
        _setBannerImage(null);
        setSeletedLogoFile(null);
        setSeletedBannerFile(null);
        setName('');
        setExtLink1('');
        setExtLink2('');
        setExtLink3('');
        setDesc('');
    };

    const handleLogoImgChange = async (event) => {
        if (logoImage) {
            setLogoImage(null);
            setSeletedLogoFile(null);
        }
        const newImage = event.target?.files?.[0];
        if (newImage) {
            try {
                setLogoImage(URL.createObjectURL(newImage));
                setSeletedLogoFile(newImage);
            } catch (err) {
                console.log(err);
                NotificationManager.error(translateLang('imageloading_error'));
            }
        }
    };

    const handleBannerImgChange = async (event) => {
        if (bannerImage) {
            setBannerImage(null);
            setSeletedBannerFile(null);
        }
        const newImage = event.target?.files?.[0];
        if (newImage) {
            try {
                setBannerImage(URL.createObjectURL(newImage));
                setSeletedBannerFile(newImage);
            } catch (err) {
                console.log(err);
                NotificationManager.error(translateLang('imageloading_error'));
            }
        }
    };

    const cleanup = (index) => {
        if (index === 1) {
            URL.revokeObjectURL(logoImage);
        } else {
            URL.revokeObjectURL(bannerImage);
        }
    };

    const setLogoImage = (newImage) => {
        if (logoImage) {
            cleanup(1);
        }
        _setLogoImage(newImage);
    };

    const setBannerImage = (newImage) => {
        if (bannerImage) {
            cleanup(2);
        }
        _setBannerImage(newImage);
    };

    return (
        <div>
            <section className="jumbotron breadcumb no-bg">
                <div className="mainbreadcumb">
                    <div className="container">
                        <div className="row m-10-hor">
                            <div className="col-12">
                                <h1 className="text-center">
                                    {translateLang('createcollection_title')}
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="container">
                <div className="row">
                    <div className="col-lg-10 offset-lg-1 mb-5">
                        <div id="form-create-item">
                            <div className="field-set">
                                <h5>
                                    {'Contract Address '}
                                    <b style={{ color: 'red' }}>*</b>
                                </h5>
                                <p>This address{"'"}s all nfts will show to your collection.</p>
                                <div className="contract__address">
                                    <input
                                        type="text"
                                        name="contract_address"
                                        className="form-control"
                                        placeholder="0x0000..."
                                        onChange={(e) => setAddress(e.target.value)}
                                        value={address}
                                    />
                                    {verify ? (
                                        <button className="btn-main">Verified</button>
                                    ) : loading ? (
                                        <button className="btn-main">
                                            <span
                                                className="spinner-border spinner-border-sm"
                                                aria-hidden="true"></span>
                                        </button>
                                    ) : (
                                        <button className="btn-main" onClick={handleVerify}>
                                            Verify
                                        </button>
                                    )}
                                </div>
                                <div className="spacer-single"></div>
                                <h5>
                                    {translateLang('logoimage')} <b style={{ color: 'red' }}>*</b>
                                </h5>
                                <p>
                                    This image will also be used for navigation. 350 * 350
                                    recommended.
                                </p>
                                <div className="c-create-file">
                                    <p className="file_name">
                                        {logoImage ? (
                                            <div className="mask">
                                                <img src={logoImage} alt="" />
                                            </div>
                                        ) : (
                                            <i className="bg-color-2 i-boxed icon_image"></i>
                                        )}
                                    </p>
                                    <div className="browser_button">
                                        <div className="browse">
                                            <input
                                                type="button"
                                                className="btn-main"
                                                value={translateLang('browse')}
                                            />
                                            <input
                                                id="upload_file"
                                                type="file"
                                                multiple
                                                accept="image/*, video/*"
                                                onChange={handleLogoImgChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="spacer-single"></div>
                                <h5>
                                    {translateLang('bannerimage')} <b style={{ color: 'red' }}>*</b>
                                </h5>
                                <p>
                                    This image will appear at the top of your collection page. Avoid
                                    including too much text in this banner image, as the dimensions
                                    change on different devices. 1400 * 350 recommended.
                                </p>
                                <div className="d-create-file">
                                    <p className="file_name">
                                        {bannerImage ? (
                                            <img src={bannerImage} alt="" />
                                        ) : (
                                            <i className="bg-color-2 i-boxed icon_image"></i>
                                        )}
                                    </p>
                                    <div className="browse">
                                        <input
                                            type="button"
                                            className="btn-main"
                                            value={translateLang('browse')}
                                        />
                                        <input
                                            id="upload_file"
                                            type="file"
                                            multiple
                                            accept="image/*, video/*"
                                            onChange={handleBannerImgChange}
                                        />
                                    </div>
                                </div>
                                <div className="spacer-single"></div>
                                <h5>
                                    {translateLang('name')} <b style={{ color: 'red' }}>*</b>
                                </h5>
                                <input
                                    type="text"
                                    name="item_name"
                                    id="item_name"
                                    className="form-control"
                                    placeholder="your nft name"
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                />
                                <div className="spacer-30"></div>
                                <h5>{translateLang('externallink')}</h5>
                                <p>
                                    CLOUD9 will include a link to this URL on this item{"'"}s detail
                                    page, so that users can click to learn more about it. You are
                                    welcome to link to your own webpage with more details.
                                </p>
                                <div className="social">
                                    <span>
                                        <i className="fa fa-twitter-square"></i>
                                        <input
                                            type="text"
                                            name="item_link"
                                            className="form-control"
                                            placeholder="https://twitter.com/"
                                            onChange={(e) => setExtLink1(e.target.value)}
                                            value={extLink1}
                                        />
                                    </span>
                                    <span>
                                        <i className="fa fa-facebook-square"></i>
                                        <input
                                            type="text"
                                            name="item_link"
                                            className="form-control"
                                            placeholder="https://facebook.com/"
                                            onChange={(e) => setExtLink2(e.target.value)}
                                            value={extLink2}
                                        />
                                    </span>
                                    <span>
                                        <i className="fa fa-instagram"></i>
                                        <input
                                            type="text"
                                            name="item_link"
                                            className="form-control"
                                            placeholder="https://instagram.com/"
                                            onChange={(e) => setExtLink3(e.target.value)}
                                            value={extLink3}
                                        />
                                    </span>
                                </div>
                                <div className="spacer-30"></div>
                                <h5>{translateLang('description')}</h5>
                                <p>
                                    The description will be included on the item{"'"}s detail page
                                    underneath its image. Markdown syntax is supported.
                                </p>
                                <textarea
                                    data-autoresize
                                    name="item_desc"
                                    className="form-control"
                                    placeholder="provide a detailed description of your nft item"
                                    onChange={(e) => setDesc(e.target.value)}
                                    value={desc}
                                />
                                <div className="spacer-30"></div>
                                {!loading ? (
                                    <input
                                        type="button"
                                        id="submit"
                                        className="btn-main"
                                        value={translateLang('btn_createitem')}
                                        onClick={handleSubmit}
                                    />
                                ) : (
                                    <button className="btn-main">
                                        <span
                                            className="spinner-border spinner-border-sm"
                                            aria-hidden="true"></span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
