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
        </Wrapper>
    </>
    );
}
    
const Wrapper = Styled.div(() =>`

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

        .contain-size{
            display: flex;
            justify-content: space-between;
            align-items: center;

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
