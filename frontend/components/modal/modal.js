import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Button, useMediaQuery } from "@mui/material";
import CheckoutForm from "../Checkoutform";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth:'400px',
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  textAlign: "center",
};

export default function CustomModal({
  open,
  setOpen,
  montant,
  idArticle,
  nombre
}) {
  const handleClose = () => setOpen(false);
  const isMobile=useMediaQuery('(max-width:920px)')


  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"       
      >
        <Box sx={isMobile? {...style,width:"100%",maxWidth:"400px"} : style}>
          <CheckoutForm montant={montant} idArticle={idArticle} nombre={nombre}/>
        </Box>
      </Modal>
    </div>
  );
}
