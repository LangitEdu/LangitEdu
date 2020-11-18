import React, { useEffect, useState } from 'react'
import Styled from '@emotion/styled'
import { useAuth } from '../../contexts/AuthContext'
import { db } from '../../config/Firebase'
import parse from 'html-react-parser'
import Navbar from '../../component/Navbar/Navbar'
    
const Result = ({match}) => {
    const [openPembahasan, setopenPembahasan] = useState("none")
    const [UserKuis, setUserKuis] = useState({})
    const kuisID = match.params.kuisID
    const { currentUser } = useAuth()

    useEffect(() => {
        const FireAction = async () => {
            const userKuisData = (await db.collection('Profile').doc(currentUser.uid).collection('Kuis').doc(kuisID).get()).data()

            setUserKuis(userKuisData)
        }

        FireAction()
    }, [kuisID, currentUser.uid])

    return (
    <>
        <Navbar />
        <Wrapper>
            <h1>{UserKuis.namaKuis}</h1>
            <div className="content">
                <div className="kiri">
                <p className="detailhasil">detail hasil</p>
                    <div className="hasil-card">
                        <h2>HASIL</h2>
                        <div className="separline"></div>
                        <p>{UserKuis.body}</p>
                    </div>
                </div>
                <div className="kanan">
                    <div className="tabletop"></div>
                    {Array.isArray(UserKuis.answer) && UserKuis.answer.map((ans, i)=>(
                        <div className="key-cont" key={i}> 
                            <div className="each-result">
                                <p className={`nomorsoal ${UserKuis.correction[i]}`}>{i+1}</p>
                                <p className={`${UserKuis.correction[i]}-text`}>{ans.length > 0 ? ans : "-"}</p>
                                <p>{UserKuis.kunciArr[i]}</p>
                                <button className="penjelasan" onClick={() => setopenPembahasan(openPembahasan === i ? 'none' : i)}>PENJELASAN</button>
                            </div>
                            { openPembahasan === i &&
                                <div className="each-pembahasan">
                                    {parse(UserKuis.pembahasan[i])}
                                </div>
                            }
                        </div>
                    ))}
                    
                </div>
            </div>
            
        </Wrapper>
    </>
    );
}
    
const Wrapper = Styled.div(() =>`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    padding: 42px 0;

    .content{
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: flex-start;
    }

    .key-cont{
        width: 100%;
    }
    
    @media only screen and (max-width: 680px) {
        .content{
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-direction: column;
        }
        .detailhasil{
            display: none;
        }
    }

    h1{
        font-family: Raleway;
        font-style: normal;
        font-weight: 800;
        font-size: 48px;
        line-height: 74px;
        text-align: center;
        text-transform: capitalize;
                
        color: #444444;
        margin-bottom: 32px;
    }

    .kanan{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        max-width: 436px;
        width: 100%;
        min-width: 340px;
        margin-left: 32px;

        .tabletop{
            height: 24px;
            width: 100%;
            background-image: url('/img/deco/tabletop.svg');
            background-size: contain;
            background-position: left;
            background-repeat: no-repeat;
            margin-bottom: 12px;
        }

        .each-pembahasan{
            width: 100%;
            margin-bottom: 12px;
            padding: 18px 24px;

            display: flex;
            justify-content: space-between;
            align-items: center;

            // background: #FFFFFF;
            // box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2), 0px 0px 2px rgba(0, 0, 0, 0.5);
            border: 1px solid #CCC;
            border-radius: 8px;
        }

        .each-result{
            width: 100%;
            height: 57px;
            margin-bottom: 12px;

            display: flex;
            justify-content: space-between;
            align-items: center;

            background: #FFFFFF;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2), 0px 0px 2px rgba(0, 0, 0, 0.5);
            border-radius: 8px;

            padding: 0 6px;

            .nomorsoal{
                width: 53px;
                height: 43px;

                border-radius: 6px;

                font-family: Oxygen;
                font-style: normal;
                font-weight: bold;
                font-size: 24px;
                line-height: 42px;
                text-align: center;

                /* white */

                color: #FFFFFF;
            }
            .true{
                background: #15B86A;
            }
            .true-text{
                color: #15B86A;
            }
            .false{
                background: #E8464A;
            }
            .false-text{
                color: #E8464A;
            }

            p{
                font-family: Raleway;
                font-style: normal;
                font-weight: bold;
                font-size: 20px;
                line-height: 42px;

                /* Gray 1 */

                color: #333333;
            }
            button.penjelasan{
                padding: 8px 20px;
                background: #FFA252;
                border: none;
                box-sizing: border-box;
                border-radius: 8px;

                font-family: Raleway;
                font-style: normal;
                font-weight: 800;
                font-size: 18px;
                line-height: 31px;
                text-align: center;

                /* white */

                color: #FFFFFF;

                &:hover{
                    background: #d88238;
                    text-decoration: none;
                    color: white;
                }
            }
        }
    }

    .kiri{
        margin-bottom: 48px;

        .detailhasil{
            color: #828282;
            height: 24px;
            margin-bottom: 12px;
            text-transform: uppercase;
        }

        .hasil-card{
            display: flex;
            justify-content: space-evenly;
            align-items: center;
            flex-direction: column;

            width: 254px;
            height: 250px;
            padding: 16px 0;
            
            background: #FFFFFF;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2), 0px 0px 2px rgba(0, 0, 0, 0.5);
            border-radius: 8px;
            
            h2{
                font-family: Raleway;
                font-style: normal;
                font-weight: 800;
                font-size: 22px;
                line-height: 26px;
                text-align: center;
                margin-bottom: 12px;

                /* Gray 1 */

                color: #333333;
            }

            .separline{
                width: 176px;
                height: 2px;

                background: #C4C4C4;
            }

            p{
                font-family: Oxygen;
                font-style: normal;
                font-weight: bold;
                font-size: 106px;
                line-height: 134px;
                text-align: center;

                /* orange */

                color: #FFA252;
            }
        }
    }
`)
    
export default Result