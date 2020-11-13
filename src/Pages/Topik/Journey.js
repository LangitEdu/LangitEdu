import React, { useEffect, useState } from 'react'
import Styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { db } from '../../config/Firebase'
import Navbar from '../../component/Navbar/Navbar'
    
const Journey = ({match}) => {
    const journeyID = typeof match.params.journeyID == 'undefined' ? "default" : match.params.journeyID
    console.log(journeyID)
    const [Journey, setJourney] = useState({})
    
    useEffect(() => {
        const FireAction = async () => {
            const journeyData = (await db.collection('Journey').doc(journeyID).get()).data()
            setJourney(journeyData)
        } 

        FireAction()

    }, [journeyID])

    return (
    <>
        <Navbar />
        <Wrapper>
            {journeyID !== "default" && (
            <>
                <h1>{Journey.nama}</h1>

                { Array.isArray(Journey.kuisList) && Journey.kuisList.map((each, i)=>(
                    <Link to={`/kuis/${each.uid}`} key={i}>{each.nama}</Link>
                ))}
            </>
            )}
        </Wrapper>
    </>
    )
}
    
const Wrapper = Styled.div(() =>`
    
`)
    
export default Journey