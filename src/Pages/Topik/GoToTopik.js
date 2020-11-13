import React, { useEffect, useState } from 'react'
import Styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { db } from '../../config/Firebase'
import Navbar from '../../component/Navbar/Navbar'
    
const GoToTopik = ({match}) => {
    const topikID = match.params.topikID
    const [topik, settopik] = useState({});
    const [kuisList, setkuisList] = useState([]);
    
    useEffect(() => {
        const FireAction = async () => {
            const topikData = (await db.collection('Topik').doc(topikID).get()).data()
            settopik(topikData)
            setkuisList(topikData.kuislist)
        }

        FireAction()

    }, [topikID])

    return (
    <>
        <Navbar />
        <Wrapper>
            <h1>{topik.nama}</h1>
            {kuisList.map((eachkuis, i)=>(
                <Link to={`/kuis/${eachkuis.uid}`} key={i}>{eachkuis.nama}</Link>
                ))}
        </Wrapper>
    </>
    )
}
    
const Wrapper = Styled.div(() =>`
    
`)
    
export default GoToTopik