import React, { useState, useEffect } from 'react'
import Styled from '@emotion/styled'
import BackButton from './BackButton'
import { useAuth } from '../../contexts/AuthContext'
import { db } from '../../config/Firebase'

const DetailJurusan = ({jurusan, setstep}) => {
    const [savedJurusan, setsavedJurusan] = useState(null)
    const options = ['universitas gadjah mada', 'universitas indonesia', 'institut teknologi bandung', 'universitas diponegoro']
    
    const { currentUser } = useAuth()

    const handleSaveJurusan = () => {
        db.collection('Profile').doc(currentUser.uid).update({
            savedJurusan : jurusan
        })
    }

    useEffect(() => {
        db.collection('Profile').doc(currentUser.uid).onSnapshot(doc => {
            setsavedJurusan(doc.data().savedJurusan)
        })
    }, [currentUser])

    return (
        <Wrapper>
            <div className="header-detail">
                <h2>{jurusan}</h2>
            </div>
            <div className="desc">
                <p className="desc">Jurusan seputar mendesain bangunan supaya memiliki nilai estetika dan fungsi yang baik</p>
            </div>
            <button className={`btn-bordered${savedJurusan === jurusan ? '-gray' : ''}`} onClick={handleSaveJurusan}>{savedJurusan !== jurusan ? 'SIMPAN JURUSAN' : 'TERSIMPAN'}</button>
            <p className="instruction">PILIHAN UNIVERSITAS</p>
            {options.map((option, i) => (
                <div key={i} className="each-univ">
                    <div className="img" style={{background: `url('/img/jurusan/univ.svg'), ${ '#676726' }`}}></div>
                    <p>{option}</p>
                </div>
            ))}
            <div className="back">
                <BackButton tostep={3} setstep={setstep}/>
            </div>
        </Wrapper>
    )
}

const Wrapper = Styled.div(`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 54px 0;
    
    .back{
        margin-top: 32px;
        max-width: 560px;
        width: 90%;
    }
    
    p.instruction{
        font-family: Montserrat;
        font-style: normal;
        font-weight: 800;
        font-size: 32px;
        margin: 24px 0;
        line-height: 54px;
        /* identical to box height */
        
        text-align: center;
        
        color: #007A95;
    }
    div.desc{   
        max-width: 553px;
        width: 90%;
        min-width: 320px;
        margin: 24px 0;
        p{
            text-align: center;
        }
    }
    .header-detail{
        max-width: 553px;
        width: 90%;
        min-width: 320px;
        padding: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        
        background: #FFFFFF;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2), 0px 0px 2px rgba(0, 0, 0, 0.5);
        border-radius: 8px;
        
        h2{
            font-family: Raleway;
            font-style: normal;
            font-weight: bold;
            font-size: 39px;
            line-height: 46px;
            text-align: center;
            
            /* Gray 1 */
            
            color: #333333;
            text-transform: uppercase;
        }
    }
    
    .each-univ{
        max-width: 553px;
        width: 90%;
        min-width: 320px;
        padding: 24px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin: 12px 0;

        background: #FFFFFF;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2), 0px 0px 2px rgba(0, 0, 0, 0.5);
        border-radius: 8px;

        div.img{
            height: 74px;
            width: 74px;
            background-position: center;
            background-size: cover;
            background-repeat: no-repeat;
            border-radius: 50%;
            margin-right: 24px;
        }

        p{
            font-family: Raleway;
            font-style: normal;
            font-weight: bold;
            font-size: 28px;
            line-height: 33px;
            text-transform: capitalize;

            /* Gray 1 */

            color: #333333;
        }
    }
`)

export default DetailJurusan