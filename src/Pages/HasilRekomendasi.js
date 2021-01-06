import React, { useState, useEffect } from "react";
import Styled from "@emotion/styled";
import { Helmet } from "react-helmet";
import Navbar from "../component/Navbar/Navbar";
import Header from "../component/Jurusan/Header";
import Footer from "../component/FooterCopyright";
import HasilJurusanSaved from "../component/Jurusan/HasilJurusanSaved";
import { useParams } from "react-router-dom";

const HasilRekomendasi = () => {
  const { jurusan, univ, KampusCode } = useParams();

  useEffect(() => {}, []);

  return (
    <Wrapper>
      <Navbar />
      <Helmet>
        <title>Rekomendasi Jurusan | Langit Edu</title>
      </Helmet>

      <Header />
      <div className="switch-container">
        <HasilJurusanSaved
          jurusan={jurusan}
          univ={univ}
          KampusCode={KampusCode}
        />
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

export default HasilRekomendasi;
