import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../component/Navbar/Navbar'
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
                    <h2>Membuat belajar bersama teman lebih menyenangkan</h2>
                    <img src="/img/ilus/bersama.svg" alt=""/>
                </div>
            </div>
        </Wrapper>
    </>
    );
}
    
const Wrapper = Styled.div(() =>`

    .supersecond{
        height: 408px;
        box-shadow: inset 0px -24px 20px -12px rgba(0, 0, 0, 0.12);
        margin-bottom: 100px;
        
        background-image: url('/img/deco/bubbles.svg');
        background-size: contain;
        background-position: left bottom;
        background-repeat: no-repeat;

        display: flex;
        justify-content: center;
        align-items: center;

        h2{
            max-width: 482px;
            font-family: Raleway;
            font-style: normal;
            font-weight: bold;
            font-size: 43px;
            line-height: 50px;

            /* tosca */

            color: #209FBC;
        }
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
