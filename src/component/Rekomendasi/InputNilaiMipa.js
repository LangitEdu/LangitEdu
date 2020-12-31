import React from "react";

export default function InputNilaiMipa({
  NilaiBiologiRef,
  NilaiFisikaRef,
  NilaiKimiaRef,
  NilaiMtkRef,
}) {
  return (
    <>
      <div className="form-group">
        <label>Matematika</label>
        <input type="text" className="form-control" ref={NilaiMtkRef} />
      </div>
      <div className="form-group">
        <label>Fisika</label>
        <input type="text" className="form-control" ref={NilaiFisikaRef} />
      </div>
      <div className="form-group">
        <label>Kimia</label>
        <input type="text" className="form-control" ref={NilaiKimiaRef} />
      </div>
      <div className="form-group">
        <label>Biologi</label>
        <input type="text" className="form-control" ref={NilaiBiologiRef} />
      </div>
    </>
  );
}
