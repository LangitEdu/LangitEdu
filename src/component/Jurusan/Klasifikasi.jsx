import React from 'react'
import Styled from '@emotion/styled'
import useResize from 'use-resizing'
import BackButton from './BackButton'

const Klasifikasi = ({area, klasifikasi, setklasifikasi, setstep, kluster}) => {
    const screen = useResize().width

    const options = {
        teknik: ['bangunan', 'kebumian', 'kelautan', 'komputer'],
        kesehatan: ['dokter', 'dental', 'masyarakat', 'farmasi'],
        pertanian: ['agrikultur', 'ternak', 'teknologi pertanian'],
        mipa: ['bangunan', 'kebumian', 'kelautan', 'komputer'],
        ekonomi: ['bangunan', 'kebumian', 'kelautan', 'komputer'],
        sosial: ['bangunan', 'kebumian', 'kelautan', 'komputer'],
        humaniora: ['bangunan', 'kebumian', 'kelautan', 'komputer']
    }

    const handleClick = (option) => {
        setklasifikasi(option)
        setstep(3)
    }

    return (
        <Wrapper screen={screen} klasifikasi={klasifikasi}>
            <div className={`${kluster} kluster-head`}>
                <h2>{area}</h2>
            </div>
            <p className="instruction">Pilih Klasifikasi</p>
            <div className="select">
                {options[area].map((option, i) => 
                    <div className={`card-klasifikasi ${klasifikasi !== option && klasifikasi !== 'initial' ? 'dimm' : ''}`} onClick={() => handleClick(option)} key={i}>
                        <p>{option}</p>
                    </div>
                )}
            </div>
            <BackButton tostep={1} setstep={setstep}/>
        </Wrapper>
    )
}

const Wrapper = Styled.div(({screen}) =>`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding-top: 52px;

    .dimm{
        opacity: 0.5;
        filter: saturate(0)
    }

    .select{        
        max-width: 572px;
        width: 90%;
        min-width: 320px;


        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    .card-klasifikasi{
        width: 100%;
        height: 88px;
        left: 410px;
        top: 741px;

        background: #F5F5F5;
        border: 1px solid #C7C7C7;
        box-sizing: border-box;
        border-radius: 16px;

        display: flex;
        justify-content: center;
        align-items: center;

        margin: 12px 0;
        transition: 0.1s;
        
        p{
            transition: 0.1s;
            font-family: Montserrat;
            font-style: normal;
            font-weight: 800;
            font-size: 35px;
            line-height: 43px;
            text-align: center;
            text-transform: uppercase;

            color: #3d3d3d;
        }
        
        
        &:nth-of-type(1):hover {
            background: #64bdd1 !important;
        }
        &:nth-of-type(2):hover {
            background:  #da6567 !important;
        }
        &:nth-of-type(3):hover {
            background: #56c48f !important;
        }
        &:nth-of-type(4):hover {
            background: #9362c2 !important;
        }
        
        &:hover p{
            color: #FFFFFF;
            filter: brightness(1.3);
        }
    }

    .saintek{
        background: url('/img/jurusan/area/saright.svg'), url('/img/jurusan/area/saleft.svg'), #9B51E0;
    }
        
    .soshum{
        background: url('/img/jurusan/area/sosright.svg'), url('/img/jurusan/area/sosleft.svg'), #00A37C;
    }   

    .kluster-head{
        max-width: 572px;
        width: 90%;
        min-width: 320px;
        height: 104px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 52px;

        background-position: left, right;
        background-size: contain;
        background-repeat: no-repeat;

        box-shadow: -8px -8px 6px #FFFFFF, 8px 8px 10px rgba(174, 174, 192, 0.38);
        border-radius: 16px;

        h2{
            font-family: Montserrat;
            font-style: normal;
            font-weight: bold;
            font-size: 43px;
            line-height: 50px;
            text-align: center;
            text-transform: uppercase;
    
            color: #FFFFFF;
        }
    }

    p.instruction{
        font-family: Raleway;
        font-style: normal;
        font-weight: bold;
        font-size: 27px;
        line-height: 32px;
        text-align: center;

        /* Gray 2 */
        margin-bottom: 32px;
        color: #4F4F4F;
    }
`)

export default Klasifikasi