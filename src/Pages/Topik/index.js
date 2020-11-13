import React, { useEffect, useState } from 'react'
import Styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { db } from '../../config/Firebase'
import Navbar from '../../component/Navbar/Navbar'
    
const Topik = ({match}) => {
    const topikID = typeof match.params.topikID == 'undefined' ? "default" : match.params.topikID
    console.log(topikID)
    const [Topik, setTopik] = useState({})
    
    useEffect(() => {
        const FireAction = async () => {
            const topikData = (await db.collection('Topik').doc(topikID).get()).data()
            setTopik(topikData)
        } 

        FireAction()

    }, [topikID])

    return (
    <>
        <Navbar />
        <Wrapper>
            {topikID !== "default" && (
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
    
`)
    
export default Topik