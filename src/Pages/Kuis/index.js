import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { db, API_URL } from '../../config/Firebase'
import Countdown from 'react-countdown'
import parse from 'html-react-parser'
import Styled from '@emotion/styled'
import useResize from 'use-resize'
import twoDigit from 'two-digit'
import axios from 'axios'
//COMPS
import SpinnerSimple from '../../component/Spinner/Spin2'
import Spinner from '../../component/Spinner/Spin1'
import Navbar from '../../component/Navbar/Navbar'
    
const Kuis = ({match}) => {
    const kuisID = match.params.kuisID
    const [processingSubmit, setprocessingSubmit] = useState('false')
    const [ date, setDate ] = useState(Date.now() + 180*(60000))
    const [allowSession, setallowSession] = useState("load")
    const [emptyAnswer, setemptyAnswer] = useState(-11291)
    const [showPopup, setshowPopup] = useState(false)
    const [questions, setquestions] = useState([])
    const [isSaved, setisSaved] = useState(false)
    const [Journey, setJourney] = useState({})
    const [Topik, setTopik] = useState({})
    const [Kuis, setKuis] = useState({})
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
    
    const changeAnswer = (value, i, id) => {
        let el = document.getElementById(id)
        let data = answer
        if (data[i] === value) {
            data[i] = ""
            el.checked = false
        }else{
            data[i] =  value
        }

        let counter = 0
        answer.forEach(ans => {
            if (ans === "") counter++
        })
        console.log(counter)
        setemptyAnswer(counter)

        setanswer(data)
        localStorage.setItem('savedAnswer', answer.join(","))
        localStorage.setItem('savedKuisID', kuisID)
        console.log(answer) 
    }

    const handleSubmit = (e) => {
        if(typeof e != 'undefined') e.preventDefault()

        setprocessingSubmit('true')
        
        console.log({
            kuis : {
                kuisID : kuisID,
                nama : Kuis.nama
            },
            journeyID : Kuis.journeyID,
            topikID : Journey.topikID,
            userID : currentUser.uid,
            answer : answer
        })
        console.log("submiting . . .")
        
        axios.post(`${API_URL}/submit`, {
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
                localStorage.removeItem('finalTime')
                setprocessingSubmit('false')
                setallowSession("done")
            }
            setshowPopup(true)
        })
        .catch(function (err, res) {
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
            setprocessingSubmit(false)
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
            
            // const paketKuis = journeyData.kuisList
            
            //UPDATING STATE
            setKuis(kuisData)
            setJourney(journeyData)
            setTopik(topikData)            

            // for (let i = 0; i < paketKuis.length; i++) {
            //     if (paketKuis[i].uid === kuisID){
            //         setcurrentKuisIndex(i + 1)
            //         break
            //     }
            // }

            if (!profileData.topik.includes(journeyData.topikID)) setallowSession("unenrolled")
            else if (userKuis.exists) setallowSession("disallow")
            else proceedKuis()

            async function proceedKuis(){
                const questionData = await db.collection('Kuis').doc(kuisID).collection('Questions').get()
                let questionArr = []
                let filler = []
                questionData.forEach( doc => {
                    questionArr.push(doc.data())
                    filler.push("")
                })
                setemptyAnswer(questionData.length)
                setquestions(questionArr)
                if(localStorage.getItem('savedAnswer') === null) setanswer(filler)

                console.log("bolehin")
                setallowSession("allowed")

                 //SETTING UP TIME DURATION
                if(localStorage.getItem('finalTime') !== null){
                    setDate(parseInt(localStorage.getItem('finalTime')))
                }else{
                    let endTime = Date.now() + parseInt(kuisData.durasi)*(60000)
                    setDate(endTime)
                    localStorage.setItem('finalTime', endTime)
                }

            }

        }
        
        //RUN THE FIRESTORE QUERIES AND CHECK FOR ALLOWANCE
        FireAction()
        
        
    }, [kuisID, currentUser.uid])


 

    const Disallow = () => {
        return (
            <div className="allowsession">
                <h4>MAAF KUIS {Kuis.Nama} SUDAH PERNAH DIAMBIL</h4>
                <Link to={`/kuis/${kuisID}/result`} className="btn-bordered mt-4">LIHAT HASIL</Link>
            </div>
            )
        }
    const Unenrolled = () => {
        return (
            <div className="allowsession">
                <h4>AMBIL TOPIK {Topik.nama} TERLEBIH DAHULU</h4>
                <Link to={`/topik/${Topik.topikKey}`}><p className="btn-bordered">BUKA TOPIK {Topik.nama}</p></Link>
            </div>
        )
    }
    const Nopredecessor = () => {
        return (
            <div className="allowsession">
                <h4>AMBIL KUIS SEBELUMNYA TERLEBIH DAHULU</h4>
            </div>
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
                <h2>{Kuis.durasi} MENIT&ensp;|&ensp; {Topik.nama} : {Journey.nama} &ensp;|&ensp; {questions.length} SOAL</h2>
                <Countdown date={date} renderer={renderer} onComplete={() => handleSubmit()}/>
                <form id="form" onSubmit={(e)=> handleSubmit(e)}>
                {questions.map((q, i)=>(
                    <div className="question-card" key={i}>
                        <div className="nomorsoal">
                            <p>{i+1}</p>
                        </div>
                        <div className="the-question">
                            <p className="nomornempel">{i+1}.&ensp;</p>
                            {parse(q.body)} 
                        </div>
                        <div className="pilgan">
                            {q.options.map((o,j)=>(
                                <div className="eachinput" key={j}>
                                    <input type="radio" defaultChecked={answer[i] === defaultOptionList[j]} name={`answer${i}`} id={`answer${i+defaultOptionList[j]}`} onClick={(e) => changeAnswer(e.target.value, i, `answer${i+defaultOptionList[j]}`)} value={o.type}/>
                                    <label htmlFor={`answer${i+defaultOptionList[j]}`} className={`options`}>
                                        <p className="type">{o.type}</p>
                                        {parse(o.body)}
                                    </label>
                                </div>
                            ))}
                        </div>   
                    </div >
                ))}
                <button type="button" className="btn-bordered-blue openconfirm" onClick={()=> setprocessingSubmit('confirm')}>{ processingSubmit !== 'true' ? "SELESAI KUIS" : <SpinnerSimple />}</button>
                {processingSubmit === 'confirm' && 
                    <div className="popup-cont">
                        <div className="popup-postsubmit">
                            <p>KONFIRMASI SELESAI</p>                        
                            {emptyAnswer > 0 &&
                                <p className="kok-kosong">Masih ada {emptyAnswer} soal belum terjawab</p>
                            }        
                            {emptyAnswer === -11291 &&
                                <p className="kok-kosong">Semua soal belum terjawab</p>
                            }        
                            <button type="button" className="btn-bordered-gray openconfirm" onClick={()=> setprocessingSubmit('false')}>KEMBALI</button>
                            <button type="submit" className="btn-bordered submit">SELESAI</button>
                        </div>
                    </div>
                }
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
                            <Link to={`/kuis/${kuisID}/result`} className="btn-bordered mt-4">LIHAT HASIL</Link>
                        )}
                    </div>
                </div>
            }
            {processingSubmit === 'true' && 
                <div className="popup-cont">
                    <div className="popup-postsubmit">
                        <p>MENGUMPULKAN...</p>                        
                    </div>
                </div>
            }

        </Wrapper>
    </>
    )
}
    
const renderer = ({ hours, minutes, seconds, completed}) => {
    if (completed) {
      return <div className="btn-bordered">Time is up!</div>
    } else {
      return (
        <div className="btn-bordered timerbox">
            <p>
                { hours ? <span className="timer">{twoDigit(hours)}</span> : '' } {hours ? ':' : ''} <span  className="timer">{twoDigit(minutes)}</span> : <span className="timer">{twoDigit(seconds)}</span>
            </p>
        </div>
      );
    }
};

const Wrapper = Styled.div(({screen, processingSubmit}) =>`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding-bottom: 80px;

    div.allowsession{
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: 100%;

        h4{
            font-family: Raleway;
            font-style: normal;
            font-weight: bold;
            font-size: 24px;
            line-height: 50px;
            color: #209FBC;
            text-transform: uppercase;
        }
    }

    .timerbox{
        position: fixed;
        bottom: 16px;
        right: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 20;

        p{
            min-width: 154px;
            position: relative;
            margin: 4px 0;
            font-family: Oxygen;
            font-weight: bold;
            font-size: 32px;
        }
    }

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
            min-height: 150px;
            padding: 24px 0;
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
            
            .kok-kosong{
                font-size: 14px;
                color: gray;
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
            width: 228px;
            height: 64px;
            ${processingSubmit ? "padding: 0;" : ""}
        }
        button.openconfirm{
            width: 228px;
            margin-top: 24px;
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
                display: ${screen < 882 ? 'none' : 'flex'};
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
                ${screen < 702 ? "margin-left: 12px;" : ""}

                &:first-letter{
                    text-transform: uppercase;
                }
            }
            .the-question{
                margin-bottom: 36px;
                .nomornempel{
                    ${screen < 882 ? '' : 'display: none;'}
                    
                }
            }
        
        }
    }
`)
    
export default Kuis
