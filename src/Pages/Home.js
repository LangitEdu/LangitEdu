import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../component/Navbar/NavbarBig'
import RouteName from '../config/Route'
import Styled from '@emotion/styled'

    
const Home = () => {
    return (
    <>
        <Navbar />
        <Wrapper>

            <div className="supertron">
                <div className="contain-size">
                    <img src="/img/ilus/study.svg" alt=""/>
                    <div className="telling-cont">
                        <h1>Belajar dimanapun <br/>dan kapanpun </h1>
                        <Link className="btn-bordered" to={RouteName.register}>MULAI BELAJAR</Link>
                    </div>
                </div>
            </div>

            <div className="supersecond">
                <div className="contain-size">
                    <h2 className="tosca-text">Membuat belajar bersama teman lebih menyenangkan</h2>
                    <img src="/img/ilus/bersama.svg" alt=""/>
                </div>
            </div>

            <section className="container jelajah pb-5">
                <div className="header-section d-flex justify-content-between">
                    <h2 className="tosca-text">Jelajahi</h2>
                    <div>
                        <Link className="btn btn-outline-dark font-weight-bold mr-3" to={RouteName.listKomunitas} >KOMUNITAS</Link>
                        <Link className="btn btn-outline-dark font-weight-bold" to={RouteName.topik} >TOPIK</Link>
                    </div>
                </div>
                <hr/>

                <div className="class-wrapper px-5 py-3 mt-4">

                    <div className="post-item row mb-5">
                        <div className="col-md-4">
                            <div className="thumbnail">
                                <img className="img-fluid" src="/img/thumbnail.png" alt="thumbnail.png"/>
                            </div>
                        </div>
                        <div className="col-md-8">
                            <div className="detail py-md-3">
                                <h3 className="mb-3" >Diskusi dengan komunitas belajarmu</h3>
                                <p>Kamu dapat dengan langsung bertanya dan berdiskusi tentang topik terkait bersama member lainnya</p>
                                <br/>
                                <Link className="btn btn-outline-dark font-weight-bold mr-3" to={RouteName.listKomunitas} >CARI KOMUNITASMU <i class="ml-2 fas fa-search"></i> </Link>
                            </div>
                        </div>
                    </div>

                    <div className="post-item row mb-5">
                        <div className="col-md-4">
                            <div className="thumbnail">
                                <img className="img-fluid" src="/img/thumbnail.png" alt="thumbnail.png"/>
                            </div>
                        </div>
                        <div className="col-md-8">
                            <div className="detail py-md-3">
                                <h3 className="mb-3" >Temukan topik belajar untukmu</h3>
                                <p>Beragam topik belajar tersedia di langit edu dan siap untuk kamu pelajari sekarang juga</p>
                                <br/>
                                <Link className=" btn btn-outline-dark font-weight-bold mr-3" to={RouteName.topik} >Jelajahi topik <i class="ml-2 fas fa-search"></i></Link>
                            </div>
                        </div>
                    </div>

                    <div className="post-item row mb-5">
                        <div className="col-md-4">
                            <div className="thumbnail">
                                <img className="img-fluid" src="/img/thumbnail-2.png" alt="thumbnail.png"/>
                            </div>
                        </div>
                        <div className="col-md-8">
                            <div className="detail py-md-3">
                                <h3 className="mb-3" >Kuis yang dikemas dengan seru</h3>
                                <p>Dengan konsep berbeda, langit edu membawakan kuis dengan cara yang menyenangkan seperti permainan</p>
                                <br/>
                            </div>
                        </div>
                    </div>
                </div>

            </section>
            <section className="footer py-2">
                <div className="container mt-5 mb-5">
                    <div className="row">
                        <div className="col-md-4">
                            <img className="img-fluid" src="/img/logo-blue.png" alt="Logo"/>
                            <h4 className="mt-4 mb-3" >Tentang kami</h4>
                            <p>Dengan konsep berbeda, di langitedu.com membawakan kuis dengan cara yang menyenangkan seperti permainan</p>
                        </div>
                        <div className="col-md-4">
                            <h4 className="mb-3" >Kontak Kami</h4>
                            <ul>
                                <li><i className="fas fa-envelope mr-2"></i>Info@langitedu.com</li>
                                <li><i class="fab fa-whatsapp mr-2"></i>089889883637</li>
                            </ul>
                        </div>
                        <div className="col-md-4">
                            <h4 className="mb-3">Sosial Media</h4>
                            <ul>
                                <li><i class="fab fa-twitter mr-2"></i><a href="http://twitter.com" target="_blank" rel="noopener noreferrer">langit.edu</a></li>
                                <li><i class="fab fa-instagram mr-2"></i><a href="http://instagram.com" target="_blank" rel="noopener noreferrer">langit.edu</a></li>
                                <li><i class="fab fa-facebook mr-2"></i><a href="http://facebook.com" target="_blank" rel="noopener noreferrer">langit.edu</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
            <section className="footer-copyright py-2">
                <div className="container d-flex justify-content-between flex-md-row flex-column">
                    <div className="copyright">
                        © Copyright 2020
                    </div>
                    <div className="nama">
                    <img src="/img/white-logo-icon.png" alt="Logo Langit Edu" className="img-fluid"/> LangitEdu | Belajar dimanapun dan kapanpun
                    </div>
                </div>
            </section>
        </Wrapper>
    </>
    );
}
    
const Wrapper = Styled.div(() =>`

    .footer-copyright{
        background : #007A95;
        color : white;
        font-weight : 400
    }

    .btn{
        text-transform: uppercase;
        border-radius : .7rem
    }

    .post-item {
        
        color : #209FBC;

        .thumbnail{
            overflow:hidden;
            border-radius:20px;
            box-shadow: 0px 0px 23px rgba(0, 0, 0, 0.25);
            position : relative;
            width: fit-content;
        }

        .detail{
            h3{
                font-size:3rem;
            }
            p{
                font-size: 1.2rem;
            }

        }

    }

    .footer{
        background: #F5F5F5;
        box-shadow: inset 0px 20px 28px -12px rgba(0, 0, 0, 0.14);
        color : #209FBC;

        h4{
            font-weight : bold
        }
        ul {
            list-style: none;
            padding-left: 0;

            li{
                font-size:1.2rem
            }
        }
    }
    .jelajah{

        hr{
            border-top: 2px solid #209FBC;
        }
    }

    h2.tosca-text{
        max-width: 482px;
        font-family: Raleway;
        font-style: normal;
        font-weight: bold;
        font-size: 43px;
        line-height: 50px;

        /* tosca */

        color: #209FBC;
    }

    .supersecond{
        height: 408px;
        box-shadow: inset 0px -24px 20px -12px rgba(0, 0, 0, 0.12);
        margin-bottom: 50px;
        
        background-image: url('/img/deco/bubbles.svg');
        background-size: contain;
        background-position: left bottom;
        background-repeat: no-repeat;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .supertron{
        width: 100%;
        height: 454px;
        background-image: url('/img/bg-jumbotron.svg');
        background-size: cover;
        background-position: bottom;
        background-repeat: no-repeat;

        padding-bottom: 32px;

        display: flex;
        justify-content: center;
        align-items: center;

        box-shadow: 0px 0px 20px 8px rgba(0, 0, 0, 0.25);


        .contain-size{
            display: flex;
            justify-content: space-between;
            align-items: center;

            a{                
                z-index: 0; 
            }

            img{
                margin-left: -32px;
                margin-right: 24px;
            }

            h1{
                
                font-family: Raleway;
                font-style: normal;
                font-weight: 800;
                font-size: 58px;
                line-height: 60px;
                margin-bottom: 48px;
                /* white */

                color: #FFFFFF;
            }
        }
    }    

 
`)
    
export default Home
