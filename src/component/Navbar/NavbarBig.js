import React, { useState } from 'react'
import useResize from 'use-resize'
import { Link, useHistory } from 'react-router-dom'
import Styled from '@emotion/styled'
import OutsideClickHandler from 'react-outside-click-handler'
import RouteName from '../../config/Route'

import NavbarMobile from './NavbarMobile'
import { useAuth } from '../../contexts/AuthContext'

const Navbar = ({SetError}) => {
    const [openAction, setopenAction] = useState(false)
    const {currentUser, logout, IsAdmin} = useAuth()
    const history = useHistory()
    const screen = useResize().width
    
    const handleLogout = async (e) => {
        e.preventDefault()
        try{
            await logout()
            history.push(RouteName.login)
        }catch(err){
            SetError(err)
        }
    }

    if (screen > 1100) {
    return (
        <Wrapper currentUser={currentUser} openAction={openAction}>
            <nav>
                <div className="contain-size-sp">
                    <Link to={RouteName.home} className="logo-cont">
                        <div className="logo"></div>
                    </Link>

                    <div className="menu">
                        {currentUser  && <Link to={RouteName.dashboard} className="link">DASHBOARD</Link>}
                        <Link to={RouteName.listKomunitas} className="link">KOMUNITAS</Link>
                        <Link to={RouteName.topik} className="link">TOPIK</Link>
                        {!currentUser && <Link to={RouteName.login} className="link">MASUK</Link>}
                        {!currentUser && <Link to={RouteName.register} className="link orange-btn">DAFTAR</Link>}
                        {IsAdmin  && <Link to={RouteName.admin} className="link">ADMIN</Link>}
                    </div>

                    {currentUser &&  
                        <OutsideClickHandler onOutsideClick={() => {setopenAction(false)}}>
                            <div className="user-info">
                                <Link to={RouteName.dashboard}><div className="ava"></div></Link>
                                <div className="user-detail">
                                    <p className="halo">Halo,</p>
                                    <div className="anti-overflow">
                                        <p className="username">{currentUser.displayName}</p>
                                    </div>
                                </div>

                                <div className="flip-btn" onClick={() => setopenAction(!openAction)}>
                                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.8125 0H17.1875C19.8454 0 22 2.15463 22 4.8125V17.1875C22 19.8454 19.8454 22 17.1875 22H4.8125C2.15463 22 0 19.8454 0 17.1875V4.8125C0 2.15463 2.15463 0 4.8125 0ZM1.375 17.1875C1.375 19.086 2.91401 20.625 4.8125 20.625H17.1875C19.086 20.625 20.625 19.086 20.625 17.1875V4.8125C20.625 2.91401 19.086 1.375 17.1875 1.375H4.8125C2.91401 1.375 1.375 2.91401 1.375 4.8125V17.1875Z" fill="#B9B9B9"/><path d="M15.8121 6.31125V4.125H17.1871V6.31125C18.256 6.70506 18.8032 7.89078 18.4094 8.95963C18.2005 9.52634 17.7538 9.97305 17.1871 10.1819V17.875H15.8121V10.1887C14.7414 9.80014 14.1884 8.61708 14.577 7.54634C14.7855 6.97202 15.2378 6.51969 15.8121 6.31125Z" fill="#B9B9B9"/><path d="M10.3121 11.8181V11.8113V4.125H11.6871V11.8113C12.756 12.2051 13.3032 13.3908 12.9094 14.4596C12.7005 15.0263 12.2538 15.473 11.6871 15.6819V17.875H10.3121V15.6887C9.24327 15.2949 8.69606 14.1092 9.08987 13.0404C9.2987 12.4737 9.7454 12.0269 10.3121 11.8181Z" fill="#B9B9B9"/><path d="M4.81212 7.69312V7.68625V4.125H6.18712V7.68625C7.25597 8.08006 7.80317 9.26578 7.40937 10.3346C7.20054 10.9013 6.75383 11.348 6.18712 11.5569V17.875H4.81212V11.5637C3.74327 11.1699 3.19606 9.98422 3.58987 8.91537C3.7987 8.34866 4.2454 7.90195 4.81212 7.69312Z" fill="#B9B9B9"/></svg>
                                </div>

                                <div className="actions">
                                    <Link className="btn-action" to={RouteName.editProfile}>UBAH</Link>
                                    <Link className="btn-action c-red" to="#" onClick={handleLogout}>LOGOUT</Link>
                                </div>
                            </div>
                        </OutsideClickHandler>
                    }
                </div>
            </nav>
        </Wrapper>
    )}
    else{
    return (
        <NavbarMobile currentUser={currentUser} openAction={openAction} setopenAction={setopenAction} handleLogout={handleLogout} IsAdmin={IsAdmin}/>
    )
    }
}
    
const Wrapper = Styled.div(({currentUser, openAction}) =>`
    position: sticky;
    top: 0;
    z-index: 100;

    nav{
        width: 100%;
        height: 118px;
        background: #FAFAFA;
        box-shadow: 0px 8px 8px rgba(0, 0, 0, 0.2);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 ${currentUser ? "32px" : ""};
        
        div.contain-size-sp{
            width: 100%;
            height: 100%;
            max-width: 1200px;
            padding: 0 ${currentUser ? 0 : "32px"} 0 32px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            
            .logo-cont{
                max-width: 170px;
                width: 170px;
                min-width: 170px;
                height: 100%;  
                margin-left: 50px;

                .logo{
                    width: 100%;
                    height: 100%;
                    background-image: url('/img/logo-blue.png');
                    background-size: contain;
                    background-position: center;
                    background-repeat: no-repeat;
                }
            }

            .menu{
                display: flex;
                justify-content: center;
                align-items: center;

                .link{
                    font-family: Oxygen;
                    letter-spacing: 0.5px;
                    font-style: normal;
                    font-weight: bold;
                    font-size: 20px;
                    line-height: 25px;
                    text-align: center;
                    margin: 0 16px;

                    /* tosca */

                    color: #209FBC;

                    &:hover{
                        text-decoration: none;
                        color: #FFA252;
                    }
                }
                .orange-btn{
                    font-family: Raleway;
                    font-weight: 700;
                    padding: 12px 32px;
                    border-radius: 100px;
                    background: #FFA252;
                    color: white;

                    &:hover{
                        text-decoration: none;
                        background: #d88238;
                        color: white;
                    }
                }
            }
            
            .user-info{
                position: relative;
                width: 293px;
                height: 85px;

                background: #F5F5F5;
                border: 1px solid #BCBCBC;
                box-sizing: border-box;
                border-radius: 12px;
                display: flex;
                justify-content: flex-start;
                padding: 0 12px;
                align-items: center;

                .flip-btn{
                    position: absolute;
                    right: 12px;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-radius: 8px;

                    &:hover{
                        background: #e0e0e0;
                    }
                }
                
                .actions{
                    position: absolute;
                    border-radius: 14px;
                    top: 0;
                    left: 0;
                    height: 100%;
                    width: 75%;
                    display: ${openAction ? "flex" : "none"};
                    justify-content: flex-start;
                    align-items: center;
                    padding-left: 16px;
                    background: #F5F5F5;
                    z-index: 10;

                    .btn-action{
                        font-family: Raleway;
                        font-weight: 700;
                        padding: 8px 12px;
                        border-radius: 10px;
                        color: white;
                        margin: 0 4px;
                        background: #FFA252;

                        
                    }
                    .c-red{
                        background: #d9534f;
                    }
                }

                .ava{
                    min-width: 62px;
                    min-height: 62px;
                    max-width: 62px;
                    max-height: 62px;
                    width: 62px;
                    height: 62px;

                    background: white url('${currentUser ? currentUser.photoURL : ""}');
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;

                    border: 1px solid #BCBCBC;
                    box-sizing: border-box;
                    border-radius: 36px;
                }

                .user-detail{
                    margin-left: 12px;

                    .anti-overflow{
                        max-width: 136px;
                        height: 28px;
                        overflow: hidden;

                    }
                    p.username{
                        display: inline;
                        font-family: Raleway;
                        font-style: normal;
                        font-weight: 800;
                        font-size: 21px;
                        line-height: 27px;
                        
                        /* Gray 2 */
                        
                        color: #4F4F4F;
                        text-transform: capitalize;
                    }
                    p.halo{
                        font-family: Oxygen;
letter-spacing: 0.5px;
                        font-style: normal;
                        font-weight: bold;
                        font-size: 16px;
                        line-height: 20px;
                        
                        /* Gray 4 */
                        
                        color: #BDBDBD;
                    }
                }
            }
        }
    }
`)
    
export default Navbar