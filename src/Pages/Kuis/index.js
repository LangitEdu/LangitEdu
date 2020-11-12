import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import Navbar from '../../component/Navbar/Navbar'
import Spinner from '../../component/Spinner/Spin1'

import { db } from '../../config/Firebase'
import Styled from '@emotion/styled'
    
const Kuis = ({match}) => {
    const [currentKuisIndex, setcurrentKuisIndex] = useState("")
    const [allowSession, setallowSession] = useState("load")
    const [showPopup, setshowPopup] = useState(false)
    const [topik, settopik] = useState({})
    const [questions, setquestions] = useState([])
    const [isSaved, setisSaved] = useState(false)
    const [kuis, setkuis] = useState({})
    const kuisID = match.params.kuisID
    const {currentUser} = useAuth()
    const [answer, setanswer] = useState(() => {
        //TAKING IN ANSWER SAVED IN LOCAL STORAGE WITH CERTAIN CONTION
        if(localStorage.getItem('savedAnswer') !== null && localStorage.getItem('savedKuisID') === kuisID){
            return localStorage.getItem('savedAnswer').split(",")
        }else{
            return []
        }
    }) 

    const resetIfExist = (id) => {
        const element = document.getElementById(id)

        if(typeof(element) != 'undefined' && element != null){
            element.reset()
        }
    }        
    
    const changeAnswer = (value, i) => {
        let data = answer
        data[i] = value
        setanswer(data)
        localStorage.setItem('savedAnswer', answer.join(","))
        localStorage.setItem('savedKuisID', kuisID)
        console.log(answer) 
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        console.log("submiting . . .")

        axios.post('http://localhost:5001/langit-edu/us-central1/api/submit', {
            kuisID : kuisID,
            kuis: kuis,
            answers : answer,
            userID : currentUser.uid
          })
        .then(function (res) {
            console.log(res.data)
            if (res.data.body){
                setisSaved(true)
                resetIfExist("form")
                localStorage.removeItem('savedAnswer')
                localStorage.removeItem('savedKuisID')
            }
            setshowPopup(true)
            setallowSession("done")
        })
        .catch(function (err) {
            console.log(`API fetching ERROR : ${err}`)
            setshowPopup(true)
        })
    }


    useEffect(() => {
        const FireAction = async () => {
            const userKuis = await db.collection('Profile').doc(currentUser.uid).collection('Kuis').doc(kuisID).get()
            const userTopics = (await db.collection('Profile').doc(currentUser.uid).get()).data().topik
            const kuisData = (await db.collection('Kuis').doc(kuisID).get()).data()
            const topikData = (await db.collection('Topik').doc(kuisData.topikID).get()).data()
            const paketKuis = topikData.kuislist
            
            setkuis(kuisData)
            settopik(topikData)
            
            let predeceDone = true
            for (let i = 0; i < paketKuis.length; i++) {
                if (paketKuis[i] === kuisID){
                    setcurrentKuisIndex(i + 1)
                    break
                }
                const eachKuis = (await db.collection('Profile').doc(currentUser.uid).collection('Kuis').doc(paketKuis[i]).get()).exists
                if (!eachKuis) predeceDone = false 
                console.log(eachKuis)
                
            }

            if (!userTopics.includes(kuisData.topikID)) setallowSession("unenrolled")
            else if (userKuis.exists) setallowSession("disallow")
            else if (!predeceDone) setallowSession("nopredecessor")
            else proceedKuis()

            async function proceedKuis(){
                const questionData = await db.collection('Kuis').doc(kuisID).collection('Questions').get()
                let questionArr = []
                let filler = []
                questionData.forEach( doc => {
                    questionArr.push(doc.data())
                    filler.push("")
                })
                setquestions(questionArr)
                if(localStorage.getItem('savedAnswer') == null) setanswer(filler)

                console.log("bolehin")
                setallowSession("allowed")
            }

        }
        
        //RUN THE FIRESTORE QUERIES AND CHECK FOR ALLOWANCE
        FireAction()
        
    }, [kuisID, currentUser.uid])

    const Disallow = () => {
        return (
            <h2>MAAF KUIS {kuis.Nama} SUDAH PERNAH DIAMBIL</h2>
            )
        }
    const Unenrolled = () => {
        return (
            <h2>AMBIL TOPIK {kuis.Nama} TERLEBIH DAHULU</h2>
        )
    }
    const Nopredecessor = () => {
        return (
            <h2>AMBIL KUIS SEBELUMNYA TERLEBIH DAHULU</h2>
        )
    }

    return (
    <>
        <Navbar />
        <Wrapper>
            {allowSession === "unenrolled" && <Unenrolled /> }
            {allowSession === "disallow" && <Disallow /> }
            {allowSession === "nopredecessor" && <Nopredecessor /> }

            {allowSession === "allowed" && 
            <>
                <h1>{kuis.nama}</h1>
                <h2>QUIZ {currentKuisIndex} &ensp;|&ensp; TOPIK : {topik.nama} &ensp;|&ensp; {questions.length} SOAL</h2>
                <form id="form" onSubmit={(e)=> handleSubmit(e)}>
                {questions.map((q, i)=>(
                    <div className="question-card" key={i}>
                        <p key={i}>{q.body}</p> 
                        <div className="pilgan">
                            <label htmlFor={`answer${i}A`} className={`options ${answer[i] === "A" ? "checkedblue":""}`}><input type="radio" defaultChecked={answer[i] === "A"} name={`answer${i}`} id={`answer${i}A`} onClick={(e) => changeAnswer(e.target.value, i)} value={q.options[0].type}/>{q.options[0].body}</label>
                            <label htmlFor={`answer${i}B`} className={`options ${answer[i] === "B" ? "checkedblue":""}`}><input type="radio" defaultChecked={answer[i] === "B"} name={`answer${i}`} id={`answer${i}B`} onClick={(e) => changeAnswer(e.target.value, i)} value={q.options[1].type}/>{q.options[1].body}</label>
                            <label htmlFor={`answer${i}C`} className={`options ${answer[i] === "C" ? "checkedblue":""}`}><input type="radio" defaultChecked={answer[i] === "C"} name={`answer${i}`} id={`answer${i}C`} onClick={(e) => changeAnswer(e.target.value, i)} value={q.options[2].type}/>{q.options[2].body}</label>
                            <label htmlFor={`answer${i}D`} className={`options ${answer[i] === "D" ? "checkedblue":""}`}><input type="radio" defaultChecked={answer[i] === "D"} name={`answer${i}`} id={`answer${i}D`} onClick={(e) => changeAnswer(e.target.value, i)} value={q.options[3].type}/>{q.options[3].body}</label>
                        </div>   
                    </div >
                ))}
                <button type="submit" className="btn-bordered">SELESAI</button>
                </form>
            </>
            }

            {allowSession === "load" && 
                <div className="loader">
                    <Spinner />
                </div>
            }

            {showPopup && 
                <div className="popup-cont">
                    <div className="popup-postsubmit">
                        <p>{isSaved ? "KUIS BERHASIL DIKUMPULKAN" : "MAAF TERJADI KESALAHAN"}</p>
                    </div>
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

    
    .checkedblue{
        background: #209FBC !important;
        box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25) !important;
    }
    
    h1{
        margin-top: 48px;
        font-family: Raleway;
        font-style: normal;
        font-weight: 800;
        font-size: 63px;
        line-height: 74px;
        text-align: center;
        text-transform: capitalize;
                
        color: #444444;
    }

    h2{
        font-family: Oxygen;
        letter-spacing: 0.5px;
        font-style: normal;
        font-weight: normal;
        font-size: 17px;
        line-height: 28px;
        margin-bottom: 32px;
        /* identical to box height */

        text-align: center;

        /* Gray 3 */

        color: #828282;
        text-transform: uppercase;
    }

    .checked{
        color: red !important;
    }
    
    .popup-cont{
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 10;
        display: flex;
        justify-content: center;
        align-items: center;

        .popup-postsubmit{
            max-width: 450px;
            width: 90%;
            min-width: 350px;
            height: 200px;
            background: #FAFAFA;
            border-radius: 12px;
            box-shadow: 0 0 12px 0 rgba(0,0,0,0.3);
        }   
    }

    .loader{
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: #FAFAFA;
        z-index: 11;
    }
    
    form{
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        .question-card{
            width: 90%;
            max-width: 702px;
            min-width: 340px;
            padding: 48px 4%;
            margin: 12px 0;
            
            /* fafafa */
            
            background: #FAFAFA;
            box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
            border-radius: 16px;
            
            .pilgan{
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: flex-start;
                flex-direction: column;

                .options{
                    width: 100%;
                    padding: 16px;
                    margin: 8px 0;
                    background: #FAFAFA;
                    box-shadow: inset 0px 0px 4px rgba(0, 0, 0, 0.25);
                    border-radius: 8px;
                    
                    font-family: Oxygen;
                    font-style: normal;
                    font-weight: normal;
                    font-size: 26px;
                    line-height: 33px;
                    
                    /* Gray 2 */
                    
                    color: #4F4F4F;

                }
            }

            p{
                font-family: Oxygen;
                letter-spacing: 0.5px;
                font-style: normal;
                font-weight: 900;
                font-size: 26px;
                line-height: 33px;
                margin-bottom: 36px;

                color: #333333;

                &:first-letter{
                    text-transform: uppercase;
                }
            }
        }
    }
`)
    
export default Kuis
