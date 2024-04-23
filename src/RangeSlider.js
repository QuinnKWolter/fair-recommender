import React, { useState } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

function RangeSlider({ label, value, onChange }) {
  const [showLabel, setShowLabel] = useState(false);

  return (
    <Box sx={{ display: "flex", alignItems: "center", width: 200 }}>
      <Typography variant="subtitle1" sx={{ marginRight: 2, minWidth: 80 }}>
        {label}
      </Typography>
      <Slider
        aria-label="Always visible"
        value={value}
        onChange={onChange}
        step={1}
        valueLabelDisplay={showLabel ? "on" : "off"}
        onMouseDown={() => setShowLabel(true)}
        onMouseUp={() => setShowLabel(false)}
        onTouchStart={() => setShowLabel(true)}
        onTouchEnd={() => setShowLabel(false)}
        sx={{ flex: 1 }} // Use flex to fill the available space
      />
    </Box>
  );
}

export default RangeSlider;
