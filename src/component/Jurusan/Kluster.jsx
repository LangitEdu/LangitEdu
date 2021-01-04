import React, { useState } from 'react'
import Styled from '@emotion/styled'
import useResize from 'use-resizing'

const Kluster = ({kluster, setkluster, setstep}) => {
    const [nilai, setnilai] = useState(['', '', '', '', '', ''])
    const screen = useResize().width

    const handleInput = (value, index) => {
        if (value > 100) value = 100
        if (value < 0) value = 0

        let data = nilai
        data[index] = value
        setnilai([...data])
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        setstep(1)
    }

    const subjects = {
        saintek: ['matematika', 'b.indonesia', 'b.inggris', 'fisika', 'kimia', 'biologi'],
        soshum: ['matematika', 'b.indonesia', 'b.inggris', 'ekonomi', 'sosiologi', 'geografi']
    }

    return (
        <Wrapper screen={screen}>
            <div className="select-kluster">
                <h2>Pilih Kluster</h2>
                <div className="select">
                    <div className="card-cont">
                        <div className={`card-kluster saintek ${kluster === 'saintek' || kluster === 'initial' ? '' : 'dimm'}`} onClick={() => setkluster('saintek')}>
                            <p className="main">SAINTEK</p>
                            <p className="sub">KLUSTER IPA</p>
                        </div>
                        <p className="desc">Ilmu-ilmu Sains, Teknologi, dan Pengetahuan Alam</p>
                    </div>
                    <div className="card-cont">
                        <div className={`card-kluster soshum ${kluster === 'soshum' || kluster === 'initial' ? '' : 'dimm'}`} onClick={() => setkluster('soshum')}>
                            <p className="main">SOSHUM</p>
                            <p className="sub">KLUSTER IPS</p>
                        </div>
                        <p className="desc">Ilmu-ilmu Sosial, Hukum, Ekonomi dan Humaniora</p>
                    </div>
                </div>
            </div>
            <div className="input-nilai">
                <h2>Analisa Nilai</h2>
                <form onSubmit={handleSubmit}>
                    {kluster === 'initial' ?
                        <div className="warning-select">
                            <p>Pilih kluster jurusan terlebih dahulu</p>
                        </div>
                    :
                    <>
                        {subjects[kluster].map((subject, i) => 
                            <InputNilai subject={subject} key={i} index={i} nilai={nilai} handleInput={handleInput}/>
                        )}
                        <div className="action">
                            <button type="reset" onClick={() => setnilai(['','','','','',''])}>Reset Form</button>
                        </div>
                    </>
                    }
                    <button type="submit" className="btn-bordered-blue" disabled={kluster === 'initial'}>JELAJAHI JURUSAN</button>
                </form>
            </div>
        </Wrapper>
    )
}

const InputNilai = ({subject, index, nilai, handleInput}) => {
    return (
        <div className="each-input">
            <label htmlFor={index}>{subject}</label>
            <input type="number" 
                id={index}
                value={nilai[index]} 
                onChange={e => handleInput(e.target.value, index)} 
                min="0" 
                max="100" 
                placeholder='-'
                // required
            />
        </div>
    )
}


const Wrapper = Styled.div(({screen}) =>`
    .warning-select{
        width: 100%;
        background: rgba(255, 162, 82, 0.07);
        border: 1px solid #FFA252;
        box-sizing: border-box;
        border-radius: 8px;
        
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 32px 12px 32px 20px;
    }

    form{
        max-width: 580px;
        width: 90%;
        min-width: 320px;
    }

    .each-input{
        width: 100%;
        height: 80px;
        background: #F2F2F2;
        box-shadow: -2px 2px 2px rgba(0, 0, 0, 0.25);
        border-radius: 8px;
        margin: 18px 0;
        padding: 0 12px 0 32px;

        display: flex;
        justify-content: space-between;
        align-items: center;

        label{
            font-family: Montserrat;
            font-style: normal;
            font-weight: bold;
            font-size: ${screen > 440 ? '28px' : '20px'};
            line-height: 34px;
            text-transform: uppercase;

            margin: 0;
            /* Gray 1 */

            color: #333333;
        }

        input{
            font-family: Montserrat;
            font-style: normal;
            font-weight: bold;
            font-size: 40px;
            line-height: 49px;
            text-align: center;
            
            /* tosca */
            
            color: #209FBC;
            
            width: 148px;
            height: 60px;
            left: 803px;
            top: 1052px;
            
            background: #FFFFFF;
            border: 1px solid #D3D3D3;
            box-sizing: border-box;
            border-radius: 8px;
            
            &::placeholder{
                font-weight: 600;
                color: #828282;
            }

            &::-webkit-outer-spin-button,
            &::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }

            &[type=number] {
                -moz-appearance: textfield;
            }
        }
    }

    .input-nilai{
        width: 100%;
        padding: 52px 0;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        box-shadow: 0 -16px 16px rgba(0,0,0,0.1);

        h2{
            margin-bottom: 32px;
        }

        button[type=reset]{
            border: none;
            background: none;
            text-decoration: underline;
            font-family: Montserrat;
            font-weight: normal;
            font-size: 18px;
            color: #828282;
            margin-top: 12px;
        }
        button[type=submit]{
            margin-top: 32px;
            width: 100%;
            box-shadow: 0 0 4px rgba(0,0,0,0.5);

            &:disabled, &[disabled]{
                background-color: #cccccc;
            }
        }
    }

    .dimm{
        opacity: 0.5;
        filter: saturate(0)
    }

    .select{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: ${screen > 850 ? 'row' : 'column'};
    }

    .saintek{
        background: #9B51E0 url('/img/jurusan/saintek.svg');
    }
    
    .soshum{
        background: #15B86A url('/img/jurusan/soshum.svg');
    }

    .card-cont{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin-bottom: 24px;

        p.desc{
            margin-top: 12px;
            max-width: 272px;
            font-family: Raleway;
            font-style: normal;
            font-weight: 500;
            font-size: 17px;
            line-height: 21px;
            text-align: center;

            /* Gray 2 */

            color: #4F4F4F;
        }
    }
    
    .card-kluster{
        width: 368px;
        height: 166px;
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        border-radius: 16px;
        margin: 0 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        box-shadow: 0 0 8px rgba(0,0,0,0);
        transition: 0.25s;
        
        &:hover{
            box-shadow: 0 0 8px rgba(0,0,0,0.5);
            opacity: 1;
            filter: saturate(1)
        }

        &:hover p.main{
            font-size: 47px;
        }
        
        p.main{
            font-family: Montserrat;
            font-style: normal;
            font-weight: 800;
            font-size: 44px;
            line-height: 54px;
            text-align: center;
            transition: 0.25s;

            color: #FFFFFF;
        }

        p.sub{
            font-family: Montserrat;
            font-style: normal;
            font-weight: 600;
            font-size: 18px;
            line-height: 12px;
            text-align: center;

            /* white */

            color: #FFFFFF;
            margin-bottom: 20px;
        }
    }
    
    .select-kluster{
        height: ${screen > 850 ? '448px' : '640px'};
        width: 100%;

        display: flex;
        justify-content: space-evenly;
        align-items: center;
        flex-direction: column;
    }

    h2{
        font-family: Montserrat;
        font-style: normal;
        font-weight: bold;
        font-size: 43px;
        line-height: 50px;
        text-align: center;

        /* Gray 2 */

        color: #4F4F4F;
    }
`)

export default Kluster