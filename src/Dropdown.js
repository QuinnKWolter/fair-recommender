import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const Dropdown = ({ label, options, onChange, value }) => {
  return (
    <div style={{ margin: "8px 0" }}>
      <Autocomplete
        disablePortal
        options={options}
        getOptionLabel={(option) => option.label}
        onChange={(event, newValue) => onChange(newValue)}
        value={value}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        renderInput={(params) => <TextField {...params} label={label} />}
      />
    </div>
  );
};

export default Dropdown;
