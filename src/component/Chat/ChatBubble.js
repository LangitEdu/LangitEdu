import {useAuth} from '../../contexts/AuthContext'
import moment from 'moment'

const ChatBubble = (props)=>{
    const {currentUser} = useAuth()
    return (
        <li className={props.sender_uid === currentUser.uid ? "chat chat-right d-flex flex-row-reverse" : "chat chat-left"}>
            <div className="chat-avatar">
                <img src={props.dataMember ? props.dataMember.photoURL : 'https://avatars.dicebear.com/api/identicon/.svg?b=%23f5f5f5&w=105&h=105'} alt={`Profile ${props.dataMember ? props.dataMember.displayName : 'unknown'}`}/>
            </div>
            <div className={props.sender_uid === currentUser.uid ? "mr-3" : "ml-0"}>
                <div className="chat-name mb-1" style={{fontSize:"1rem"}}>
                    {props.dataMember ? props.dataMember.displayName : 'unknown' }
                </div>
                <div className={props.sender_uid === currentUser.uid ? "d-flex flex-row-reverse" : "d-flex flex-row"}>
                    <div className="chat-text">
                        <p>{props.body}</p>
                    </div>
                    <div className={props.sender_uid === currentUser.uid ? "chat-hour mr-2 align-self-end" : "chat-hour ml-2 align-self-end"}>{moment(props.timestamp).format("HH:mm")}</div>
                </div>
            </div>
        </li>
    )

}

export default ChatBubble