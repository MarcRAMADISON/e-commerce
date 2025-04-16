import { useCallback, useEffect, useState } from "react";
import Layout from "../../components/layout";
import Box from "@mui/material/Box";
import { useRouter } from "next/router";
import { getLocalStorage, theme } from "../../utils/utils";
import { Button, Pagination, Typography, useMediaQuery } from "@mui/material";
import { articleObject } from "../../interfaces";
import ProductCard from "../../components/ProductCard";
import { ArrowBack } from "@mui/icons-material";

const IndexPage = () => {
  const [filtredArticle, setFiltredArticles] = useState<any>();
  const [refetch, setRefetch] = useState<boolean>(false);
  const [data, setData] = useState<any>();
  const [idUser, setIdUser] = useState<string>();
  const [userJwt, setUserJwt] = useState<string>();
  const isTablette = useMediaQuery("(max-width:1024px) and (min-width:621px)");
  const isMobile = useMediaQuery("(max-width:620px)");
  const [count, setCount] = useState<number>();
  const router = useRouter();

  useEffect(() => {
    setIdUser(getLocalStorage("userId"));
    setUserJwt(getLocalStorage("userJwt"));
  });

  useEffect(() => {
    if (router.query.type === "suggestions" && idUser && userJwt) {
      fetch(
        `http://localhost:3000/api/getSuggestion?idUser=${idUser}&start=0&limit=8`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userJwt}`,
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setData(data?.suggestions);
          setCount(data.length);
        });
    } else if (router.query.type === "promotions") {
      fetch(
        "http://localhost:1337/api/articles?populate=images&filters[reduction][$null]&pagination[start]=0&pagination[limit]=8",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          const pageCount = Math.ceil(
            data?.meta?.pagination?.total / data?.meta?.pagination?.limit
          );
          setCount(pageCount);
          const articles = data?.data.map((d) => ({
            ...d?.attributes,
            id: d?.id,
          }));
          setData(articles);
        });
    }
  }, [router.query.type, idUser, userJwt]);

  const handlePagination = useCallback(
    (event, page) => {
      event.preventDefault();

      if (router.query.type === "suggestions" && idUser && userJwt) {
        fetch(
          `http://localhost:3000/api/getSuggestion?idUser=${idUser}&start=${
            page * 8 - 8
          }&limit=8`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userJwt}`,
            },
          }
        )
          .then((res) => res.json())
          .then((data) => {
            setData(data?.suggestions);
          });
      } else if (router.query.type === "promotions") {
        fetch(
          `http://localhost:1337/api/articles?populate=images&filters[reduction][$null]&pagination[start]=${
            page * 8 - 8
          }&pagination[limit]=8`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then((res) => res.json())
          .then((data) => {
            const articles = data?.data.map((d) => ({
              ...d?.attributes,
              id: d?.id,
            }));
            setData(articles);
          });
      }
    },
    [router.query.type, idUser, userJwt]
  );

  const addBasket = useCallback(
    async (event: any, article: articleObject) => {
      event.preventDefault();

      if (idUser && userJwt) {
        return fetch("http://localhost:1337/api/paniers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userJwt}`,
          },
          body: JSON.stringify({
            data: {
              article: article.id,
              users_permissions_user: `${idUser}`,
            },
          }),
        }).then((res) => {
          setRefetch((prev) => !prev);
        });
      } else {
        router.push("/login");
      }
    },
    [idUser, userJwt, router, setRefetch]
  );

  return (
    <Layout
      setFiltredArticles={setFiltredArticles}
      refetch={refetch}
      setRefetch={setRefetch}
    >
      <Button
          variant="text"
          sx={{ position: "absolute", top: "90px", left:'10px' }}
          startIcon={<ArrowBack />}
          onClick={() => router.push("/")}
        >
          Acceuil
        </Button>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "98%",
            backgroundColor: theme.palette.secondary.main,
            height: "50px",
            color: "#f0f0f0",
            paddingLeft: "20px",
            marginTop: "130px",
          }}
        >
          <Typography>{router.query.type === 'suggestions'? 'Suggestions' : 'Promotions'}</Typography>
        </Box>
      <Box
        style={{
          display: "grid",
          gridTemplateColumns: isTablette
            ? "repeat(2,1fr)"
            : isMobile
            ? "repeat(1,1fr)"
            : "repeat(4,1fr)",
          rowGap: "15px",
          marginBottom: "50px",
          marginTop: "30px",
          width: "85%",
        }}
      >

        {(data || []).map((article, index) => {
          return (
            <ProductCard key={index} addBasket={addBasket} item={article} />
          );
        })}
      </Box>
      <Pagination count={count} color="primary" onChange={handlePagination} />
    </Layout>
  );
};


export default IndexPage;
