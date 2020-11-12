import {useAuth} from '../../contexts/AuthContext'
import ChatRight from './ChatRight';
import ChatLeft from './ChatLeft';
import { ContextMenu, MenuItem } from "react-contextmenu";
import {db} from '../../config/Firebase'

const ChatBubble = (props)=>{
    const {currentUser, IsAdmin} = useAuth()
    const MENU_TYPE = props.docid;
    const handleHapus = ()=>{
        db.collection('Komunitas').doc(props.komuniastUID).collection('Pesan').doc(props.docid).delete()
        .catch(function(error) {
            console.error("Error removing document: ", error);
        });
    }
    return (
        props.sender_uid === currentUser.uid ?
        <> 
            <ChatRight {...props} /> 
        <ContextMenu id={MENU_TYPE}>
            <MenuItem onClick={handleHapus}>Hapus</MenuItem>
        </ContextMenu>
        </>
        : 
        IsAdmin ?
        <>
        <ChatLeft {...props} IsAdmin={IsAdmin} />
        <ContextMenu id={MENU_TYPE}>
            <MenuItem onClick={handleHapus}>Hapus</MenuItem>
        </ContextMenu>
        </>
        :
        <ChatLeft {...props} />
    )

}

export default ChatBubble