import React, { useEffect, useState, useRef } from "react";
import Navbar from "../component/Navbar/NavbarBig";
import Styled from "@emotion/styled";
import useResize from "use-resize";
import FooterCopyright from "../component/FooterCopyright";
import { Helmet } from "react-helmet";
import InputNilaiMipa from "../component/Rekomendasi/InputNilaiMipa";
import InputNilaiSoshum from "../component/Rekomendasi/InputNilaiSoshum";
import SelectForm from "../component/Rekomendasi/SelectForm";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const { currentUser } = useAuth();
  const [screen, setScreen] = useState();
  const [Jurusan, setJurusan] = useState("");
  const size = useResize();

  const NilaiMtkRef = useRef("");
  const NilaiFisikaRef = useRef("");
  const NilaiKimiaRef = useRef("");
  const NilaiBiologiRef = useRef("");
  const NilaiEkonomiRef = useRef("");
  const NilaiSosRef = useRef("");
  const NilaiGeoRef = useRef("");
  const NilaiSejarahRef = useRef("");

  const [ListArea, setListArea] = useState([]);
  const [AreaSelected, setAreaSelected] = useState("");

  const [ListKlasifikasi, setListKlasifikasi] = useState([]);
  const [KlasifikasiSelected, setKlasifikasiSelected] = useState("");

  const [listOfJurusan, setListOfJurusan] = useState([]);
  const [selectedJurusan, setSelectedJurusan] = useState("");

  const [listOfUniversity, setListOfUniversity] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState("");

  useEffect(() => {
    setListOfUniversity([
      {
        label: "Institut Teknologi Sepuluh Nopember",
        value: "ITS",
      },
      {
        label: "Universitas Indonesia",
        value: "UI",
      },
      {
        label: "Universitas Padjadjaran",
        value: "unpad",
      },
    ]);
    return () => {
      setListOfUniversity([]);
    };
  }, [selectedJurusan]);

  useEffect(() => {
    setListOfJurusan([
      {
        value: "teknik_sipil",
        label: "Teknik Sipil",
      },
      {
        label: "Teknik Arsitektur",
        value: "teknik_arsitektur",
      },
      {
        label: "Teknik Perencaaan Wilayah Kota",
        value: "pwk",
      },
    ]);
    return () => {
      setListOfJurusan([]);
    };
  }, [KlasifikasiSelected]);

  useEffect(() => {
    const dummyKlasifikasiJurusan = [
      {
        label: "Bangunan",
        value: "bangunan",
      },
      {
        label: "Kebumian",
        value: "kebumian",
      },
      {
        label: "Kelautan",
        value: "kelautan",
      },
      {
        label: "Komputer",
        value: "komputer",
      },
    ];
    setListKlasifikasi(dummyKlasifikasiJurusan);
    return () => {
      setListKlasifikasi([]);
    };
  }, [AreaSelected]);

  useEffect(() => {
    const DummyAreaSaintek = [
      {
        label: "Teknik",
        value: "teknik",
      },
      {
        label: "MIPA",
        value: "mipa",
      },
      {
        label: "Kesehatan",
        value: "kesehatan",
      },
    ];

    const DummyAreaSoshum = [
      {
        label: "Ekonomi",
        value: "ekonomi",
      },
      {
        label: "Sosial",
        value: "sosial",
      },
      {
        label: "Humaniora",
        value: "humaniora",
      },
    ];
    if (Jurusan === "saintek") {
      setListArea(DummyAreaSaintek);
    } else if (Jurusan === "soshum") {
      setListArea(DummyAreaSoshum);
    }
    return () => {
      setListArea([]);
    };
  }, [Jurusan]);

  useEffect(() => {
    const width = size.width;
    const handleWindowSizeChange = () => {
      setScreen(width);
    };
    setScreen(width);
    window.addEventListener("resize", handleWindowSizeChange);

    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, [size]);

  function onSubmit(e) {
    e.preventDefault();
    if (Jurusan === "saintek") {
      const data = {
        nilai: [
          {
            nama: "NilaiMtkRef",
            nilai: NilaiMtkRef.current.value,
          },
          {
            nama: "NilaiFisikaRef",
            nilai: NilaiFisikaRef.current.value,
          },
          {
            nama: "NilaiKimiaRef",
            nilai: NilaiKimiaRef.current.value,
          },
          {
            nama: "NilaiBiologiRef",
            nilai: NilaiBiologiRef.current.value,
          },
        ],
        Area: AreaSelected,
        Klasifikasi: KlasifikasiSelected,
        Jurusan: selectedJurusan,
        Universitas: selectedUniversity,
        uid: currentUser.uid,
      };
      console.log(data);
    } else {
      const data = {
        nilai: [
          {
            nama: "NilaiMtkRef",
            nilai: NilaiMtkRef.current.value,
          },
          {
            nama: "NilaiEkonomiRef",
            nilai: NilaiEkonomiRef.current.value,
          },
          {
            nama: "NilaiSosRef",
            nilai: NilaiSosRef.current.value,
          },
          {
            nama: "NilaiGeoRef",
            nilai: NilaiGeoRef.current.value,
          },
          {
            nama: "NilaiSejarahRef",
            nilai: NilaiSejarahRef.current.value,
          },
        ],
        Area: AreaSelected,
        Klasifikasi: KlasifikasiSelected,
        Jurusan: selectedJurusan,
        Universitas: selectedUniversity,
        uid: currentUser.uid,
      };
      console.log(data);
    }
  }
  return (
    <>
      <Navbar />
      <Helmet>
        <title>Rekomendasi Jurusan | Langit Edu</title>
      </Helmet>
      <Wrapper screen={screen}>
        <div className="supertron">
          <div className="contain-size">
            <h1 className="text-center w-100">Rekomendasi Jurusan</h1>
          </div>
        </div>
        <div className="bg-dark-blue">
          <p className="text-center py-3 text-light">
            Temukan jurusan yang sesuai dengan dirimu disini!
          </p>
        </div>

        <section className="container jelajah pb-5 mt-3">
          <div className="header-section">
            <h2 className="text-dark text-center font-weight-bold">
              Pilih Kluster
            </h2>
          </div>
          <div className="row mt-3">
            <div className="col-md-6">
              <div className="form-check mb-3">
                <input
                  className="form-check-input d-none"
                  type="radio"
                  name="exampleRadios"
                  id="saintek"
                  defaultValue="saintek"
                  onChange={(e) => {
                    setJurusan(e.target.value);
                  }}
                />
                <label
                  className="form-check-label text-center w-100 d-flex justify-content-center align-items-center flex-column"
                  htmlFor="saintek"
                >
                  <div className="tipeJurusan">
                    <img
                      src="/img/saintek.png"
                      alt="saintek"
                      className="img-fluid"
                    />
                  </div>
                  <p className="mt-3 w-75">
                    Ilmu-ilmu Sains, Teknologi, dan Pengetahuan Alam
                  </p>
                </label>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-check mb-3">
                <input
                  className="form-check-input d-none"
                  type="radio"
                  name="exampleRadios"
                  id="soshum"
                  defaultValue="soshum"
                  onChange={(e) => {
                    setJurusan(e.target.value);
                  }}
                />
                <label
                  className="form-check-label text-center w-100 d-flex justify-content-center align-items-center flex-column"
                  htmlFor="soshum"
                >
                  <div className="tipeJurusan">
                    <img
                      src="/img/soshum.png"
                      alt="saintek"
                      className="img-fluid"
                    />
                  </div>
                  <p className="mt-3 w-75">
                    Ilmu-ilmu Sosial, Hukum, Ekonomi dan Humaniora
                  </p>
                </label>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <form onSubmit={onSubmit}>
                {Jurusan === "saintek" ? (
                  <InputNilaiMipa
                    NilaiBiologiRef={NilaiBiologiRef}
                    NilaiFisikaRef={NilaiFisikaRef}
                    NilaiKimiaRef={NilaiKimiaRef}
                    NilaiMtkRef={NilaiMtkRef}
                  />
                ) : Jurusan === "soshum" ? (
                  <InputNilaiSoshum
                    NilaiMtkRef={NilaiMtkRef}
                    NilaiEkonomiRef={NilaiEkonomiRef}
                    NilaiGeoRef={NilaiGeoRef}
                    NilaiSejarahRef={NilaiSejarahRef}
                    NilaiSosRef={NilaiSosRef}
                  />
                ) : (
                  "Silahkan Pilih jurusan"
                )}
                {Jurusan && (
                  <>
                    <SelectForm
                      Label="Area"
                      Options={ListArea}
                      onChange={(e) => {
                        setAreaSelected(e.target.value);
                      }}
                    />
                  </>
                )}
                {AreaSelected && (
                  <>
                    <SelectForm
                      Label="Klasifikasi Jurusan"
                      Options={ListKlasifikasi}
                      onChange={(e) => {
                        setKlasifikasiSelected(e.target.value);
                      }}
                    />
                  </>
                )}
                {KlasifikasiSelected && (
                  <>
                    <SelectForm
                      Label="Jurusan"
                      Options={listOfJurusan}
                      onChange={(e) => {
                        setSelectedJurusan(e.target.value);
                      }}
                    />
                  </>
                )}
                {selectedJurusan && (
                  <>
                    <SelectForm
                      Label="Jurusan"
                      Options={listOfUniversity}
                      onChange={(e) => {
                        setSelectedUniversity(e.target.value);
                      }}
                    />
                  </>
                )}
                {Jurusan && <button className="btn-primary btn">Submit</button>}
              </form>
            </div>
          </div>
        </section>
        <FooterCopyright />
      </Wrapper>
    </>
  );
};

const Wrapper = Styled.div(
  ({ screen }) => `
    .header-section h2{
        font-size : 2.5rem;
    }
    .tipeJurusan{
        border-radius: 15px;
        overflow: hidden;
        width: fit-content;
        box-shadow: -8px -8px 6px #FFFFFF, 8px 8px 10px rgba(174, 174, 192, 0.38);
        transition : .5s;

    }
    input[type=radio]:checked + .form-check-label .tipeJurusan{
        box-shadow: 0px 0px 14px rgb(42 42 42 / 21%);
        transform: scale(1.1);
    }
    .tipeJurusan + p {
        font-size : 1.3rem;
    }
    .bg-dark-blue{
        background : #007A95;
        font-size : 1.5rem;
    }
    .img-credits{
        font-size: 16px;
        font-weight: normal;
        padding: 4px 12px;
        border-radius: 8px;
        margin-top: 32px;
        background: #007A95AA;
        
        &:hover{
            background: #007A95DD;
        }
    }

    section.credits{
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 24px;
        background:  #007A95BB;

        .credits-cont{
            max-width: 1112px;
            width: 90%;
            min-width: 340px;

            display: flex;
            justify-content: center;
            align-items: flex-start;
            flex-direction: column;

            a{
                color: white;
            }
        }
    }

    .btn{
        text-transform: uppercase;
        border-radius : .7rem
    }

    .post-item {
        
        color : #209FBC;

        .thumbnail{
            overflow:hidden;
            border-radius:20px;
            box-shadow: 0px 0px 23px rgba(0, 0, 0, 0.25);
            position : relative;
            width: fit-content;
        }

        .detail{
            h3{
                font-size:3rem;
            }
            p{
                font-size: 1.2rem;
            }

        }

    }

    .footer{
        background: #F5F5F5;
        box-shadow: inset 0px 20px 28px -12px rgba(0, 0, 0, 0.14);
        color : #209FBC;

        h4{
            font-weight : bold
        }
        ul {
            list-style: none;
            padding-left: 0;

            li{
                font-size:1.2rem
            }
        }
    }
    .jelajah{

        hr{
            border-top: 2px solid #209FBC;
        }
    }

    h2.tosca-text{
        max-width: 482px;
        font-family: Raleway;
        font-style: normal;
        font-weight: bold;
        font-size: 43px;
        line-height: 50px;

        /* tosca */

        color: #209FBC;
    }

    .supersecond{
        height : fit-content;
        min-height: 408px;
        box-shadow: inset 0px -24px 20px -12px rgba(0, 0, 0, 0.12);
        margin-bottom: 50px;
        overflow:hidden;
        background-image: url('/img/deco/bubbles.svg');
        background-size: contain;
        background-position: left bottom;
        background-repeat: no-repeat;
        padding : 3rem 2rem 6rem;
        display: flex;
        justify-content: center;
        align-items: center;

        .contain-size{
            flex-direction : ${screen < 769 ? "column-reverse" : "row"} ;

        }

    }

    .supertron{
        width: 100%;
        height: ${screen < 769 ? "fit-content" : "254px"};
        background-image: url('/img/bg-jumbotron2.svg');
        background-size: cover;
        background-repeat: no-repeat;
        overflow:hidden;
        padding : 3rem 2rem;

        display: flex;
        justify-content: center;
        align-items: center;

        box-shadow: 0px 0px 20px 8px rgba(0, 0, 0, 0.25);


        .contain-size{
            display: flex;
            flex-direction : ${screen < 769 ? "column" : "row"} ;
            justify-content: space-between;
            align-items: center;

            a{                
                z-index: 0; 
            }

            img{
                margin-left: -32px;
                margin-right: 24px;
            }
            h1{
                
                font-family: Raleway;
                font-style: normal;
                font-weight: 800;
                font-size: 4rem;
                line-height: 60px;
                margin-bottom: 48px;
                /* white */

                color: #FFFFFF;
            }
        }
    }    

 
`
);

export default Home;
