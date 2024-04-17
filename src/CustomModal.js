import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600, // Maintain a fixed width
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: "80vh", // Limit the maximum height of the modal
  overflowY: "auto", // Enable vertical scrolling within the modal
};

export default function CustomModal({ open, handleClose, title, content }) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {title}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }} component="div">
          {content}
        </Typography>
        <Button
          onClick={handleClose}
          sx={{ mt: 2 }}
          variant="outlined"
          color="primary"
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
}
