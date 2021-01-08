import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../component/Navbar/NavbarBig";
import RouteName from "../config/Route";
import Styled from "@emotion/styled";
import useResize from "use-resize";
import FooterCopyright from "../component/FooterCopyright";
import { Helmet } from "react-helmet";

const Home = () => {
  const [showCredits, setshowCredits] = useState(false);
  const [screen, setScreen] = useState();
  const size = useResize();

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

  return (
    <>
      <Navbar />
      <Helmet>
        <title>Langit Edu</title>
      </Helmet>
      <Wrapper screen={screen}>
        <div className="supertron">
          <div className="contain-size">
            <img
              className={`img-fluid ${screen < 768 ? "mb-4" : ""}`}
              src="/img/ilus/study.svg"
              alt=""
            />
            <div className="telling-cont">
              <h1>
                Belajar dimanapun <br />
                dan kapanpun{" "}
              </h1>
              <Link className="btn-bordered" to={RouteName.register}>
                MULAI BELAJAR
              </Link>
            </div>
          </div>
        </div>

        <div className="supersecond">
          <div className="contain-size">
            <h2 className="tosca-text">
              Membuat belajar bersama teman lebih menyenangkan
            </h2>
            <img
              className={`img-fluid ${screen < 768 ? "mb-4" : ""}`}
              src="/img/ilus/bersama.svg"
              alt=""
            />
          </div>
        </div>

        <section className="container jelajah pb-5">
          <div className="header-section d-flex justify-content-md-between justify-content-center flex-sm-row flex-column">
            <h2 className="tosca-text text-center">Jelajahi</h2>
            <div className="mt-3 d-flex d-md-block justify-content-center">
              <Link
                className="btn btn-outline-dark font-weight-bold mr-3"
                to={RouteName.listKomunitas}
              >
                KOMUNITAS
              </Link>
              <Link
                className="btn btn-outline-dark font-weight-bold"
                to={RouteName.topik}
              >
                TOPIK
              </Link>
            </div>
          </div>
          <hr />

          <div className="class-wrapper px-5 py-3 mt-4">
            <div className="post-item row mb-5">
              <div className="col-md-4">
                <div className={`thumbnail ${screen < 768 ? "mb-4" : ""}`}>
                  <img
                    className="img-fluid"
                    src="/img/thumbnail1.svg"
                    alt="thumbnail.png"
                  />
                </div>
              </div>
              <div className="col-md-8">
                <div className="detail py-md-3">
                  <h3 className="mb-3">Diskusi dengan komunitas belajarmu</h3>
                  <p>
                    Kamu dapat dengan langsung bertanya dan berdiskusi tentang
                    topik terkait bersama member lainnya
                  </p>
                  <br />
                  <Link
                    className="btn btn-outline-dark font-weight-bold mr-3"
                    to={RouteName.listKomunitas}
                  >
                    CARI KOMUNITASMU <i className="ml-2 fas fa-search"></i>{" "}
                  </Link>
                </div>
              </div>
            </div>

            <div className="post-item row mb-5">
              <div className="col-md-4">
                <div className={`thumbnail ${screen < 768 ? "mb-4" : ""}`}>
                  <img
                    className="img-fluid"
                    src="/img/thumbnail2.svg"
                    alt="thumbnail.png"
                  />
                </div>
              </div>
              <div className="col-md-8">
                <div className="detail py-md-3">
                  <h3 className="mb-3">Temukan topik belajar untukmu</h3>
                  <p>
                    Beragam topik belajar tersedia di langit edu dan siap untuk
                    kamu pelajari sekarang juga
                  </p>
                  <br />
                  <Link
                    className=" btn btn-outline-dark font-weight-bold mr-3"
                    to={RouteName.topik}
                  >
                    Jelajahi topik <i className="ml-2 fas fa-search"></i>
                  </Link>
                </div>
              </div>
            </div>

            <div className="post-item row mb-5">
              <div className="col-md-4">
                <div className={`thumbnail ${screen < 768 ? "mb-4" : ""}`}>
                  <img
                    className="img-fluid"
                    src="/img/thumbnail3.svg"
                    alt="thumbnail.png"
                  />
                </div>
              </div>
              <div className="col-md-8">
                <div className="detail py-md-3">
                  <h3 className="mb-3">Sistem Rekomendasi</h3>
                  <p>
                    Informasi lengkap terkait pendidikan yang sesuai dengan
                    kemampuan dan hasil pembelajaran kamu dapat didapatkan
                    disini
                  </p>
                  <br />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="footer py-2">
          <div className="container mt-5 mb-5">
            <div className="row">
              <div className="col-md-4 mb-4">
                <img
                  className="img-fluid"
                  src="/img/logo-blue.png"
                  alt="Logo"
                />
                <h4 className="mt-4 mb-3">Tentang kami</h4>
                <p>
                  Dengan konsep berbeda, di langitedu membawakan menciptakan
                  sebuah social education platform yang dapat memberikan
                  rekomendasi pendidikan, informasi seputar dunia pendidikan,
                  dan analisis karakter
                </p>
              </div>
              <div className="col-md-4 mb-4">
                <h4 className="mb-3">Kontak Kami</h4>
                <ul>
                  <li>
                    <i className="fas fa-envelope mr-2"></i>Info@langitedu.com
                  </li>
                  <li>
                    <i className="fab fa-whatsapp mr-2"></i>089889883637
                  </li>
                </ul>
                <button
                  onClick={() => setshowCredits(!showCredits)}
                  className="typical-button img-credits"
                >
                  {showCredits ? "Close" : "Image"} Credits
                </button>
              </div>
              <div className="col-md-4">
                <h4 className="mb-3">Sosial Media</h4>
                <ul>
                  <li>
                    <i className="fab fa-twitter mr-2"></i>
                    <a
                      href="http://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      langit.edu
                    </a>
                  </li>
                  <li>
                    <i className="fab fa-instagram mr-2"></i>
                    <a
                      href="http://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      langit.edu
                    </a>
                  </li>
                  <li>
                    <i className="fab fa-facebook mr-2"></i>
                    <a
                      href="http://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      langit.edu
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        {showCredits && (
          <section className="credits">
            <div className="credits-cont">
              <a href="https://www.freepik.com/vectors/people">
                People vector created by pch.vector - www.freepik.com
              </a>
              <a href="https://www.freepik.com/vectors/school">
                School vector created by pch.vector - www.freepik.com
              </a>
              <a href="https://www.freepik.com/vectors/medical">
                Medical vector created by freepik - www.freepik.com
              </a>
              <a href="https://www.freepik.com/vectors/school">
                School vector created by pch.vector - www.freepik.com
              </a>
              <a href="https://www.freepik.com/vectors/background">
                Background vector created by freepik - www.freepik.com
              </a>
            </div>
          </section>
        )}
        <FooterCopyright />
      </Wrapper>
    </>
  );
};

const Wrapper = Styled.div(
  ({ screen }) => `

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
                font-size: ${screen < 769 ? "2.3rem" : "3rem"};
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
        height: ${screen < 769 ? "fit-content" : "454px"};
        background-image: url('/img/bg-jumbotron.svg');
        background-size: cover;
        background-position: bottom;
        background-repeat: no-repeat;
        overflow:hidden;
        padding : 3rem 2rem 6rem;

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
                font-size: ${screen < 769 ? "1rem" : "1.2rem"};
            }

            img{
                margin-left: -32px;
                margin-right: 24px;
            }
            h1{
                
                font-family: Raleway;
                font-style: normal;
                font-weight: 800;
                font-size: ${screen < 769 ? "2.3rem" : "4rem"};
                line-height: ${screen < 769 ? "normal" : "60px"};
                margin-bottom: 48px;
                /* white */

                color: #FFFFFF;
            }
        }
    }    

 
`
);

export default Home;
