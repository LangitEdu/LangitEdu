import { storage } from '../config/Firebase'
import MakeID from './MakeID'

const UploadImage = (file, success, failure, ref='Media/Topik/')=>{
    let extention = file.name.split('.').pop().toLowerCase()
    let arrOfAcceptableExtention = ['jpg','png','jpeg']
    if(!arrOfAcceptableExtention.includes(extention)){
        failure('Format tidak didukung, harap masukan file berformat jpp atau png')
        return
    }
    if(file.size > 5242880){
        failure('Ukuran file terlalu besar, harap masukan file beukuran kurang dari 5Mb')
        return
    }

    storage.ref(ref).child(`${MakeID(10)}.${extention}`).put(file)
    .then(res=>{
        res.ref.getDownloadURL().then(url=>{
            success(url)
        }).catch(err=>{
            failure(`${err.code}, ${err.message}`)
        })
    })
    .catch(err=>{
        failure(`${err.code}, ${err.message}`)
    })
}

export default UploadImage;