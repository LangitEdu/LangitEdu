import React, { useState, useEffect } from "react";
import Styled from "@emotion/styled";
import { Helmet } from "react-helmet";
import Navbar from "../component/Navbar/Navbar";
import Header from "../component/Jurusan/Header";
import Footer from "../component/FooterCopyright";

import Kluster from "../component/Jurusan/Kluster";
import Area from "../component/Jurusan/Area";
import Klasifikasi from "../component/Jurusan/Klasifikasi";
import Jurusan from "../component/Jurusan/Jurusan";
import PilihUniv from "../component/Jurusan/PilihUniv";
import HasilJurusan from "../component/Jurusan/HasilJurusan";

const RekomendasiJurusan = () => {
  const [step, setstep] = useState(0);

  const [kluster, setkluster] = useState("initial");
  const [area, setarea] = useState("initial");
  const [klasifikasi, setklasifikasi] = useState("initial");
  const [jurusan, setjurusan] = useState("initial");
  const [univ, setuniv] = useState("initial");

  useEffect(() => {
    if (step < 4) setuniv("initial");
    if (step < 3) setjurusan("initial");
    if (step < 2) setklasifikasi("initial");
    if (step < 1) setarea("initial");
  }, [step]);

  const SwitchStep = () => {
    switch (step) {
      case 0:
        return (
          <Kluster
            kluster={kluster}
            setkluster={setkluster}
            setstep={setstep}
          />
        );
      case 1:
        return (
          <Area
            kluster={kluster}
            area={area}
            setarea={setarea}
            setstep={setstep}
          />
        );
      case 2:
        //currently step 2 is skipped
        return (
          <Klasifikasi
            area={area}
            klasifikasi={klasifikasi}
            setklasifikasi={setklasifikasi}
            setstep={setstep}
            kluster={kluster}
          />
        );
      case 3:
        return (
          <Jurusan
            area={area}
            jurusan={jurusan}
            setjurusan={setjurusan}
            setstep={setstep}
          />
        );
      case 4:
        return (
          <PilihUniv
            jurusan={jurusan}
            setstep={setstep}
            univ={univ}
            setuniv={setuniv}
          />
        );
      case 5:
        return (
          <HasilJurusan
            area={area}
            kluster={kluster}
            jurusan={jurusan}
            univ={univ}
            setstep={setstep}
          />
        );
      default:
        return (
          <Kluster
            kluster={kluster}
            setkluster={setkluster}
            setstep={setstep}
          />
        );
    }
  };

  return (
    <Wrapper>
      <Navbar />
      <Helmet>
        <title>Rekomendasi Jurusan | Langit Edu</title>
      </Helmet>

      <Header />
      <div className="switch-container">
        <SwitchStep />
      </div>
      <Footer />
    </Wrapper>
  );
};

const Wrapper = Styled.div`
  .switch-container{
    padding-bottom: 64px;
  }
`;

export default RekomendasiJurusan;
