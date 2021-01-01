import React, { useState } from 'react'
import Styled from '@emotion/styled'
import { Helmet } from "react-helmet"
import Navbar from "../../component/Navbar/Navbar"
import useResize from 'use-resizing'
import Header from '../../component/Jurusan/Header'

import Kluster from '../../component/Jurusan/Kluster'
import Area from '../../component/Jurusan/Area'
import Klasifikasi from '../../component/Jurusan/Klasifikasi'
import Jurusan from '../../component/Jurusan/Jurusan'

const RekomendasiJurusan = () => {
    const screen = useResize().width
    const [step, setstep] = useState(0)

    const [kluster, setkluster] = useState('initial')
    const [area, setarea] = useState('initial')
    const [klasifikasi, setklasifikasi] = useState('initial')
    const [jurusan, setjurusan] = useState('initial')

    const SwitchStep = ({step}) => {
        switch(step) {
            case 0:
              return <Kluster kluster={kluster} setkluster={setkluster} setstep={setstep}/>
            case 1:
              return <Area kluster={kluster} area={area} setarea={setarea} setstep={setstep}/>
            case 2:
              return <Klasifikasi area={area} klasifikasi={klasifikasi} setklasifikasi={setklasifikasi} setstep={setstep}/>
            case 3:
              return <Jurusan klasifikasi={klasifikasi} jurusan={jurusan} setjurusan={setjurusan} setstep={setstep}/>
            default:
              return <Kluster kluster={kluster} setkluster={setkluster} setstep={setstep}/>
          }
    }

    return (
    <>
        <Navbar />
        <Helmet>
            <title>Rekomendasi Jurusan | Langit Edu</title>
        </Helmet>
        <Header />
        <Wrapper screen={screen}>
            <SwitchStep step={step} />
        </Wrapper>
    </>
    )
}

const Wrapper = Styled.div(({screen}) =>`

`)

export default RekomendasiJurusan