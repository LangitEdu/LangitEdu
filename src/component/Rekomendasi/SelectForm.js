import React from "react";

export default function SelectForm({ Label, Options, onChange }) {
  return (
    <>
      <div className="form-group">
        <label htmlFor="area">{Label}</label>
        <select
          className="form-control"
          id="area"
          onChange={onChange}
          defaultValue="default"
        >
          <option disabled value="default">
            Pilih {Label}
          </option>
          {Options.length > 0 &&
            Options.map((data, i) => {
              return (
                <option value={data.value} key={i}>
                  {data.label}
                </option>
              );
            })}
        </select>
      </div>
    </>
  );
}
