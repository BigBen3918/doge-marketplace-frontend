import React from 'react';
import SliderCarousel from '../components/SliderCarouselsingle';
import FeatureBox from '../components/FeatureBox';
import CarouselCollection from '../components/CarouselCollection';
import Footer from '../menu/footer';
import { createGlobalStyle } from 'styled-components';
import Reveal from 'react-awesome-reveal';
import { keyframes } from '@emotion/react';
import { Link } from 'react-router-dom';
import { useBlockchainContext } from '../../context';

const fadeInUp = keyframes`
  0% {
    opacity: 0;
    -webkit-transform: translateY(40px);
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
`;

const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.sticky.white {
    background: black;
    border-bottom: 0;
    box-shadow: 0 4px 20px 0 rgba(200,200,255, .8);
  }
  header#myHeader.navbar .search #quick_search{
    color: #2e9bf6;
    background: rgba(255, 255, 255, .1);
  }
  header#myHeader .dropdown-toggle::after{
    color: #2e9bf6;
  }
  header#myHeader .logo .d-block{
    display: none !important;
  }
  header#myHeader .logo .d-none{
    display: none !important;
  }
  header#myHeader .logo .d-3{
    display: block !important;
  }
  .jumbotron.no-bg{
    background: center bottom;
    background-size: cover;
  }
  footer.footer-light .subfooter span img.d-1{
    display: none !important;
  }
  footer.footer-light .subfooter span img.d-3{
    display: inline-block !important;
  }
  .de_countdown{
    right: 10px;
    color: #fff;
  }
  .author_list_pp{
    margin-left:0;
  }
  footer.footer-light .subfooter{
    border-top: 1px solid rgba(255,255,255,.1);
  }
`;

export default function Homethree() {
    const [state, { translateLang }] = useBlockchainContext();

    return (
        <div>
            <GlobalStyles />
            <section className="jumbotron no-bg">
                <div className="container">
                    <div className="row align-items-center slider-content">
                        <div className="col-lg-6 px-0">
                            <SliderCarousel />
                        </div>
                        <div className="col-lg-6">
                            <div className="spacer-single"></div>
                            <Reveal
                                className="onStep"
                                keyframes={fadeInUp}
                                delay={300}
                                duration={600}
                                triggerOnce>
                                <h1 className="">{translateLang('home_txt1')}</h1>
                            </Reveal>
                            <Reveal
                                className="onStep"
                                keyframes={fadeInUp}
                                delay={600}
                                duration={600}
                                triggerOnce>
                                <p className=" lead">{translateLang('home_txt2')}</p>
                            </Reveal>
                            <div className="spacer-10"></div>
                            <Reveal
                                className="onStep"
                                keyframes={fadeInUp}
                                delay={800}
                                duration={900}
                                triggerOnce>
                                <Link to="/explore" className="btn-main lead">
                                    {translateLang('explore')}
                                </Link>
                                <div className="mb-sm-30"></div>
                            </Reveal>
                            <div className="spacer-double"></div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="container no-top">
                <div className="row">
                    <div className="col-lg-12">
                        <h2 className="style-2">{translateLang('notablecollection')}</h2>
                    </div>
                </div>
                <div className="container no-top">
                    <div className="row">
                        <div className="col-lg-12 px-0">
                            <CarouselCollection />
                        </div>
                    </div>
                </div>
                <div className="spacer-double"></div>
            </section>

            {/* <section className="container no-top">
                <div className="row">
                    <div className="col-lg-12">
                        <h2 className="style-2">Top collections </h2>
                    </div>
                    <div className="col-lg-12">
                        <AuthorList />
                    </div>
                    <div className="spacer-20"></div>
                    <div className="col-lg-12 centered">
                        <Link
                            to="/rangking"
                            className="btn-main lead rankButton"
                        >
                            Go to Rangkings
                        </Link>
                    </div>
                </div>
                <div className="spacer-double"></div>
            </section> */}

            {/* <section className="container no-top">
                <div className="row">
                    <div className="col-lg-12">
                        <h2 className="style-2">{translateLang('createandsell')}</h2>
                    </div>
                </div>
                <div className="container px-0">
                    <FeatureBox />
                </div>
            </section> */}

            <Footer />
        </div>
    );
}
