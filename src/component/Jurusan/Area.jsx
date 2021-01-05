import React, { useEffect, useState } from "react";
import Styled from "@emotion/styled";
import useResize from "use-resizing";
import BackButton from "./BackButton";
import { db } from "../../config/Firebase";
import randomColor from 'randomcolor';

const Area = ({ kluster, area, setarea, setstep }) => {
  const screen = useResize().width;
  const [Loading, setLoading] = useState(false);
  const [options, setOptions] = useState({
    saintek: [],
    soshum: [],
  });
  useEffect(() => {
    setLoading(true);
    db.collection("Private")
      .doc("Data")
      .get()
      .then((res) => {
        if (kluster === "saintek") {
          setOptions({
            saintek: res.data().ListAreaProdiSaintek,
          });
        } else {
          setOptions({
            soshum: res.data().ListAreaProdiSoshum,
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
    return () => {
      setOptions({
        saintek: [],
        soshum: [],
      });
      setLoading(false);
    };
  }, [kluster]);

  const handleClick = (option) => {
    setarea(option);
    // setstep(2)
    setstep(3);
  };

  return (
    <Wrapper screen={screen}>
      <div className={`${kluster} kluster-head`}>
        <h2>{kluster}</h2>
      </div>
      <p className="instruction">Pilih Area Program Studi</p>
      <div className="select">
        {Loading ? (
          <div className="spinner-border" role="status"></div>
        ) : (
          options[kluster].map((option, i) => (
            <div
              className={`card ${
                area !== option && area !== "initial" ? "dimm" : ""
              }`}
              style={{background: randomColor({luminosity: 'dark'})}}
              onClick={() => handleClick(option)}
              key={i}
            >
              <p>{option}</p>
            </div>
          ))
        )}
      </div>
      <div className="back">
        <BackButton tostep={0} setstep={setstep} />
      </div>
    </Wrapper>
  );
};

const Wrapper = Styled.div(
  ({ screen }) => `
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding-top: 52px;

    .dimm{
        opacity: 0.5;
        filter: saturate(0)
    }

    .select{
        max-width: 572px;

        display: flex;
        justify-content: ${screen > 588 ? "flex-start" : "center"};
        align-items: center;
        flex-wrap: wrap;
    }

    .back{
        margin-top: 32px;
        max-width: 552px;
        width: 90%;
    }

    .card{
        width: 262px;
        height: 134px;
        margin: 0 auto;

        box-shadow: -8px -8px 6px #FFFFFF, 8px 8px 10px rgba(174, 174, 192, 0.38);
        border-radius: 16px;

        display: flex;
        justify-content: center;
        align-items: center;

        margin: 12px;

        p{
            font-family: Montserrat;
            font-style: normal;
            font-weight: 800;
            font-size: 35px;
            line-height: 43px;
            text-align: center;
            text-transform: uppercase;

            color: #FFFFFF;
        }

        &:hover{
            filter: brightness(1.3);
        }
    }

    .saintek{
        background: url('/img/jurusan/area/saright.svg'), url('/img/jurusan/area/saleft.svg'), #9B51E0;
    }
        
    .soshum{
        background: url('/img/jurusan/area/sosright.svg'), url('/img/jurusan/area/sosleft.svg'), #00A37C;
    }   

    .kluster-head{
        max-width: 572px;
        width: 90%;
        min-width: 320px;
        height: 104px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 52px;

        background-position: left, right;
        background-size: contain;
        background-repeat: no-repeat;

        box-shadow: -8px -8px 6px #FFFFFF, 8px 8px 10px rgba(174, 174, 192, 0.38);
        border-radius: 16px;

        h2{
            font-family: Montserrat;
            font-style: normal;
            font-weight: bold;
            font-size: 43px;
            line-height: 50px;
            text-align: center;
            text-transform: uppercase;
    
            color: #FFFFFF;
        }
    }

    p.instruction{
        font-family: Raleway;
        font-style: normal;
        font-weight: bold;
        font-size: 27px;
        line-height: 32px;
        text-align: center;

        /* Gray 2 */
        margin-bottom: 32px;
        color: #4F4F4F;
    }
`
);

export default Area;
