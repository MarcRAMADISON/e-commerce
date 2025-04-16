import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { buttonStyle, paperStyle } from "./style";
import { useRouter } from "next/router";
import MenuAccordeon from "../MenuAccordeon";
import { Logout, Login } from "@mui/icons-material";
import { SearchRounded,Category } from "@mui/icons-material";
import { getLocalStorage, theme } from "../../utils/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import Panier from "../Panier";
import Image from "next/image";

const MenuBar = (props: any) => {
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  const [isToggle, setIsToggle] = useState<boolean>(false);
  const isTablette = useMediaQuery("(max-width:1024px) and (min-width:481px)");
  const isMobile = useMediaQuery("(max-width:620px)");
  const [idUser, setIdUser] = useState<string>();
  const [userJwt, setUserJwt] = useState<string>();
  const ref = useRef(null);
  const refList=useRef(null);

  useEffect(() => {
    if (document.addEventListener) {
      document.addEventListener("click", (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setIsToggle(false);
        }
      });
    }

    return () => {
      document.removeEventListener("click", (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setIsToggle(false);
        }
      });
    };
  }, [ref, setIsToggle]);

  useEffect(() => {
    setIdUser(getLocalStorage("userId"));
    setUserJwt(getLocalStorage("userJwt"));
  });

  const toggleList = useCallback(
    (event) => {
      event.preventDefault();
      setIsToggle((prev) => !prev);
    },
    [setIsToggle]
  );

  const handleLogOut = useCallback((event: any) => {
    event.preventDefault();

    localStorage.clear();
    router.push("/login");
  }, []);

  const searchItem = useCallback(
    (event: any) => {
      event.preventDefault();
      if (search && search !== "") {
        fetch(
          `http://localhost:1337/api/articles?populate=images&filters[name][$containsi]=${search}&filters[description][$containsi]=${search}&pagination[start]=0&pagination[limit]=6`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then((res) => res.json())
          .then((data) => {
            props.setFiltredArticles({
              articles: {
                data: data?.data,
                type:'search'
              },
            });
          });
      } else {
        fetch(
          `http://localhost:1337/api/articles?populate=images&filters[reduction][$notNull]&pagination[start]=0&pagination[limit]=6`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then((res) => res.json())
          .then((data) => {
            props.setFiltredArticles({
              articles: {
                data: data?.data,
                type:'search'
              },
            });
          });
      }
    },
    [search]
  );

  const getData = useCallback((event, categorie) => {
    event.preventDefault();

    fetch(
      `http://localhost:1337/api/categories?populate[0]=articles&populate[1]=articles.images&filters[id][$eq]=${categorie?.id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        props.setFiltredArticles({
          idCategorie: data.data[0].id,
          nameCategorie: data.data[0].attributes.name,
          totalArticles: data.data[0].attributes.articles,
          articles: data.data[0].attributes.articles,
          total: data.data[0].attributes.articles?.data?.length,
          limit: 6,
          type:'categorie'
        });
      });
  }, []);

  const ListGroup = useCallback(
    ({ categories }) => {
      const position =
        isTablette || isMobile
          ? { bottom: "80px", left: "0" }
          : { top: "60px", right: "0" };

      return (
        <Box
          ref={refList}
          sx={{
            position: "absolute",
            padding: "10px",
            width: "100%",
            ...position,
            zIndex: "1000",
            color: theme.palette.secondary.contrastText,
            backgroundColor: theme.palette.secondary.main,
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                isMobile ? "repeat(2,1fr)" : isTablette? "repeat(3,1fr)" : "repeat(6,1fr)",
              gap: isTablette || isMobile? "10px" : "40px",
            }}
          >
            {(categories || []).map((categorie, index) => {
              const url = categorie?.attributes?.icon?.data?.attributes?.formats
              ? categorie?.attributes?.icon?.data?.attributes?.formats?.thumbnail?.url
              : categorie?.attributes?.icon?.data?.attributes?.url;

              return (
                <Box
                  key={index}
                  sx={{
                    display:'flex',
                    justifyContent:'center',
                    alignItems:'center',
                    color: "#f0f0f0",
                    cursor: "pointer",
                    width:'100%'
                  }}
                  onClick={(event) => getData(event, categorie)}
                >
                  {url && <Image src={`http://localhost:1337${url}`} alt='categories icon' width={40} height={40}/>}
                  <Typography sx={{ml:'15px',color:'#0f0f0f'}} variant="body1">
                    {categorie?.attributes?.name}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      );
    },
    [isTablette, isMobile]
  );

  return (
    <Box>
      <Paper elevation={1} sx={paperStyle}>
        {props?.categories && (
          <>
            <TextField
              id="search-bar"
              className="text"
              label="Chercher un article"
              variant="outlined"
              placeholder="rechercher..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              size="small"
              sx={{ minWidth: "200px" }}
            />
            <IconButton onClick={searchItem} aria-label="search">
              <SearchRounded style={{ fill: theme.palette.primary.main }} />
            </IconButton>
          </>
        )}
        {isTablette || isMobile ? (
          <></>
        ) : (
          <Box sx={{ display: "flex" }}>
            {idUser && userJwt ? (
              <Panier refetch={props?.refetch} setRefetch={props?.setRefetch} />
            ) : (
              <></>
            )}
            {props?.categories && (
              <Button
                variant="text"
                size="medium"
                sx={buttonStyle}
                onClick={toggleList}
                ref={ref}
                color='secondary'
                startIcon={<Category/>}
              >
                Catégories
              </Button>
            )}
            {isToggle ? <ListGroup categories={props?.categories} /> : <></>}
            {props?.userData?.userId && props?.userData?.jwt ? (
              <Button
                startIcon={<Logout />}
                variant="outlined"
                color="primary"
                sx={buttonStyle}
                onClick={handleLogOut}
                size='medium'
              >
                Se déconnecter
              </Button>
            ) : (
              <>
                <Button
                  variant="text"
                  size="medium"
                  sx={buttonStyle}
                  onClick={() => router.push("/register")}
                >
                  Créer un compte
                </Button>
                <Button
                  startIcon={<Login />}
                  variant="contained"
                  size="medium"
                  color="primary"
                  sx={buttonStyle}
                  onClick={() => router.push("/login")}
                >
                  Se connecter
                </Button>
              </>
            )}
          </Box>
        )}

        <MenuAccordeon />
      </Paper>
      {isTablette || isMobile ? (
        <Paper
          elevation={3}
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: "10px",
            padding: "10px",
            width: "100%",
            height: "60px",
            position: "fixed",
            left: "0px",
            bottom: "0",
            zIndex: "99",
          }}
        >
          {idUser && userJwt ? (
            <Panier refetch={props?.refetch} setRefetch={props?.setRefetch} />
          ) : (
            <></>
          )}
          <Button
            ref={ref}
            variant="outlined"
            size="small"
            onClick={toggleList}
            color='secondary'
            startIcon={<Category/>}
          >
            Catégories
          </Button>
          {isToggle ? <ListGroup categories={props?.categories} /> : <></>}
          {props?.userData?.userId && props?.userData?.jwt ? (
            <Button
              startIcon={<Logout />}
              variant="outlined"
              color="primary"
              onClick={handleLogOut}
              size="small"
            >
              Se déconnecter
            </Button>
          ) : (
            <>
              <Button
                variant="outlined"
                size="small"
                onClick={() => router.push("/register")}
              >
                Créer un compte
              </Button>
              <Button
                startIcon={<Login />}
                variant="outlined"
                size="small"
                color="primary"
                onClick={() => router.push("/login")}
              >
                Se connecter
              </Button>
            </>
          )}
        </Paper>
      ) : (
        <></>
      )}
    </Box>
  );
};

export default MenuBar;
