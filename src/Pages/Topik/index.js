import React, { useEffect, useState } from 'react'
import Styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { db } from '../../config/Firebase'
import Navbar from '../../component/Navbar/Navbar'

const Topik = ({match}) => {
    const topikKey = typeof match.params.topikKey == 'undefined' ? "default" : match.params.topikKey
    const [Topik, setTopik] = useState({})
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

        const FireAction = async () => {
            const topikData = await db.collection('Topik').where("topikKey", "==", topikKey).get().then(function (querySnapshot) {
                let filler
                querySnapshot.forEach(function (doc) {
                        filler = doc.data()
                })
                return filler
            })

            console.log(topikData)
            
            setTopik(topikData)
        } 

        FireAction()

    }, [topikKey])

    return (
    <>
        <Navbar />
        <Wrapper>
            <form onSubmit={handleSubmit}>
                <input type="text" className="typical-input" value={input} onChange={(e)=> setinput(e.target.value)}/>
                <button type="submit" className="btn-bordered">CARI</button>
            </form>
            {SearchedTopik && <h1>{SearchedTopik.nama}</h1>}
            {topikKey !== "default" && (
            <>
                <h1>{Topik.nama}</h1>

                { Array.isArray(Topik.journeyList) && Topik.journeyList.map((each, i)=>(
                    <Link to={`/journey/${each.uid}`} key={i}>{each.nama}</Link>
                ))}
            </>
            )}
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