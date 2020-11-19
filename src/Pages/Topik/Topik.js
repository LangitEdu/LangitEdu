import React, { useEffect, useState } from 'react'
import Styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { db, FieldValue } from '../../config/Firebase'
import Navbar from '../../component/Navbar/Navbar'
import { useAuth } from '../../contexts/AuthContext'

const Topik = ({match}) => {
    const topikKey = typeof match.params.topikKey == 'undefined' ? "default" : match.params.topikKey
    const [IsMember, setIsMember] = useState(false)
    const [Loading, setLoading] = useState(false)
    const [iswarnedJoin, setiswarnedJoin] = useState(true)
    const [TopikId, setTopikId] = useState()
    const [Topik, setTopik] = useState({})
    const {currentUser} = useAuth()

    useEffect(() => {

        const FireAction = async () => {
            const topikData = await db.collection('Topik').where("topikKey", "==", topikKey).get().then(function (querySnapshot) {
                let filler
                querySnapshot.forEach(function (doc) {
                        setTopikId(doc.id)
                        filler = doc.data()
                })
                return filler
            })
            console.log(topikData.journeyList)

            setTopik(topikData)
            setIsMember(topikData.member.includes(currentUser.uid))
        } 

        FireAction()

    }, [topikKey, currentUser])

    const handleJoinTopik = ()=>{
        console.log("haha");
        setLoading(true)
        db.collection('Topik').doc(TopikId).update({
            member : FieldValue.arrayUnion(currentUser.uid)
        }).then(()=>{
            db.collection('Profile').doc(currentUser.uid).update({
                topik : FieldValue.arrayUnion(TopikId)
            }).then(()=>{
                setIsMember(true)
                setLoading(false)
            }).catch(err=>{
                console.log(err);
                setLoading(false)
            })
        }).catch(err=>{
            console.log(err);
            setLoading(false)
        })
    }

    // const cekJumlahKuis = async (idjour) => {
    //     let lengthIs = (await db.collection('Journey').doc(idjour).get()).data().kuisList.length
    //     document.getElementById(idjour).innerHTML = lengthIs
    // }

    return (
    <>
        <Navbar />
        <Wrapper Topik={Topik}>
            {topikKey !== "default" && Topik && (
            <div className="content-wrapper">
                <div className="h1">
                    <h1>{Topik.nama}</h1>
                </div>
                {iswarnedJoin && !IsMember &&
                    <div className="warning-join">
                        <p>Silahkan join topik ini terlebih dahulu untuk bisa mengikuti journey dan kuisnya</p>
                        <button onClick={() => setiswarnedJoin(false)} className="no-btn"><svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M30.3749 10.9602C31.0667 10.2684 32.1883 10.2684 32.8801 10.9602C33.5719 11.6519 33.5719 12.7735 32.8801 13.4653L13.4649 32.8805C12.7732 33.5723 11.6516 33.5723 10.9598 32.8805C10.268 32.1887 10.268 31.0671 10.9598 30.3753L30.3749 10.9602Z" fill="#FFA252"/><path d="M32.8801 30.3753C33.5719 31.0671 33.5719 32.1887 32.8801 32.8805C32.1883 33.5723 31.0667 33.5723 30.3749 32.8805L10.9598 13.4653C10.268 12.7735 10.268 11.6519 10.9598 10.9602C11.6516 10.2684 12.7732 10.2684 13.4649 10.9602L32.8801 30.3753Z" fill="#FFA252"/></svg></button>
                    </div>
                }
                <div className="content">
                    <div className="topikdetail-card">
                        <div className="upper">
                            <p className="card-title">Deskripsi</p>
                            <div className="thumbnail"></div>
                            <p className="desc">{Topik.deskripsi}</p>
                        </div>
                        <button disabled={IsMember} onClick={handleJoinTopik} className={`btn-bordered-blue btn-shadow ${IsMember ? 'disableddd' : ''}`}>{IsMember ? "SUDAH TERDAFTAR" : "JOIN TOPIK"}</button>
                    </div>
                    <div className="journeylist">
                        <p>DAFTAR JOURNEY</p>
                        <div className="linesepar"></div>
                        { Array.isArray(Topik.journeyList) && Topik.journeyList.map((each, i)=>(
                            <div key={i} className="journeybox">
                                <div className="lefter">
                                    <p className="namajourney">{each.nama}</p>
                                    {/* <p className="kuisjourney" id={each.uid}>{cekJumlahKuis(each.uid)}</p> */}
                                </div>
                                
                                <Link className={`btn-see-journey ${IsMember ? '' : 'disabled'}`} to={`/journey/${each.uid}`}>
                                    <button className="no-btn"><svg width="32" height="34" viewBox="0 0 32 34" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.79604 19.2742C2.79344 19.2742 2.79474 19.2742 2.79474 19.2742L22.6541 19.2742L22.061 19.55C21.4813 19.8244 20.9539 20.1979 20.5024 20.6535L12.8749 28.281C11.8703 29.2399 11.7016 30.7826 12.4749 31.9361C13.375 33.1653 15.1011 33.4322 16.3304 32.5321C16.4297 32.4594 16.5241 32.3801 16.6128 32.2947L30.4058 18.5017C31.4837 17.425 31.4846 15.6784 30.4079 14.6005L30.4058 14.5983L16.6128 0.805358C15.534 -0.270408 13.7874 -0.267994 12.7115 0.810789C12.6269 0.895702 12.5478 0.986045 12.4749 1.08122C11.7016 2.23474 11.8703 3.7774 12.8749 4.73636L20.4886 12.3777C20.8934 12.7828 21.3587 13.1226 21.8679 13.3846L22.6955 13.757L2.94524 13.757C1.53603 13.7046 1.20257e-05 14.6784 1.09422e-05 16.3464C1.09422e-05 18.348 1.3344 19.2742 2.79604 19.2742Z" fill="white"/></svg></button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            )}
        </Wrapper>
    </>
    )
}
    
const Wrapper = Styled.div(({Topik}) =>`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 54px 0;

    .btn-see-journey{
        height: 54px;
        width: 54px;
        display: flex;
        justify-content: center;
        align-items: center;

        background: #FFA252;
        border-radius: 8px;
    }

    .content{
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-top: 24px;

        .journeylist{
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            margin-left: 40px;

            p{
                width: 100%;
                font-family: Raleway;
                font-style: normal;
                font-weight: bold;
                font-size: 20px;
                line-height: 23px;
                text-align: left;

                /* Gray 1 */

                color: #333333;
            }

            .linesepar{
                background: #aaa;
                width: 100%;
                height: 2px;
                margin: 12px 0 24px 0;
            }

            .journeybox{
                width: 100%;
                padding: 20px 16px;

                background: #FFFFFF;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2), 0px 0px 2px rgba(0, 0, 0, 0.5);
                border-radius: 8px;
                margin-bottom: 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;

                p{
                    max-width: 292px;
                }
            }
        }

        .topikdetail-card{
            width: 326px;
            min-width: 326px;
            min-height: 439px;

            background: #FFFFFF;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2), 0px 0px 2px rgba(0, 0, 0, 0.5);
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-direction: column;
            padding: 24px;

            .upper{
                display: flex;
                justify-content: flex-start;
                align-items: center;
                flex-direction: column;
            }

            .card-title{
                font-family: Raleway;
                font-style: normal;
                font-weight: 800;
                font-size: 38px;
                line-height: 45px;

                /* Gray 1 */

                color: #333333;
                margin-bottom: 24px;
            }

            .thumbnail{
                width: 240px;
                height: 240px;
                background-image: url('${Topik.thumbnail}');
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                border-radius: 8px;
                margin-bottom: 24px;
            }
            
            .desc{
                text-align: center;
                margin-bottom: 24px;
            }

            button{
                min-width: 240px;
            }
        }
    }

    .warning-join{
        width: 100%;
        background: rgba(255, 162, 82, 0.07);
        /* orange */
        
        border: 1px solid #FFA252;
        box-sizing: border-box;
        border-radius: 8px;
        
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 12px 12px 20px;
    }
    
    div.h1{
        margin-bottom: 24px;
        height: 94px;
        width: 100%;
        background: #209FBC;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2), 0px 0px 2px rgba(0, 0, 0, 0.5);
        border-radius: 8px;

        display: flex;
        justify-content: center;
        align-items: center;

        h1{
            font-family: Raleway;
            font-style: normal;
            font-weight: 800;
            font-size: 49px;
            line-height: 58px;
            text-align: center;

            /* white */

            color: #FFFFFF;
            text-transform: uppercase;
        }
    }

    .content-wrapper{
        max-width: 770px;
        width: 90%;
        min-width: 340px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    .foundtopik{
        width: 340px;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        border: 1px solid #AAA;
        border-radius: 12px;
        flex-direction: column;
        padding: 24px;
        margin-top: 32px;

        p{
            margin-bottom: 12px;
            font-family: Oxygen;
            font-weight: bold;
            font-size: 24px;
        }

    }

    form{
        width: 85%;
        max-width: 600px;
        min-width: 340px;
        display: flex;
        justify-content: center;
        align-items: center;

        input{
            width: 100%;
        }
        button{

        }
    }
    
`)
    
export default Topik