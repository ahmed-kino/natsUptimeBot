import { Box, Button, Modal, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";
import { CHECKS_URL } from "../utils/constant";

interface DeleteModalProps {
  open: boolean;
  onClose: () => void;
  checkId: string | undefined;
}

const DeleteCheckModal: React.FC<DeleteModalProps> = ({
  open,
  onClose,
  checkId,
}) => {
  const navigate = useNavigate();
  const handleDelete = () => {
    fetch(`${CHECKS_URL}${checkId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(await response.text());
        }
        return response;
      })
      .then((data) => {
        console.log("Item deleted successfully", data);
        navigate("/checks");
      })
      .catch((error) => {
        console.error("Error :", error);
      });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 2,
          textAlign: "center",
        }}
      >
        <Typography id="delete-modal-description" sx={{ mt: 2 }}>
          Are you sure you want to delete this check?
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete
          </Button>
          <Button
            onClick={onClose}
            variant="contained"
            color="success"
            sx={{ ml: 1 }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteCheckModal;
