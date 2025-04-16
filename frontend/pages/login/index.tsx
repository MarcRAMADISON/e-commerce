//This is a loggin page

import { useState } from "react";
import { setLocalStorage, theme } from "../../utils/utils";
import { useRouter } from "next/router";
import Link from "next/link";
import { Alert, Button, Paper, TextField, Typography } from "@mui/material";
import Layout from "../../components/layout";
import { Home } from "@mui/icons-material";

interface formObject {
  email: string;
  name: string;
  password: string;
}

const defaultValues = {
  email: "",
  name: "",
  password: "",
};

const IndexPage = () => {
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

  const handleConnect = (event: any) => {
    event.preventDefault();
    event.stopPropagation();

    const data = {
      identifier: values.email,
      password: values.password,
    };

    window
      .fetch("http://localhost:1337/api/auth/local", {
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

          router.push("/");
        } else {
          setError(true);
        }
      });
  };

  return (
    <Layout showMenuBar={false}>
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "30px",
          mt: "50px",
        }}
      >
        <Button
          startIcon={<Home />}
          sx={{ minWidth: "300px", mt: "-10px",mb:'30px' }}
          variant="text"
          color="primary"
          onClick={() => router.push("/")}
        >
          Acceuil
        </Button>
        <Typography variant="h6">Connectez-vous</Typography>
        {error && <Alert sx={{mt:'20px'}} variant='outlined' severity="error">Invalide email ou mot de passe </Alert>}
        <TextField
          sx={{ minWidth: "300px", mt: "30px" }}
          label="Adresse e-mail"
          type="email"
          name="email"
          value={values?.email}
          onChange={handleChange}
        />
        <TextField
          sx={{ minWidth: "300px", mt: "20px" }}
          label="Mot de passe"
          type="password"
          name="password"
          value={values?.password}
          onChange={handleChange}
        />
        <Button
          sx={{ minWidth: "300px", mt: "20px" }}
          variant="contained"
          onClick={handleConnect}
          disabled={values.email === ''|| values.password === ''}
        >
          Se connecter
        </Button>
        <Typography variant="body2" sx={{ mt: "30px" }}>
          Vous n'avez pas encore de compte?
        </Typography>
        <Typography variant="body2">
          Créer un compte gratuitement en quelques seconde.
        </Typography>
        <Button
          sx={{ minWidth: "300px", mt: "10px" }}
          color="secondary"
          variant="contained"
          onClick={() => router.push("/register")}
        >
          Créer un compte
        </Button>
        <Link
          style={{ marginTop: "20px", color: theme.palette.primary.main }}
          href="/forgotPwd"
        >
          Mot de passe oubliée
        </Link>
      </Paper>
    </Layout>
  );
};

export default IndexPage;
