import React, { useState, useEffect } from 'react'
import { Helmet } from "react-helmet"
import Navbar from "../component/Navbar/Navbar"
import Header from '../component/Jurusan/Header'

import Kluster from '../component/Jurusan/Kluster'
import Area from '../component/Jurusan/Area'
import Klasifikasi from '../component/Jurusan/Klasifikasi'
import Jurusan from '../component/Jurusan/Jurusan'
import DetailJurusan from '../component/Jurusan/DetailJurusan'

const RekomendasiJurusan = () => {
    const [step, setstep] = useState(0)

    const [kluster, setkluster] = useState('initial')
    const [area, setarea] = useState('initial')
    const [klasifikasi, setklasifikasi] = useState('initial')
    const [jurusan, setjurusan] = useState('initial')

    useEffect(() => {
      if (step < 3) setjurusan('initial')
      if (step < 2) setklasifikasi('initial')
      if (step < 1) setarea('initial') 
    }, [step])

    const SwitchStep = () => {
        switch(step) {
            case 0:
              return <Kluster kluster={kluster} setkluster={setkluster} setstep={setstep}/>
            case 1:
              return <Area kluster={kluster} area={area} setarea={setarea} setstep={setstep}/>
            case 2:
              return <Klasifikasi area={area} klasifikasi={klasifikasi} setklasifikasi={setklasifikasi} setstep={setstep} kluster={kluster}/>
            case 3:
              return <Jurusan klasifikasi={klasifikasi} jurusan={jurusan} setjurusan={setjurusan} setstep={setstep}/>
            case 4:
              return <DetailJurusan jurusan={jurusan} setstep={setstep}/>
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
        <SwitchStep />
    </>
    )
}

export default RekomendasiJurusan