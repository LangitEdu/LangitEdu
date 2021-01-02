import React from 'react'
import Styled from '@emotion/styled'

const BackButton = ({tostep, setstep}) => {

    return (
        <Wrapper>
            <button className="btn-bordered-gray" onClick={() => setstep(tostep)}>KEMBALI</button>
        </Wrapper>
    )
}

const Wrapper = Styled.div(() =>`
    position: fixed;
    bottom: 24px;
    left: 24px;

    button{
        background: #bbb;
    }
`)

export default BackButton