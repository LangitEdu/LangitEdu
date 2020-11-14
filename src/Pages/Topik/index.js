import React, { useEffect, useState } from 'react'
import Styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { db } from '../../config/Firebase'
import Navbar from '../../component/Navbar/Navbar'

const Topik = () => {
    const [SearchedTopik, setSearchedTopik] = useState({})
    const [input, setinput] = useState("")
    
    const handleSubmit = async (e) => {
        e.preventDefault()

        const topikData = await db.collection('Topik').where("topikKey", "==", input).get().then(function (querySnapshot) {
            let filler
            querySnapshot.forEach(function (doc) {
                    filler = doc.data()
            })
            return filler
        })

        setSearchedTopik(topikData)

    }

    useEffect(() => {



    }, [])

    return (
    <>
        <Navbar />
        <Wrapper>
            <form onSubmit={handleSubmit}>
                <input type="text" className="typical-input" value={input} onChange={(e)=> setinput(e.target.value)}/>
                <button type="submit" className="btn-bordered">CARI</button>
            </form>
            {SearchedTopik.nama && 
                <div className="foundtopik">
                    <p>{SearchedTopik.nama}</p>
                    <Link to={`/topik/${input}`}> <button>LIHAT TOPIK</button> </Link>
                </div> 
            }
            
        </Wrapper>
    </>
    )
}
    
const Wrapper = Styled.div(() =>`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding-top: 54px;


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
        button{

        }
    }
    
`)
    
export default Topik