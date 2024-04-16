import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

function valuetext(value) {
  return `${value}`;
}

export default function RangeSlider() {
  return (
    <Box sx={{ width: 200 }}>
      <Slider
        aria-label="Always visible"
        defaultValue={50} // Set default value to 50
        getAriaValueText={valuetext}
        step={1} // Change the step to 1 for smoother range selection
        valueLabelDisplay="on"
      />
    </Box>
  );
}
