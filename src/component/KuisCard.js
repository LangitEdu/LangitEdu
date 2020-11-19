import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Styled from '@emotion/styled'
import { db } from '../config/Firebase'

import { useAuth } from '../contexts/AuthContext'
    
const KuisCard = ({kuisID}) => {
    const [Kuis, setKuis] = useState({})
    const [UserKuis, setUserKuis] = useState({})
    const [howManySoal, sethowManySoal] = useState(0)
    
    const { currentUser } = useAuth()

    useEffect(() => {
        const FireAction = async () => {
            const kuisData = (await db.collection('Kuis').doc(kuisID).get()).data()
            const userKuisData = (await db.collection('Profile').doc(currentUser.uid).collection('Kuis').doc(kuisID).get()).data()
            setKuis(kuisData)
            console.log(userKuisData)
            setUserKuis(userKuisData)
            sethowManySoal(kuisData.listQuestion.length)
        }


        FireAction()
    }, [])

    return (
        <Wrapper>
            {Kuis && <p className="kuisnama">{Kuis.nama}</p>}
            {UserKuis ?
            <>
                <div className="nilai-box">
                    <p>{UserKuis.body}</p>
                </div>
                <Link to={`/kuis/${kuisID}/result`} className="btn-bordered btn-bordered-green btn-shadow">DETAIL HASIL</Link>

            </>
            :
            <>
                <div className="linesepar"></div>
                <div className="kecil-cont">
                    <p className="kecil">{Kuis.durasi} MENIT</p>
                    <p className="kecil">{howManySoal} SOAL</p>
                </div>
                <Link to={`/kuis/${kuisID}`} className="btn-bordered btn-shadow">KERJAKAN</Link>

            </>

            }
        </Wrapper>
    );
}
    
const Wrapper = Styled.div(() =>`
    width: 224px;
    height: 290px;
    
    background: #FFFFFF;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2), 0px 0px 2px rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    margin: 12px;

    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;

    padding: 24px 0;

    .nilai-box{
        width: 164px;
        height: 85px;

        background: #FFFFFF;
        box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.2), 0px 0px 2px rgba(0, 0, 0, 0.5);
        border-radius: 8px;

        display: flex;
        justify-content: center;
        align-items: center;

        p{
            font-style: normal;
            font-weight: bold;
            font-size: 55px;
            line-height: 69px;
            text-align: center;

            /* orange */

            color: #FFA252;
            margin-bottom: 4px;
        }
    }

    .kuisnama{
        min-height: 52px;
        font-family: Raleway;
        font-style: normal;
        font-weight: 800;
        font-size: 22px;
        line-height: 26px;
        text-align: center;
        max-width: 90%;
        display: flex;
        justify-content: center;
        align-items: center;

        /* Gray 1 */

        color: #333333;
    }
    
    .kecil{
        font-family: Oxygen;
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        line-height: 25px;
        text-align: center;

        /* Gray 3 */

        color: #828282;
        margin: 4px;
    }

    .btn-bordered{
        padding: 8px 0;
        width: 172px;
    }

    .linesepar{
        height: 1px;
        width: 70%;
        background: #aaa;
    }
`)
    
export default KuisCard