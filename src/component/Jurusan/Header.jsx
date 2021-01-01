import React from 'react'
import Styled from '@emotion/styled'
import useResize from 'use-resizing'

const Header = () => {
    const screen = useResize().width

    return (
        <Wrapper screen={screen}>
            <div className="jumbotron-jurusan">
                <h1>Rekomendasi Jurusan</h1>
            </div>
            <div className="sub-jumbo">
                <p>Temukan jurusan yang sesuai dengan dirimu disini!</p>
            </div>
        </Wrapper>
    )
}

const Wrapper = Styled.div(({screen}) =>`
    box-shadow: 0 -4px 16px 8px rgba(0,0,0,0.5);
        
    .sub-jumbo{
        height: ${screen > 550 ? '72px' : '100px'};
        width: 100%;
        background: #007A95;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 32px;

        p{
            font-family: Raleway;
            font-style: normal;
            font-weight: 500;
            font-size: 20px;
            line-height: 31px;
            text-align: center;

            /* white */

            color: #FFFFFF;
        }
    }

    .jumbotron-jurusan{
        height: 180px;
        width: 100%;
        background: url('/img/jurusan/wave.svg'), url('/img/jurusan/particle.svg'), #209FBC;
        background-position: right;
        background-size: cover;
        background-repeat: no-repeat;

        display: flex;
        justify-content: center;
        align-items: center;

        h1{
            font-family: Raleway;
            font-style: normal;
            font-weight: 800;
            font-size: ${screen > 1000 ? '60px' : screen > 640 ? '50px' : '40px'};
            text-align: center;

            /* white */

            color: #FFFFFF;
        }
    }
`)

export default Header