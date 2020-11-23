import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../component/Navbar/Navbar'
import { db } from '../../config/Firebase'
import parse from 'html-react-parser'
import Styled from '@emotion/styled'
import FooterCopyright from '../../component/FooterCopyright'
import { Helmet } from 'react-helmet'


const Topik = () => {
    const [SearchedTopik, setSearchedTopik] = useState({})
    const [Topik, setTopik] = useState([])
    const [AfterSearch, setAfterSearch] = useState(false)
    const [SearchAble, setSearchAble] = useState(false)
    const [input, setinput] = useState("")
    
    const handleSearchInputChange = (e)=>{
        setinput(e.target.value)
        setAfterSearch(false)
        if(e.target.value.length > 0){
            setSearchAble(true)
        }else{
            
            setSearchAble(false)
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        const topikData = await db.collection('Topik').where("topikKey", "==", input).get().then(function (querySnapshot) {
            let filler
            querySnapshot.forEach(function (doc) {
                    filler = doc.data()
            })
            return filler
        })
        setAfterSearch(true)
        setSearchedTopik(topikData)

    }

    useEffect(() => {
        const FireAction = async () => {
            const topikData = await db.collection('Topik').orderBy('created_at', 'desc').limit(3).get()
            let filler = []
            topikData.forEach( doc => {
                filler.push(doc.data())
            })
        
            setTopik(filler)
            console.log(filler)

        }

        FireAction()

    }, [])

    return (
    <>
        <Navbar />
        <Helmet>
            <title>Topik | Langit Edu</title>
        </Helmet>
        <Wrapper>
            <h1>Jelajahi Topik</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" className="typical-input" value={input} onChange={handleSearchInputChange} placeholder="Masukan topik key"/>
                <button type="submit" className="btn btn-bordered" disabled={!SearchAble}>CARI</button>
            </form>
            {SearchedTopik ? SearchedTopik.nama && 
                <div className="topik-tersedia">
                <h2>Topik Ditemukan</h2>
                    <div className="topik-card">
                        <img src={SearchedTopik.thumbnail} alt=""/>
                        <div className="topik-content">
                            <div>
                                <p className="nama">{SearchedTopik.nama}</p>
                                <div className="desc mt-2">{parse(SearchedTopik.deskripsi)}</div>
                            </div>
                            <Link to={`/topik/${SearchedTopik.topikKey}`}><p className="button"><span>LIHAT TOPIK</span>&ensp;<svg width="9" height="12" viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L7 6L1 11" stroke="#209FBC" strokeWidth="1.5"/></svg></p></Link>
                        </div>
                    </div>
                </div>
             :
             AfterSearch && 'Not Found'
            }
            <div className="topik-tersedia">
                <h2>Topik Tersedia</h2>
                {Topik.map((top, i) => (
                    <div key={i} className="topik-card">
                        <img src={top.thumbnail} alt=""/>
                        <div className="topik-content">
                            <div>
                            <p className="nama">{top.nama}</p>
                            <div className="desc mt-2">{parse(top.deskripsi)}</div>
                            </div>
                            <Link to={`/topik/${top.topikKey}`}><p className="button"><span>LIHAT TOPIK</span>&ensp;<svg width="9" height="12" viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L7 6L1 11" stroke="#209FBC" strokeWidth="1.5"/></svg></p></Link>
                        </div>
                    </div>
                ))

                }
            </div>
            
        </Wrapper>
        <FooterCopyright />
    </>
    )
}
    
const Wrapper = Styled.div(() =>`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    padding: 54px 0;
    min-height: 1000px;

    .topik-tersedia{
        width: 100%;
    }

    .topik-card{
        max-width: 553px;
        width: 90%;
        min-width: 340px;
        height: 180px;
        margin: 12px 0;
        
        background: #FFFFFF;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2), 0px 0px 2px rgba(0, 0, 0, 0.5);
        border-radius: 8px;

        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 0 16px;

        p.nama{
            font-family: Raleway;
            font-style: normal;
            font-weight: bold;
            font-size: 35px;
            line-height: 41px;
            
            /* Gray 1 */
            
            color: #333333;
        }
        
        .desc p{
            width: 100%;
            font-family: Oxygen;
            font-style: normal;
            font-weight: normal;
            font-size: 14px;
            line-height: 18px;

            /* Gray 3 */

            color: #828282;
        }

        p.button{
            font-family: Oxygen;
            font-style: normal;
            font-weight: bold;
            font-size: 14px;
            line-height: 18px;
            /* identical to box height */
            
            
            /* tosca */
            
            color: #209FBC;

            span{
                margin-top: 6px;
            }
        }
        
        img{
            height: 148px;
            width: 148px;
            border-radius: 8px;
            margin-right: 16px;
        }
        .topik-content{
            height: 100%;
            display: flex;
            justify-content: space-evenly;
            align-items: flex-start;
            flex-direction: column;
        }
    }

    .topik-tersedia{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        
    }
    
    h2{
        margin-bottom: 24px;
    }
    h1{
        font-family: Raleway;
        font-style: normal;
        font-weight: 800;
        font-size: 49px;
        line-height: 58px;
        text-align: center;
        margin-bottom: 32px;

        /* tosca */

        color: #209FBC;
    }

    h2{
        font-family: Raleway;
        font-style: normal;
        font-weight: bold;
        font-size: 20px;
        line-height: 23px;

        /* Gray 1 */

        color: #333333;
        margin-top: 32px;
    }

    .foundtopik{
        width: 340px;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        border: 1px solid #AAA;
        border-radius: 12px;
        flex-direction: column;
        padding: 24px;
        margin-top: 32px;

        p{
            margin-bottom: 12px;
            font-family: Oxygen;
            font-weight: bold;
            font-size: 24px;
        }

    }

    form{
        width: 85%;
        max-width: 600px;
        min-width: 340px;
        display: flex;
        justify-content: center;
        align-items: center;

        input{
            width: 100%;
        }
    }
    
`)
    
export default Topik