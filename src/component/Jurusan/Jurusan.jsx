import React from 'react'
import Styled from '@emotion/styled'
import BackButton from './BackButton'

const Area = ({klasifikasi, jurusan, setjurusan, setstep}) => {
    const options = {
        bangunan: ['arsitektur', 'teknik sipil', 'perencanaan wilayah dan tata kota'],
        kebumian: ['arsitektur', 'teknik sipil', 'perencanaan wilayah dan tata kota'],
        kelautan: ['arsitektur', 'teknik sipil', 'perencanaan wilayah dan tata kota'],
        komputer: ['arsitektur', 'teknik sipil', 'perencanaan wilayah dan tata kota']
    }

    const handleClick = (option) => {
        setjurusan(option)
        setstep(4)
    }

    return (
        <Wrapper>
            <p className="instruction">JURUSAN UNTUKMU</p>
            <div className="select">
                {options[klasifikasi].map((option, i) => 
                    <div className={`card ${jurusan !== option && jurusan !== 'initial' ? 'dimm' : ''}`} onClick={() => handleClick(option)} key={i}>
                        <p>{option}</p>
                        <p className="link">LEBIH LANJUT <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L8 8L1 15" stroke="#209FBC" strokeWidth="1.5"/></svg></p>
                    </div>
                )}
            </div>
            <BackButton tostep={2} setstep={setstep}/>
        </Wrapper>
    )
}

const Wrapper = Styled.div(() =>`
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

    .card{
        width: 100%;
        background: #FFFFFF;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2), 0px 0px 2px rgba(0, 0, 0, 0.5);
        border-radius: 8px;

        display: flex;
        justify-content: space-evenly;
        align-items: flex-start;
        flex-direction: column;

        padding: 24px 32px;
        margin: 12px;

        &:hover{
            background: #e0f2f7;
        }

        p{
            font-family: Montserrat;
            font-style: normal;
            font-weight: 800;
            font-size: 35px;
            line-height: 43px;
            text-transform: capitalize;

            color: #464646;
            margin-bottom: 12px;
        }
        
        p.link{
            font-family: Oxygen;
            font-style: normal;
            font-weight: bold;
            font-size: 19px;
            line-height: 24px;
            
            /* tosca */
            margin-bottom: 0;

            color: #209FBC;

            svg{
                margin-bottom: 4px;
            }
        }
    }

    .saintek{
        background: url('/img/jurusan/area/saright.svg'), url('/img/jurusan/area/saleft.svg'), #9B51E0;
    }
        
    .soshum{
        background: url('/img/jurusan/area/sosright.svg'), url('/img/jurusan/area/sosleft.svg'), #00A37C;
    }   

    .kluster-head{
        width: 548px;
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
        font-weight: 900;
        font-size: 44px;
        line-height: 54px;
        margin: 0 24px;
        margin-bottom: 32px;
        /* identical to box height */

        text-align: center;

        color: #007A95;
    }
`)

export default Area