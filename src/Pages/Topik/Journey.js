import React, { useEffect, useState } from 'react'
import Styled from '@emotion/styled'
import { db } from '../../config/Firebase'
import useResize from 'use-resize'
import Navbar from '../../component/Navbar/Navbar'
import FooterCopyright from '../../component/FooterCopyright'
import KuisCard from '../../component/KuisCard'
    
const Journey = ({match}) => {
    const journeyID = typeof match.params.journeyID == 'undefined' ? "default" : match.params.journeyID
    const [Journey, setJourney] = useState({})
    const [howManyKuis, sethowManyKuis] = useState(0)
    const [Topik, setTopik] = useState({})
    const [KuisList, setKuisList] = useState([])
    const screen = useResize().width
    
    useEffect(() => {
        const FireAction = async () => {
            const journeyData = (await db.collection('Journey').doc(journeyID).get()).data()
            const topikData = (await db.collection('Topik').doc(journeyData.topikID).get()).data()
            setJourney(journeyData)
            setTopik(topikData)
            if(journeyData.kuisList){
                const newKulisList = journeyData.kuisList.filter(data=>{
                    return data.publish
                })
                setKuisList(newKulisList)
                sethowManyKuis(newKulisList.length)
            }
        } 

        FireAction()

    }, [journeyID])

    return (
    <>
        <Navbar />
        <Wrapper screen={screen}>
            {journeyID !== "default" && (
                <div className="content-wrapper">
                    <div className="title-cont">
                        <h3>{Topik.nama}</h3>
                        <div>
                            <p className="nama">{Journey.nama}</p>
                            <p>{howManyKuis} KUIS</p>
                        </div>
                    </div>
                    <div className="grid-area">
                        { Array.isArray(KuisList) && KuisList.map((each, i)=>(
                            <KuisCard key={i} kuisID={each.uid}/>
                        ))} 
                    </div>
                </div>
            )}
        </Wrapper>
        <FooterCopyright />
    </>
    )
}
    
const Wrapper = Styled.div(({screen}) =>`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    padding: 54px 0;
    min-height: 700px;

    .content-wrapper{
        max-width: 770px;
        width: 90%;
        min-width: 340px;

    }

    .grid-area{
        display: flex;
        justify-content: ${screen < 772 ? 'center' : 'flex-start'};
        align-items: center;
        flex-wrap: wrap;
        
        
    }



    .title-cont{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        padding: 0 12px;
        margin-bottom: 32px;

        h3{
            font-family: Raleway;
            font-style: normal;
            font-weight: 800;
            font-size: 42px;
            line-height: 58px;
            text-align: center;
            text-transform: uppercase;

            margin-right: 16px;

            /* white */

            color: #FFFFFF;

            padding: 8px 24px;
            background: #209FBC;
            border-radius: 4px;
        }
        
        p{
            font-family: Oxygen;
            font-style: normal;
            font-weight: normal;
            font-size: 20px;
            line-height: 32px;

            /* Gray 3 */

            color: #828282;
        }

        p.nama{
            font-family: Raleway;
            font-style: normal;
            font-weight: bold;
            font-size: 34px;
            line-height: 42px;

            /* Gray 1 */

            color: #333333;
        }
    }
`)
    
export default Journey