import React, { useEffect, useState } from 'react'
import Styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { db } from '../../config/Firebase'
import Navbar from '../../component/Navbar/Navbar'

const Topik = ({match}) => {
    const topikKey = typeof match.params.topikKey == 'undefined' ? "default" : match.params.topikKey
    const [Topik, setTopik] = useState({})

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
            {topikKey !== "default" && Topik && (
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