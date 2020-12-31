import React from "react";

export default function InputNilaiSoshum({
  NilaiMtkRef,
  NilaiEkonomiRef,
  NilaiGeoRef,
  NilaiSejarahRef,
  NilaiSosRef,
}) {
  return (
    <>
      <div className="form-group">
        <label>Matematika</label>
        <input type="text" className="form-control" ref={NilaiMtkRef} />
      </div>
      <div className="form-group">
        <label>Ekonomi</label>
        <input type="text" className="form-control" ref={NilaiEkonomiRef} />
      </div>
      <div className="form-group">
        <label>Sosiologi</label>
        <input type="text" className="form-control" ref={NilaiSosRef} />
      </div>
      <div className="form-group">
        <label>Geografi</label>
        <input type="text" className="form-control" ref={NilaiGeoRef} />
      </div>
      <div className="form-group">
        <label>Sejarah</label>
        <input type="text" className="form-control" ref={NilaiSejarahRef} />
      </div>
    </>
  );
}
