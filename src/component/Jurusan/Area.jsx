import React from 'react'
import Styled from '@emotion/styled'
import useResize from 'use-resizing'
import BackButton from './BackButton'

const Area = ({kluster, area, setarea, setstep}) => {
    const screen = useResize().width

    const options = {
        saintek: ['TEKNIK', 'KESEHATAN', 'PERTANIAN', 'MIPA'],
        soshum: ['EKONOMI', 'SOSIAL', 'HUMANIORA']
    }

    const handleClick = (option) => {
        setarea(option)
        setstep(2)
    }

    return (
        <Wrapper screen={screen}>
            <div className={`${kluster} kluster-head`}>
                <h2>{kluster}</h2>
            </div>
            <p className="instruction">Pilih Area Program Studi</p>
            <div className="select">
                {kluster === 'saintek' && options.saintek.map((option, i) => 
                    <div className={`card ${area !== option && area !== 'initial' ? 'dimm' : ''}`} onClick={() => handleClick(option)} key={i}>
                        <p>{option}</p>
                    </div>
                )}
                {kluster === 'soshum' && options.soshum.map((option, i) => 
                    <div className={`card ${area !== option && area !== 'initial' ? 'dimm' : ''}`} onClick={() => handleClick(option)} key={i}>
                        <p>{option}</p>
                    </div>
                )}
            </div>
            <BackButton tostep={0} setstep={setstep}/>
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

        display: flex;
        justify-content: ${screen > 588 ? 'flex-start' : 'center'};
        align-items: center;
        flex-wrap: wrap;
    }

    .card{
        width: 262px;
        height: 134px;
        margin: 0 auto;

        box-shadow: -8px -8px 6px #FFFFFF, 8px 8px 10px rgba(174, 174, 192, 0.38);
        border-radius: 16px;

        display: flex;
        justify-content: center;
        align-items: center;

        margin: 12px;

        p{
            font-family: Montserrat;
            font-style: normal;
            font-weight: 800;
            font-size: 35px;
            line-height: 43px;
            text-align: center;

            color: #FFFFFF;
        }

        &:nth-child(1) {
            background: #007A95;
        }
        &:nth-child(2) {
            background:  #E8464A;
        }
        &:nth-child(3) {
            background: #15B86A;
        }
        &:nth-child(4) {
            background: #9B51E0;
        }

        &:hover{
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
        font-weight: bold;
        font-size: 27px;
        line-height: 32px;
        text-align: center;

        /* Gray 2 */
        margin-bottom: 32px;
        color: #4F4F4F;
    }
`)

export default Area