// Reusable dropdown component
import React from "react";

const Dropdown = ({ options, value, onChange, placeholder, style = {}, className = "form-select" }) => (
  <select className={className} style={style} value={value} onChange={onChange}>
    {placeholder && <option value="">{placeholder}</option>}
    {options.map(opt => (
      <option key={opt} value={opt}>{opt}</option>
    ))}
  </select>
);

export default Dropdown;
