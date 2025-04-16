import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Button } from "@mui/material";
import { getLocalStorage } from "../../utils/utils";
import { useRouter } from "next/router";
import { Check } from "@mui/icons-material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "35%",
  maxWidth: "400px",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

export default function DeleteAccountModal({ open, setOpen }) {
  const [idUser, setIdUser] = React.useState<string>("");
  const [userJwt, setUserJwt] = React.useState<string>("");
  const router = useRouter();

  const handleClose = () => setOpen(false);

  React.useEffect(() => {
    setIdUser(getLocalStorage("userId"));
    setUserJwt(getLocalStorage("userJwt"));
  }, []);

  const handleConfirmDelete = React.useCallback(
    (event) => {
      event.preventDefault();

      fetch(`http://localhost:3000/api/deleteAccount?idUser=${idUser}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userJwt}`,
        },
      }).then((res) =>
        res.json().then((res) => {
          router.push("/login");
        })
      );
    },
    [idUser]
  );

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography sx={{ mb: "20px" }} variant="h6" color="error">
          Voulez-vous vraiment supprimer votre compte?
        </Typography>
        <Typography sx={{ mb: "30px" }} variant="body2" color="text.secondary">
          En supprimant votre compte, vous éffacerez également tous vos données
          ( panier, commandes, préférenes, commentaire )
        </Typography>
        <Button
          startIcon={<Check />}
          sx={{ width: "fit-content" }}
          variant="contained"
          color="primary"
          onClick={handleConfirmDelete}
        >
          Confirmer
        </Button>
      </Box>
    </Modal>
  );
}
