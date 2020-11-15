import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useResize from 'use-resize'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import Navbar from '../../component/Navbar/Navbar'
import Spinner from '../../component/Spinner/Spin1'
import SpinnerSimple from '../../component/Spinner/Spin2'
import parse from 'html-react-parser';
import { db } from '../../config/Firebase'
import Styled from '@emotion/styled'
    
const Kuis = ({match}) => {
    const [processingSubmit, setprocessingSubmit] = useState(false)
    const [currentKuisIndex, setcurrentKuisIndex] = useState("")
    const [allowSession, setallowSession] = useState("load")
    const [showPopup, setshowPopup] = useState(false)
    const [questions, setquestions] = useState([])
    const [isSaved, setisSaved] = useState(false)
    const [Journey, setJourney] = useState({})
    const [Topik, setTopik] = useState({})
    const [Kuis, setKuis] = useState({})
    const kuisID = match.params.kuisID
    const {currentUser} = useAuth()
    const screen = useResize().width
    const defaultOptionList = ['A','B','C','D','E']

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

        setprocessingSubmit(true)
        
        console.log("submiting . . .")
        
        axios.post('http://localhost:5001/langit-edu/asia-southeast2/api/submit', {
            kuis : {
                kuisID : kuisID,
                nama : Kuis.nama
            },
            journeyID : Kuis.journeyID,
            topikID : Journey.topikID,
            userID : currentUser.uid,
            answer : answer
        })
        .then(function (res) {
            console.log(res.data)
            if (res.data.body){
                setisSaved(true)
                resetIfExist("form")
                localStorage.removeItem('savedAnswer')
                localStorage.removeItem('savedKuisID')
                setprocessingSubmit(false)
                setallowSession("done")
            }
            setshowPopup(true)
        })
        .catch(function (err) {
            console.log(`API fetching ERROR : ${err}`)
            console.log({
                kuis : {
                    kuisID : kuisID,
                    nama : Kuis.nama
                },
                journeyID : Kuis.journeyID,
                topikID : Journey.topikID,
                userID : currentUser.uid,
                answer : answer
            });
            setshowPopup(true)
        })
    }


    useEffect(() => {
        const FireAction = async () => {
            //CALLING FIRESTORE TO CHECK IF KUIS ALREADY TAKEN
            const userKuis = await db.collection('Profile').doc(currentUser.uid).collection('Kuis').doc(kuisID).get()
            
            //CALLING ALL FIRESTORE NEEDED
            const profileData = (await db.collection('Profile').doc(currentUser.uid).get()).data()
            const kuisData = (await db.collection('Kuis').doc(kuisID).get()).data()
            const journeyData = (await db.collection('Journey').doc(kuisData.journeyID).get()).data()
            const topikData = (await db.collection('Topik').doc(journeyData.topikID).get()).data()
            
            const paketKuis = journeyData.kuisList
            
            //UPDATING STATE
            setKuis(kuisData)
            setJourney(journeyData)
            setTopik(topikData)
            
            // let predeceDone = true

            for (let i = 0; i < paketKuis.length; i++) {
                if (paketKuis[i].uid === kuisID){
                    setcurrentKuisIndex(i + 1)
                    break
                }
            //     const eachKuis = (await db.collection('Profile').doc(currentUser.uid).collection('Kuis').doc(paketKuis[i].uid).get()).exists
                
            //     if (!eachKuis) predeceDone = false 
            //     console.log(eachKuis)
                
            }

            if (!profileData.topik.includes(journeyData.topikID)) setallowSession("unenrolled")
            else if (userKuis.exists) setallowSession("disallow")
            // else if (!predeceDone) setallowSession("nopredecessor")
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
            <h2>MAAF KUIS {Kuis.Nama} SUDAH PERNAH DIAMBIL</h2>
            )
        }
    const Unenrolled = () => {
        return (
            <h2>AMBIL TOPIK {Kuis.Nama} TERLEBIH DAHULU</h2>
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
        <Wrapper screen={screen} processingSubmit={processingSubmit}>
            {allowSession === "unenrolled" && <Unenrolled /> }
            {allowSession === "disallow" && <Disallow /> }
            {allowSession === "nopredecessor" && <Nopredecessor /> }

            {allowSession === "allowed" && 
            <>
                <h1>{Kuis.nama}</h1>
                <h2>QUIZ {currentKuisIndex} &ensp;|&ensp; {Topik.nama} : {Journey.nama} &ensp;|&ensp; {questions.length} SOAL</h2>
                <form id="form" onSubmit={(e)=> handleSubmit(e)}>
                {questions.map((q, i)=>(
                    <div className="question-card" key={i}>
                        <div className="nomorsoal">
                            <p>{i+1}</p>
                        </div>
                        <p key={i}>{parse(q.body)}</p> 
                        <div className="pilgan">
                            {q.options.map((o,j)=>(
                                <div className="eachinput" key={j}>
                                    <input type="radio" defaultChecked={answer[i] === defaultOptionList[j]} name={`answer${i}`} id={`answer${i+defaultOptionList[j]}`} onClick={(e) => changeAnswer(e.target.value, i)} value={o.type}/>
                                    <label htmlFor={`answer${i+defaultOptionList[j]}`} className={`options`}>
                                        <p className="type">{o.type}</p>
                                        <p>{parse(o.body)}</p>
                                    </label>
                                </div>
                            ))}
                        </div>   
                    </div >
                ))}
                <button type="submit" className="btn-bordered submit">{ !processingSubmit  ? "SELESAI KUIS" : <SpinnerSimple />}</button>
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
                        {isSaved && (
                            <Link to={`/kuis/${kuisID}/result`} className="btn-bordered">LIHAT HASIL</Link>
                        )}
                    </div>
                </div>
            }

        </Wrapper>
    </>
    )
}
    
const Wrapper = Styled.div(({screen, processingSubmit}) =>`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding-bottom: 80px;


    input:checked + label {
        background: #209FBC !important;
        box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25) !important;
        color: white !important;
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
            display: flex;
            justify-content: space-evenly;
            align-items: center;
            flex-direction: column;

            p{
                font-family: Oxygen;
                letter-spacing: 0.5px;
                font-style: normal;
                font-weight: bold;
                font-size: 20px;
                line-height: 25px;
                text-align: center;
                margin: 0 16px;
                color: #444444;
            }
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

        button.submit{
            margin-top: 32px;
            width: 228px;
            height: 64px;
            ${processingSubmit ? "padding: 0;" : ""}
        }

        .question-card{
            position: relative;
            width: 90%;
            max-width: 702px;
            min-width: 340px;
            padding: 48px 4% ${screen < 702 ? "24px 4%" : ""};
            margin: 12px 0;
            
            /* fafafa */
            
            background: #FAFAFA;
            box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
            border-radius: 16px;

            .nomorsoal{
                position: absolute;
                top: 0px;
                left: -56px;
                padding: 2px 16px;
                background: #cccccc;
                border-radius: 4px;
                display: flex;
                justify-content: center;
                align-items: center;

                p{
                    margin: 0;
                    color:white;
                }

            }
            
            .pilgan{
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: flex-start;
                flex-direction: column;

                .eachinput{
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    input{
                        width: 0;                     
                        visibility: hidden;
                    }

                    label{
                        width: 100%;
                        padding: 16px;
                        margin: 8px 0;
                        background: #FAFAFA;
                        box-shadow: inset 0px 0px 4px rgba(0, 0, 0, 0.25);
                        border-radius: 8px;

                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        color: #4f4f4f;

                        p.type{
                            width: 32px;
                            height: 32px;

                            display: flex;
                            justify-content: center;
                            align-items: center;

                            background: #FFFFFF;
                            border-radius: 20px;
                            margin: 0;

                            font-family: Oxygen;
                            font-style: normal;
                            font-weight: bold;
                            font-size: 22px;
                            line-height: 22px;
                            padding: 0 0 4px 0;
                            text-align: right;

                            /* tosca */

                            color: #209FBC;
                            margin-right: 12px;
                        }
                        p{

                            font-family: Oxygen;
                            font-style: normal;
                            font-weight: normal;
                            font-size: 22px;
                            line-height: 24px;
                            
                            /* Gray 2 */
                            
                            margin: 0;
                        }
                        
                    }
                }
            }

            p{
                font-family: Oxygen;
                letter-spacing: 0.5px;
                font-style: normal;
                font-weight: 900;
                font-size: 22px;
                line-height: 30px;
                margin-bottom: 36px;
                ${screen < 702 ? "margin-left: 12px;" : ""}

                &:first-letter{
                    text-transform: uppercase;
                }
            }
        }
    }
`)
    
export default Kuis
