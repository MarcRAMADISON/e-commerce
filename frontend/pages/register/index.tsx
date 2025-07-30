import { useState } from "react";
import { setLocalStorage, theme } from "../../utils/utils";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import Layout from "../../components/layout";
import { Alert, Box, Button, Paper, TextField, Typography } from "@mui/material";

interface formObject {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
  avatar: string;
}

const defaultValues = {
  email: "",
  name: "",
  password: "",
  confirmPassword: "",
  avatar: "",
};

const IndexPage = ({ avatars }) => {
  const [values, setValues] = useState<formObject>(defaultValues);
  const [error,setError]=useState<boolean>(false)
  const router = useRouter();

  const handleChange = (event: any) => {
    event.preventDefault();
    setValues((prev: formObject) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const registerUser = (event: any) => {
    event.preventDefault();
    event.stopPropagation();

    const data = {
      username: values.name,
      email: values.email,
      password: values.password,
      avatar: values.avatar,
    };

    window
      .fetch("http://localhost:1337/api/auth/local/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data }),
      })
      .then(async (res) => {
        if (res.status === 200) {
          const userData = await res.json();
          localStorage.clear();
          setLocalStorage("userJwt", userData.jwt);
          setLocalStorage("username", userData.user.username);
          setLocalStorage("userEmail", userData.user.email);
          setLocalStorage("userId", userData.user.id);

          fetch(
            `http://localhost:1337/api/users/${userData.user.id}?populate=avatar.avatarImage`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
            .then((res) => res.json())
            .then((result) => {
              const url = result?.avatar?.avatarImage?.formats
                ? result?.avatar?.avatarImage?.formats?.thumbnail?.url
                : result?.avatar?.avatarImage?.url;

              setLocalStorage("avatarUrl", `http://localhost:1337${url}`);
            });

          router.push("/preference");
        }else{
          setError(true);
        }
      });
  };

  const handleClickAvatar = (event:any, id:any) => {
    event.preventDefault();
    setValues((prev) => ({ ...prev, avatar: id }));
  };

  return (
    <Layout showMenuBar={false}>
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "30px",
          mt: "20px",
        }}
      >
        <Typography variant="h6">Créer un compte</Typography>
        {error && <Alert sx={{mt:'20px'}} variant='outlined' severity="error">Invalide email ou mot de passe </Alert>}
        <TextField
          label="Nom d'utilisateur"
          sx={{ minWidth: "300px", mt: "20px" }}
          type="text"
          name="name"
          value={values?.name}
          onChange={handleChange}
        />
        <TextField
          label="adresse e-mail"
          sx={{ minWidth: "300px", mt: "20px" }}
          type="email"
          name="email"
          value={values?.email}
          onChange={handleChange}
        />
        <TextField
          label="Mot de passe"
          sx={{ minWidth: "300px", mt: "20px" }}
          type="password"
          name="password"
          value={values?.password}
          onChange={handleChange}
        />
        <TextField
          label="Confirmer mot de passe"
          sx={{ minWidth: "300px", mt: "20px" }}
          type="password"
          name="confirmPassword"
          value={values?.confirmPassword}
          onChange={handleChange}
        />
        <Typography sx={{ mt: "30px" }} variant="body1" color="secondary.text">
          Choisissez un avatar
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            mt: "20px",
            width: "100%",
          }}
        >
          {avatars.map((avatar:any,index:any) => {
            const url = avatar?.avatarUrl?.formats
              ? avatar?.avatarUrl?.formats?.thumbnail?.url
              : avatar?.avatarUrl?.url;
            const fullUrl = `http://localhost:1337${url}`;

            return (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor:
                    values.avatar === avatar.id
                      ? theme.palette.primary.main
                      : "none",
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                }}
                onClick={(event) => handleClickAvatar(event, avatar.id)}
              >
                <Image
                  style={{ cursor: "pointer" }}
                  width={50}
                  height={50}
                  alt="avatar"
                  src={fullUrl}
                />
              </Box>
            );
          })}
        </Box>
        <Button
          disabled={
            !!!values.email ||
            !!!values.confirmPassword ||
            !!!values.password ||
            values.confirmPassword !== values.password ||
            !!!values.name || !!! values.avatar
          }
          sx={{ minWidth: "300px", mt: "50px" }}
          variant="contained"
          onClick={registerUser}
        >
          Enregistrer
        </Button>
        <Link
          style={{ marginTop: "20px", color: theme.palette.primary.main }}
          href="/login"
        >
          Se connecter
        </Link>
      </Paper>
    </Layout>
  );
};

export const getServerSideProps = async () => {
  const result = await fetch(
    "http://localhost:1337/api/avatars?populate=avatarImage"
  );
  const data = await result.json();


  return {
    props: {
      avatars: (data?.data || []).map((d) => ({
        id: d.id,
        avatarUrl: d?.attributes?.avatarImage?.data?.attributes,
      })),
    },
  };
};

export default IndexPage;
