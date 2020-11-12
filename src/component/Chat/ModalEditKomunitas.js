import { useState } from "react"
import NotDismissible from "../Alert/NotDismissible"

const ModalEditKomunitas = (props)=>{
    const [Error, setError] = useState(false)
    const [SubmitAble, setSubmitAble] = useState(true)
    const handleInputChange = (e)=>{
        // Id ga boleh ada whitespace
        setError()
        let patt = /(\W|\s)/
        if(patt.test(props.idKomunitasRef.current.value)){
            setError({message:"Id tidak boleh mengantuk karanter non word atau white space"})
            return
        }
        if(props.idKomunitasRef.current.value.length > 5 && props.namaKomunitasRef.current.value.length > 5 ){
            setSubmitAble(true)
        }else{
            setSubmitAble(false)
        }

        
    }
    
    const handleFileChange = (e)=>{
        setError()
        if(e.target.files.length > 0){
            const file = e.target.files[0]
            const AcceptAbleExtention = ['png','jpeg','jpg']
            let extention = file.name.split('.').pop();
            if(!AcceptAbleExtention.includes(extention.toLowerCase())){
                setError({message:"anda mengupload file dengan ekstensi yang tidak diizinkan, silahkan upload file yang lain"});
                document.getElementById('profilepic').src = `https://avatars.dicebear.com/api/identicon/${new Date().getTime()}.svg`
                return;
            }
            if(file.size > 5242880){
                setError({message:'Ukuran file yang anda upload terlalu besar, harap upload file yang berukuran tidak lebih dari 5MB'})
                document.getElementById('profilepic').src = `https://avatars.dicebear.com/api/identicon/${new Date().getTime()}.svg`
                return
            }
            let fileName;
            if(file.name.length > 50){
                fileName = file.name.substring(0,40)+"..."
            }else{
                fileName = file.name
            }
            var reader = new FileReader();
    
            reader.onload = function(e) {
                document.getElementById('profilepic').src = e.target.result
            }
            reader.readAsDataURL(file);
            document.getElementById('labelProfileKom').innerHTML = fileName
        }else{
            document.getElementById('labelProfileKom').innerHTML = 'Choose file'
        }
    }
    
    return (
        <> 
    <div className="overflow" onClick={props.onClick} ></div>
    <div className="modal d-block" tabIndex="1">
        <div className="modal-dialog modal-lg">
        <div className="modal-content">
            <div className="modal-header">
            <h5 className="modal-title">Buat Komunitas</h5>
            <button type="button" className="close" onClick={props.onClick} aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            </div>
            <form onSubmit={props.onSubmit}>
                <div className="modal-body">
                    {Error &&
                    <NotDismissible type='danger' message={Error.message} />
                    }
                    <div className="row">
                        <div className="col-md-4">
                            <div className="profilpic mb-4" style={{maxWidth:'10rem',maxHeight:'10rem',overflow:'hidden',borderRadius:"100%"}}>
                                <img id="profilepic" src={ props.defaultValue.photoUrl } alt="Profile" className="img-fluid"/>
                            </div>
                        </div>
                        <div className="col-md-8">
                            <div className="form-group">
                                <div className="custom-file">
                                    <input ref={props.ProfileKomPicRef} type="file" className="custom-file-input" id="ProfileKom" onChange={handleFileChange} accept=".jpg,.jpeg,.png" />
                                    <label className="custom-file-label" htmlFor="ProfileKom" id='labelProfileKom' >Choose file</label>
                                </div>
                            </div>
                            <div className="form-group">
                                <label> Nama Komunitas</label>
                                <input defaultValue={props.defaultValue.nama} ref={props.namaKomunitasRef} className="form-control" type="text" onChange={handleInputChange} required/>
                                <small className="form-text text-muted">minimal 5 karakter</small>
                            </div>
                            <div className="form-group">
                                <label>ID Komunitas</label>
                                <div className="input-group mb-2 mr-sm-2">
                                <div className="input-group-prepend">
                                    <div className="input-group-text">@</div>
                                    </div>
                                    <input defaultValue={props.defaultValue.id.replace('@','')} ref={props.idKomunitasRef} type="text" className="form-control" onChange={handleInputChange} required />
                                </div>
                                <small className="form-text text-muted">Id komunitas hanya dapat berupa kombinasi angka dan minimal 5 karakter</small>
                            </div>
                            <div className="form-group">
                                <label>Deskripsi</label>
                                <textarea defaultValue={props.defaultValue.deskripsi} ref={props.deskripsiKomunitasRef} className="form-control" rows="10"></textarea>
                            </div>
                        </div>
                        <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={props.onClick}>Close</button>
                        <button type="submit" className="btn btn-primary" disabled={Error || !SubmitAble || props.Loading} >Simpan Perubahan</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        </div>
    </div>
    </>
    )
}

export default ModalEditKomunitas