import moment from 'moment'
import parse from 'html-react-parser';
import { ContextMenuTrigger } from "react-contextmenu";
const ChatLeft = (props)=>{
    const MENU_TYPE = props.docid;
    return (
        <>
        <li className={"chat chat-left"}>
            <div className="chat-avatar">
                <img src={props.dataMember ? props.dataMember.photoURL : 'https://avatars.dicebear.com/api/identicon/.svg?b=%23f5f5f5&w=105&h=105'} alt={`Profile ${props.dataMember ? props.dataMember.displayName : 'unknown'}`}/>
            </div>
            <div className={"ml-0"}>
                <div className="chat-name mb-1" style={{fontSize:"1rem"}}>
                    {props.dataMember ? props.dataMember.displayName : 'unknown' }
                </div>
                <div className={"d-flex flex-row"}>
                    {props.IsAdmin ?
                    <ContextMenuTrigger id={MENU_TYPE} holdToDisplay={1000}>
                        <div className="chat-text">
                            {parse(props.body)}
                        </div>
                    </ContextMenuTrigger>
                    :    
                    <div className="chat-text">
                        {parse(props.body)}
                    </div>
                    }
                    <div className={"chat-hour ml-2 align-self-end"}>{moment.unix(props.timestamp.seconds).format("HH:mm")}</div>
                </div>
            </div>
        </li>
        </>
    )

}

export default ChatLeft