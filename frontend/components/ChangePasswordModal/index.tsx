//This is a loggin page

import { useCallback, useState } from "react";
import {
  Alert,
  Button,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

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
  textAlign: "center",
};

interface formObject {
  oldPwd: string;
  newPwd: string;
  confirmPwd: string;
}

const defaultValues = {
  oldPwd: "",
  newPwd: "",
  confirmPwd: "",
};

const ChangePasswordModal = ({ open, setOpen }) => {
  const [values, setValues] = useState<formObject>(defaultValues);
  const [status, setStatus] = useState<string>("hide");

  const handleChange = useCallback(
    (event: any) => {
      event.preventDefault();
      setValues((prev) => ({
        ...prev,
        [event.target.name]: event.target.value,
      }));
    },
    [setValues]
  );

  const handleConnect = useCallback(() => {
    setStatus('proccess')

    fetch("http://localhost:1337/api/auth/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("userJwt")}`,
      },
      body: JSON.stringify({
        password: values.newPwd,
        currentPassword: values.oldPwd,
        passwordConfirmation: values.confirmPwd,
      }),
    }).then((res) => {
      if (res.status !== 200) {
        setStatus("error");
      } else {
        setStatus("success");
        setValues(defaultValues);
      }
    });
  }, [values]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Paper
        sx={{
          ...style,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: "300px",
        }}
      >
        <Typography sx={{ mb: "30px" }} variant="h6">
          Modifier le mot de passe
        </Typography>
        <TextField
          type="password"
          name="oldPwd"
          value={values?.oldPwd}
          onChange={handleChange}
          label="Ancien mot de passe"
          sx={{ width: "80%", mt: "20px" }}
        />
        <TextField
          type="password"
          name="newPwd"
          value={values?.newPwd}
          onChange={handleChange}
          label="Nouveau mot de passe"
          sx={{ width: "80%", mt: "20px" }}
        />
        <TextField
          type="password"
          name="confirmPwd"
          value={values?.confirmPwd}
          onChange={handleChange}
          label="Confirmer nouveau mot de passe"
          sx={{ width: "80%", mt: "20px" }}
        />
        {status === "success" ? (
          <Alert sx={{mt:'20px'}} severity="success">Mot de passe modifié</Alert>
        ) : status === "error" ? (
          <Alert sx={{mt:'20px'}} severity="error">Erreur lors de la modification</Alert>
        ) : (
          <></>
        )}
        <Button disabled={status === "proccess"} variant="contained" sx={{ mt: "20px" }} onClick={handleConnect}>
          Modifier
        </Button>
      </Paper>
    </Modal>
  );
};

export default ChangePasswordModal;
