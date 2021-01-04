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
    position: relative;
    left: 0;

    button{
        background: #bbb;
    }
`)

export default BackButton