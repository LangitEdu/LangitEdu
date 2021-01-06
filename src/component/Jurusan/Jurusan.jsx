import React, { useEffect, useState } from "react"
import Styled from "@emotion/styled"
import BackButton from "./BackButton"
import { db } from "../../config/Firebase"

const Data = {
  pendidikan: 'Sebuah ilmu yang akan membuatmu mendalami cara atau metode pembelajaran terkait pengetahuan, keterampilan, dan kebiasaan sekelompok lintas generasi ke generasi melalui pengajaran, pelatihan, atau penelitian.',
  ekonomi: 'Sebuah ilmu yang akan membimbingmu untuk lebih memahami aktivitas manusia yang berhubungan dengan proses yang menggerakkan roda perekonomian : produksi, distribusi, dan konsumsi barang dan jasa',
  sosial: 'Ilmu utama dalam hidup manusia yang bertujuan untuk mendalami aspek yang berhubungan dengan perilaku manusia dan lingkungan sosialnya dengan menggunakan metode ilmiah',
  teknik: 'Ilmu dasar yang mampu melatih kamu tentang pengetahuan dan kepandaian dalam menciptakan produk yang bermanfaat berkenaan dengan industri',
  kesehatan: 'Sebuah ilmu untuk kamu yang sayang terhadap kesehatan umat manusia, baik keluarga maupun masyarakat sekitar. Mempelajari kesehatan fisik, mental, dan sosial.',
  pertanian: 'Sebuah ilmu yang memanfaatkan dan memodifikasi sumber daya hayati untuk menghasilkan bahan pangan, bahan baku industri, atau sumber energi, serta untuk mengelola lingkungan',
  mipa: 'Sebuah bidang studi untuk kamu yang mencintai ilmu abstrak , yaitu gabungan ilmu yang mempelajari matematika dan ilmu alam (biologi, fisika, kimia, dll.)',
  agama: 'Sebuah ilmu yang akan membuat kamu semakin mendalami kepercayaan dan peribadatan Kepada Tuhan Yang Mahakuasa serta tata kaidah yang berhubungan dengan budaya, dan pandangan dunia',
  humaniora: 'Sebuah ilmu untuk kamu pecinta sejarah manusia yang akan memperdalam tentang cara membuat atau mengangkat manusia menjadi lebih manusiawi dan berbudaya di era mendatang',
  seni: 'Sebuah ilmu yang melatih keahlian kamu dalam membuat karya yang ber nilai seni meliputi seluruh kegiatan manusia dalam menciptakan untuk dihargai keindahannya atau kekuatan emosinya.'
}

const Jurusan = ({ area, kluster, jurusan, setjurusan, setstep }) => {
  const [options, setOptions] = useState([])
  const [Loading, setLoading] = useState(true)
  const deskripsi = Data[area]

  useEffect(() => {
    setLoading(true)
    db.collection("Private")
      .doc("Data")
      .get()
      .then((doc) => {
        const { ListKlasifikasiProdi } = doc.data()
        setOptions(ListKlasifikasiProdi[area])
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })
    return () => {
      setOptions()
      setLoading(false)
    }
  }, [area])

  const handleClick = (option) => {
    setjurusan(option)
    setstep(4)
  }

  return (
    <Wrapper>
      <div className={`${kluster} kluster-head`}>
        <h2>{area}</h2>
      </div>
      <p className="desc">{deskripsi}</p>
      <p className="instruction">JURUSAN UNTUKMU</p>
      <div className="select">
        {Loading ? (
          <div className="spinner-border" role="status"></div>
        ) : (
          options.map((option, i) => (
            <div
              className={`card ${
                jurusan !== option && jurusan !== "initial" ? "dimm" : ""
              }`}
              onClick={() => handleClick(option)}
              key={i}
            >
              <p>{option}</p>
              <p className="link">
                LEBIH LANJUT
                <svg
                  width="10"
                  height="16"
                  viewBox="0 0 10 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M1 1L8 8L1 15" stroke="#209FBC" strokeWidth="1.5" />
                </svg>
              </p>
            </div>
          ))
        )}
      </div>
      <div className="back">
        <BackButton tostep={1} setstep={setstep} />
      </div>
    </Wrapper>
  );
};

const Wrapper = Styled.div(`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding-top: 52px;

    p.desc{
      text-align: center;
      max-width: 572px;
      width: 90%;
      min-width: 320px;
      margin-bottom: 52px;

      font-family: Montserrat;
      font-style: normal;
      font-weight: 600;
      font-size: 14px;
      line-height: 23px;
      color: #575757;
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
        margin-bottom: 12px;

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

    .back{
        margin-top: 32px;
        max-width: 578px;
        width: 90%;
    }

    .dimm{
        opacity: 0.5;
        filter: saturate(0)
    }

    .select{
        max-width: 572px;
        width: 90%;
        min-width: 320px;

        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    .card{
        width: 100%;
        background: #FFFFFF;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2), 0px 0px 2px rgba(0, 0, 0, 0.5);
        border-radius: 8px;

        display: flex;
        justify-content: space-evenly;
        align-items: flex-start;
        flex-direction: column;

        padding: 24px 32px;
        margin: 12px;

        &:hover{
            background: #e0f2f7;
        }

        p{
            font-family: Montserrat;
            font-style: normal;
            font-weight: 800;
            font-size: 35px;
            line-height: 43px;
            text-transform: capitalize;

            color: #464646;
            margin-bottom: 12px;
        }
        
        p.link{
            font-family: Oxygen;
            font-style: normal;
            font-weight: bold;
            font-size: 19px;
            line-height: 24px;
            
            /* tosca */
            margin-bottom: 0;

            color: #209FBC;

            svg{
                margin-bottom: 4px;
            }
        }
    }

    .saintek{
        background: url('/img/jurusan/area/saright.svg'), url('/img/jurusan/area/saleft.svg'), #9B51E0;
    }
        
    .soshum{
        background: url('/img/jurusan/area/sosright.svg'), url('/img/jurusan/area/sosleft.svg'), #00A37C;
    }   

    .kluster-head{
        width: 548px;
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
        font-weight: 900;
        font-size: 44px;
        line-height: 54px;
        margin: 0 24px;
        margin-bottom: 32px;
        /* identical to box height */

        text-align: center;

        color: #007A95;
    }
`);

export default Jurusan;
