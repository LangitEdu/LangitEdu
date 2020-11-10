const ModalAddKomunitas = (props)=>{
    return (
        <> 
    <div className="overflow" onClick={props.onClick} ></div>
    <div className="modal d-block" tabIndex="1">
        <div className="modal-dialog">
        <div className="modal-content">
            <div className="modal-header">
            <h5 className="modal-title">Buat Komunitas</h5>
            <button type="button" className="close" onClick={props.onClick} aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            </div>
            <form onSubmit={props.onSubmit}>
            <div className="modal-body">
                <div className="form-group">
                    <label> Nama Komunitas</label>
                    <input ref={props.namaKomunitasRef} className="form-control" type="text" required/>
                </div>
                <div className="form-group">
                    <label>ID Komunitas</label>
                    <div className="input-group mb-2 mr-sm-2">
                    <div className="input-group-prepend">
                        <div className="input-group-text">@</div>
                        </div>
                        <input ref={props.idKomunitasRef} type="text" className="form-control" required />
                    </div>
                    <small class="form-text text-muted">Id komunitas hanya dapat berupa kombinasi angka dan huruf dan akan secara otomatis dibuat ke lowecase</small>
                </div>
                <div className="form-group">
                    <label>Deskripsi</label>
                    <textarea ref={props.deskripsiKomunitasRef} className="form-control" rows="10" required></textarea>
                </div>
            </div>
            <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={props.onClick}>Close</button>
            <button type="submit" className="btn btn-primary">Buat Komunitas</button>
            </div>
            </form>
        </div>
        </div>
    </div>
    </>
    )
}

export default ModalAddKomunitas