import React, { useEffect, useState } from "react";
import Styled from "@emotion/styled";
import BackButton from "./BackButton";
import { db } from "../../config/Firebase";

const DetailJurusan = ({ jurusan, setstep, univ, setuniv }) => {
  const [options, setOptions] = useState([]);
  const [Loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    db.collection("University")
      .where("listProdi", "array-contains", jurusan)
      .get()
      .then((res) => {
        const univs = res.docs.map((doc) => {
          return doc.data().nama;
        });
        setOptions(univs);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
    return () => {
      setLoading(true);
    };
  }, [jurusan]);

  const handleClick = (selectedUniv) => {
    setuniv(selectedUniv);
    setstep(5);
  };

  return (
    <Wrapper>
      <div className="header-detail">
        <h2>{jurusan}</h2>
      </div>
      <p className="instruction">PILIHAN UNIVERSITAS</p>
      {Loading ? (
        <div className="spinner-border" role="status"></div>
      ) : (
        options.map((option, i) => (
          <div
            key={i}
            className={`each-univ ${
              univ !== option && univ !== "initial" ? "dimm" : ""
            }`}
            onClick={() => handleClick(option)}
          >
            <div
              className="img"
              style={{
                background: `url('/img/jurusan/univ.svg'), ${"#676726"}`,
              }}
            ></div>
            <p>{option}</p>
          </div>
        ))
      )}
      <div className="back">
        <BackButton tostep={3} setstep={setstep} />
      </div>
    </Wrapper>
  );
};

const Wrapper = Styled.div(`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 54px 0;

    .dimm{
        opacity: 0.5;
        filter: saturate(0)
    }
    
    .back{
        margin-top: 32px;
        max-width: 560px;
        width: 90%;
    }
    
    p.instruction{
        font-family: Montserrat;
        font-style: normal;
        font-weight: 800;
        font-size: 32px;
        margin: 48px 0 32px 0;
        line-height: 54px;
        /* identical to box height */
        
        text-align: center;
        
        color: #007A95;
    }
    div.desc{   
        max-width: 553px;
        width: 90%;
        min-width: 320px;
        margin: 24px 0;
        p{
            text-align: center;
        }
    }
    .header-detail{
        max-width: 553px;
        width: 90%;
        min-width: 320px;
        padding: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        
        background: #FFFFFF;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2), 0px 0px 2px rgba(0, 0, 0, 0.5);
        border-radius: 8px;
        
        h2{
            font-family: Raleway;
            font-style: normal;
            font-weight: bold;
            font-size: 39px;
            line-height: 46px;
            text-align: center;
            
            /* Gray 1 */
            
            color: #333333;
            text-transform: uppercase;
        }
    }
    
    .each-univ{
        max-width: 553px;
        width: 90%;
        min-width: 320px;
        padding: 24px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin: 12px 0;

        background: #FFFFFF;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2), 0px 0px 2px rgba(0, 0, 0, 0.5);
        border-radius: 8px;

        div.img{
            height: 74px;
            width: 74px;
            background-position: center;
            background-size: cover;
            background-repeat: no-repeat;
            border-radius: 50%;
            margin-right: 24px;
        }

        p{
            font-family: Raleway;
            font-style: normal;
            font-weight: bold;
            font-size: 28px;
            line-height: 33px;
            text-transform: capitalize;

            /* Gray 1 */

            color: #333333;
        }
    }
`);

export default DetailJurusan;
