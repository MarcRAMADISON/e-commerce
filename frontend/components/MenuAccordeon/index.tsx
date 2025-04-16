import * as React from "react";
import { Avatar, Box, Button, Divider, Paper, Typography } from "@mui/material";
import { useState } from "react";
import {
  KeyboardArrowDownTwoTone,
  KeyboardArrowUpTwoTone,
  PasswordRounded,
  DeleteForeverRounded,
  Menu,
} from "@mui/icons-material";
import { getLocalStorage, theme } from "../../utils/utils";
import { useRouter } from "next/router";
import { ListAltRounded } from "@mui/icons-material";
import ChangePasswordModal from "../ChangePasswordModal";
import DeleteAccountModal from "../DeleteAccountModal";

export default function MenuAccordeon() {
  const [isToggle, setIsToggle] = useState<boolean>(false);
  const [openDeleteModal,setOpenDeleteModal]= useState<boolean>(false);
  const [avatar, setAvatar] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [openPwdModal, setOpenPwdModal] = useState<boolean>(false);
  const router = useRouter();
  const ref = React.useRef(null);
  const buttonRef = React.useRef(null);

  React.useEffect(() => {
    if (document.addEventListener) {
      document.addEventListener("click", (event) => {
        if (buttonRef.current && !buttonRef.current.contains(event.target)) {
          setIsToggle(false);
        }
      });
    }

    return () => {
      document.removeEventListener("click", (event) => {
        if (buttonRef.current && !buttonRef.current.contains(event.target)) {
          setIsToggle(false);
        }
      });
    };
  }, [buttonRef, setIsToggle]);

  React.useEffect(() => {
    setAvatar(getLocalStorage("avatarUrl"));
    setUserName(getLocalStorage("username"));
  }, []);

  const toggleList = () => {
    setIsToggle((prev) => !prev);
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Button
        startIcon={<Menu />}
        sx={{
          display: "flex",
          alignItems: "center",
          marginRight: "20px",
          marginLeft: "10px",
          cursor: "pointer",
          width: "40px",
        }}
        onClick={toggleList}
        ref={buttonRef}
      />
      {isToggle && (
        <Paper
          elevation={2}
          ref={ref}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            backgroundColor: "#fff",
            position: "absolute",
            top: "50px",
            right: "10px",
            width: "250px",
            minHeight: "100px",
            padding: "10px",
            cursor: "pointer",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              width: "90%",
              m: "10px 0px 10px 20px",
              pb:'10px',
              borderBottom:`solid ${theme.palette.primary.main} 2px`
            }}
          >
            <Avatar alt="avatar icones" src={avatar} />
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ ml: "10px" }}
            >
              {userName}
            </Typography>
          </Box>

          <Button
            startIcon={<ListAltRounded />}
            sx={{ height: "50px", ml: "5px" }}
            variant="text"
            onClick={() => router.push("/commandes")}
          >
            Mes commandes
          </Button>
          <Button
            startIcon={<PasswordRounded />}
            sx={{ height: "50px", ml: "5px" }}
            variant="text"
            onClick={() => setOpenPwdModal(true)}
          >
            Modifier mot de passe
          </Button>
          <Button
            color="error"
            startIcon={<DeleteForeverRounded />}
            sx={{ height: "50px", ml: "5px" }}
            variant="text"
            onClick={() => setOpenDeleteModal(true)}
          >
            Supprimer le compte
          </Button>
          <Divider />
        </Paper>
      )}
      <DeleteAccountModal open={openDeleteModal} setOpen={setOpenDeleteModal} />
      <ChangePasswordModal open={openPwdModal} setOpen={setOpenPwdModal} />
    </Box>
  );
}
