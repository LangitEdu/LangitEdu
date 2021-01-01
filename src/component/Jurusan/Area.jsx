import React from 'react'
import Styled from '@emotion/styled'

const Area = ({kluster, area, setarea, setstep}) => {
    const areas = {
        saintek: ['MATEMATIKA', 'B. INDONESIA', 'B. INGGRIS', 'FISIKA', 'KIMIA', 'BIOLOGI'],
        soshum: ['MATEMATIKA', 'B. INDONESIA', 'B. INGGRIS', 'EKONOMI', 'SOSIOLOGI', 'GEOGRAFI']
    }

    return (
        <Wrapper>
            <div className="kluster">
                <h2>{kluster}</h2>
            </div>
        </Wrapper>
    )
}

const Wrapper = Styled.div(() =>`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .kluster{
        width: 548px;
        height: 104px;
        display: flex;
        justify-content: center;
        align-items: center;

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

        background: #00A37C;
        box-shadow: -8px -8px 6px #FFFFFF, 8px 8px 10px rgba(174, 174, 192, 0.38);
        border-radius: 16px;
    }
`)

export default Area