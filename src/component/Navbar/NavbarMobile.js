import React from 'react'
import { Link } from 'react-router-dom'
import Styled from '@emotion/styled'
import RouteName, { routeSet } from '../../config/Route'
    
const NavbarMobile = ({currentUser, openAction, setopenAction, handleLogout, IsAdmin}) => {
    return (
        <Wrapper currentUser={currentUser} openAction={openAction} IsAdmin={IsAdmin}>
            <nav>
                    <div className="contain-height">
                        <Link to={RouteName.home} className="logo-cont">
                            <div className="logo"></div>
                        </Link>
                        <div className="right-things">
                            {currentUser ? <Link to={RouteName.dashboard}><div className="ava"></div></Link> : <Link to={RouteName.login} className="link orange-btn">MASUK</Link>}
                            <button onClick={()=> setopenAction(!openAction)}></button>
                        </div>
                    </div>

                <div className="menu">
                    {currentUser  && <Link to={RouteName.dashboard} className="link">BERANDA</Link>}
                    <Link to={RouteName.listKomunitas} className="link">KOMUNITAS</Link>
                    <Link to={RouteName.topik} className="link">TOPIK</Link>
                    <Link to={RouteName.RekomendasiJurusan} className="link">REKOMENDASI</Link>
                    {!currentUser && <Link to={RouteName.login} className="link">MASUK</Link>}
                    {!currentUser && <Link to={RouteName.register} className="link">DAFTAR</Link>}
                    {IsAdmin  && <Link to={RouteName.admin} className="link">ADMIN</Link>}

                    {currentUser &&
                    <>
                    <div className="line-cont"><div className="line"></div></div>
                    <div className="actions">
                        <Link className="btn-action" to={routeSet.editProfile({uid:currentUser.uid})}>UBAH</Link>
                        <Link className="btn-action c-red" to="#" onClick={handleLogout}>LOGOUT</Link>
                    </div>
                    </>
                    }
                </div>

            </nav>
        </Wrapper>
    );
}
    
const Wrapper = Styled.div(({currentUser, openAction, IsAdmin}) =>`
    position: sticky;
    top: 0;
    z-index: 99;

    nav{
        width: 100%;
        height: ${openAction && IsAdmin ? "407px" : openAction ? "357px" : "80px"};
        background: #FAFAFA;
        box-shadow: 0px 8px 8px rgba(0, 0, 0, 0.2);
        padding: 0 16px;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-direction: column;
        transition: 0.5s;
        overflow: hidden;

        .line-cont{
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 8px 0 12px 0;
            
            .line{
                width: 92%;
                height: 1px;
                background: #209FBC;
            }
        }
        
        .contain-height{
            height: 80px;
            width: 100%;
            
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #FAFAFA;
            z-index: 100;
        }
        
        .menu{
            height: 100%;
            width: 100%;
            display: flex;
            justify-content: space-evenly;
            align-items: flex-start;
            flex-direction: column;
            padding-bottom: 12px;
            
            .link{
                font-family: Oxygen;
letter-spacing: 0.5px;
                font-style: normal;
                font-weight: bold;
                font-size: 20px;
                line-height: 25px;
                text-align: center;
                margin: 12px 16px;

                /* tosca */

                color: #209FBC;

                &:hover{
                    text-decoration: none;
                    color: #FFA252;
                }
            }

            .actions{
                margin: 12px;
                
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
        }

        .logo-cont{
            max-width: 120px;
            width: 120px;
            min-width: 120px;
            height: 100%;  
            display: flex;
            justify-content: center;
            align-items: center;

            .logo{
                width: 100%;
                height: 100%;
                background-image: url('/img/logo-blue.png');
                background-size: contain;
                background-position: center;
                background-repeat: no-repeat;
            }
        }

        .right-things{
            height: 60%;
            display: flex;
            justify-content: flex-end;
            align-items: center;

            .orange-btn{
                font-family: Raleway;
                font-weight: 800;
                font-size: 14px;
                padding: 8px 16px;
                border-radius: 100px;
                background: #FFA252;
                color: white;
    
                &:hover{
                    text-decoration: none;
                    background: #d88238;
                    color: white;
                }
            }

            button{
                height: 100%;
                width: 24px;
                background: #FAFAFA url('/img/deco/threedot.svg');
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                padding: 0;
                margin-left: 12px;

                border-radius: 6px;border: none;

                &:hover{
                    filter: brightness(0.9);
                    border: none;
                }
            }

            .ava{
                min-width: 44px;
                min-height: 44px;
                max-width: 44px;
                max-height: 44px;
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
        }
    }
`)
    
export default NavbarMobile