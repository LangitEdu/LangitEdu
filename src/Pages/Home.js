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
            </section>
            <section className="footer py-2">
                <div className="container mt-5">
                    <div className="row">
                        <div className="col-md-4">
                            <img className="img-fluid" src="/img/logo-blue.png" alt="Logo"/>
                        </div>
                        <div className="col-md-4">

                        </div>
                        <div className="col-md-4">

                        </div>
                    </div>
                </div>
            </section>
        </Wrapper>
    </>
    );
}
    
const Wrapper = Styled.div(() =>`
    .footer{
        background: #F5F5F5;
        box-shadow: inset 0px 20px 28px -12px rgba(0, 0, 0, 0.14);
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
