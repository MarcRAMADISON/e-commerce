import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/layout";
import { Box, Button, Paper, Typography, useMediaQuery } from "@mui/material";
import { RemoveCircle } from "@mui/icons-material";
import { getLocalStorage, setLocalStorage } from "../../utils/utils";
import Image from "next/image";

interface prefObject {
  id: number;
  attributes: {
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    categorie: {
      data: {
        id: number;
        attributes: {
          name: string;
          createdAt: string;
          updatedAt: string;
          publishedAt: string;
        };
      };
    };
  };
}

const IndexPage = ({ categories }: any) => {
  const [idUser, setIdUser] = useState<string>();
  const [userJwt, setUserJwt] = useState<string>();
  const [userName, setUserName] = useState<string>();
  const [count, setCount] = useState<number>(0);
  const [clickedPref, setClickedPref] = useState<number[]>([]);
  const [userPref, setUserPref] = useState<prefObject[]>([]);
  const isTablette = useMediaQuery("(max-width:1024px) and (min-width:621px)");
  const isMobile = useMediaQuery("(max-width:620px)");

  const route = useRouter();

  useEffect(() => {
    setIdUser(localStorage.getItem("userId"));
    setUserJwt(localStorage.getItem("userJwt"));
    setUserName(localStorage.getItem("username"));

    if (localStorage.getItem("userId")) {
      fetch(
        `http://localhost:1337/api/preferences?populate=categorie&filters[users_permissions_user][$eq]=${localStorage.getItem(
          "userId"
        )}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("userJwt")}`,
          },
        }
      )
        .then((res) => res.json())
        .then((result) => setUserPref(result?.data));
    }
  }, []);

  const handleChoosePref = (event: any, idCategorie: number) => {
    event.preventDefault();

    setCount((prev) => prev + 1);

    setClickedPref((prev) => [...prev, idCategorie]);

    fetch("http://localhost:1337/api/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("userJwt")}`,
      },
      body: JSON.stringify({
        data: {
          categorie: `${idCategorie}`,
          users_permissions_user: `${idUser}`,
        },
      }),
    });
  };

  const deletePreferences = () => {
    fetch(
      `http://localhost:1337/api/preferences?populate=categorie&filters[users_permissions_user][$eq]=${localStorage.getItem(
        "userId"
      )}`,
      {
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${localStorage.getItem("userJwt")}`,
        },
      }
    )
      .then((res) => res.json())
      .then((result) => {
        if (result?.data?.length) {
          fetch(`http://localhost:3000/api/deleteAllPref`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userPref: result?.data,
              userToken: localStorage.getItem("userJwt"),
            }),
          }).then((res) => {
            if (res.status === 200) {
              setClickedPref([]);
              setUserPref([]);
              setCount(0);
            }
          });
        }
      });
  };

  const handleNext = () => {
    route.push("/");
  };

  return idUser && userJwt ? (
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
        <Image
          src={getLocalStorage("avatarUrl")}
          alt="avatar"
          height={100}
          width={100}
        />
        <Typography variant="h6">Bienvenue {userName}</Typography>
        <Typography sx={{ mt: "10px" }} variant="body2">
          Choisir 5 préferences pour qu'on puisse vous offrir une meilleur
          expérience utilisateur
        </Typography>
        <Box
          sx={{
            display: "grid",
            mt: "30px",
            gridTemplateColumns: isMobile?"repeat(1,1fr)": "repeat(4,1fr)",
            gap: "10px",
          }}
        >
          {(categories || []).map((categorie: any, index: number) => {
            return (
              <Button
                variant="outlined"
                color="secondary"
                key={index}
                disabled={
                  clickedPref.includes(categorie.id) ||
                  !!(userPref || []).find(
                    (pref) => pref.attributes.categorie.data.id === categorie.id
                  )
                }
                onClick={(event) => handleChoosePref(event, categorie.id)}
              >
                {categorie.attributes.name}
              </Button>
            );
          })}
        </Box>
        <Box sx={{ display: "flex",justifyContent:'center',flexWrap:'wrap', mt: "30px" }}>
          <Button
            startIcon={<RemoveCircle />}
            disabled={count === 0}
            color="error"
            sx={{ minWidth: "300px" }}
            size="small"
            variant="contained"
            onClick={deletePreferences}
          >
            Effacer les preferences
          </Button>
          <Button
            sx={{ minWidth: "300px", ml: "10px", mt: isMobile? '20px' : '0px' }}
            variant="contained"
            size="small"
            onClick={handleNext}
            disabled={count < 5}
          >
            suivant
          </Button>
        </Box>
      </Paper>
    </Layout>
  ) : (
    <Box></Box>
  );
};

export async function getServerSideProps() {
  const data = await fetch("http://localhost:1337/api/categories", {
    headers: {
      "Content-Type": "application/json",
    },
  });


  const categories = await data.json();

  console.log('categorie',categories)


  return { props: { categories: categories?.data } };
}

export default IndexPage;
