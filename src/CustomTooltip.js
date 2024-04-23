import React from "react";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

const CustomTooltip = ({
  open,
  position,
  content,
  onMouseLeave,
  cancelHideTooltip,
}) => {
  const tooltipStyle = {
    position: "fixed",
    top: `${position.y + 20}px`,
    left: `${position.x + 10}px`,
    pointerEvents: "auto",
    background: "rgba(97, 97, 97, 0.9)",
    color: "white",
    padding: "8px 12px",
    borderRadius: "4px",
    boxShadow: "0px 2px 10px rgba(0,0,0,0.2)",
    zIndex: 1000,
    maxWidth: "280px",
    wordWrap: "break-word",
    fontSize: "0.875rem",
    fontFamily: "Roboto, sans-serif",
  };

  return (
    <div
      style={tooltipStyle}
      onMouseEnter={cancelHideTooltip}
      onMouseLeave={onMouseLeave}
    >
      <Tooltip
        open={open}
        placement="top"
        disableFocusListener
        disableTouchListener
      >
        {/* Set Typography to render as div to avoid <div> within <p> issue */}
        <Typography component="div" style={{ color: "inherit" }}>
          {content.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </Typography>
      </Tooltip>
    </div>
  );
};

export default CustomTooltip;
