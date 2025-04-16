import { useCallback, useEffect, useMemo, useState } from "react";
import Layout from "../components/layout";
import { useRouter } from "next/router";
import { getLocalStorage, theme } from "../utils/utils";
import { articleObject } from "../interfaces";
import CustomCarousel from "../components/CustomCarousel";
import { Box, Pagination, Typography, useMediaQuery } from "@mui/material";
import ProductCard from "../components/ProductCard";

const IndexPage = ({
  categories,
  promotionsData,
  dataArticles,
  pageArticlesCount,
  affiches,
}: any) => {
  const [articles, setArticles] = useState<articleObject[] | []>([]);
  const [idUser, setIdUser] = useState<string>();
  const [userJwt, setUserJwt] = useState<string>();
  const [refetch, setRefetch] = useState<boolean>(false);
  const isTablette = useMediaQuery("(max-width:1024px) and (min-width:621px)");
  const isMobile = useMediaQuery("(max-width:620px)");
  const [filtredArticle, setFiltredArticles] = useState<any>();
  const [suggestions, setSuggestions] = useState<any>();
  const route = useRouter();

  useEffect(() => {
    setArticles([]);
    setIdUser(getLocalStorage("userId"));
    setUserJwt(getLocalStorage("userJwt"));
    (promotionsData || []).map((data: any) => {
      setArticles((prev) => {
        return [...prev, { id: data?.id, ...data?.attributes }];
      });
    });
  }, [promotionsData]);

  useEffect(() => {
    if (idUser && userJwt) {
      fetch(`http://localhost:3000/api/getSuggestion?idUser=${idUser}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userJwt}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setSuggestions(data?.suggestions);
        });
    }
  }, [idUser, userJwt]);

  const data = useMemo(() => {
    return filtredArticle &&
      filtredArticle?.articles?.data?.length > 6 &&
      filtredArticle?.total
      ? filtredArticle?.articles?.data?.slice(0, 6)
      : filtredArticle
      ? filtredArticle?.articles?.data
      : dataArticles;
  }, [filtredArticle?.articles?.data, filtredArticle?.total, dataArticles]);

  const handlePagination = useCallback(
    (event, page) => {
      event.preventDefault();
      if (
        filtredArticle &&
        filtredArticle?.total &&
        filtredArticle?.articles?.data
      ) {
        const start = page * 6 - 6;
        const end = start + 6;

        setFiltredArticles((prev) => ({
          idCategorie: prev.idCategorie,
          nameCategorie: prev.nameCategorie,
          totalArticles: { data: prev?.totalArticles?.data },
          articles: {
            data: prev?.totalArticles?.data?.slice(start, end),
          },
          total: prev?.total,
          limit: prev?.limit,
          type: "categorie",
        }));
      } else {
        fetch(
          `http://localhost:1337/api/articles?populate=images&filters[reduction][$notNull]&pagination[start]=${
            (page - 1) * 6
          }&pagination[limit]=6`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then((res) => res.json())
          .then((res) => {
            setFiltredArticles({ articles: { data: res?.data } });
          });
      }
    },
    [data]
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
        route.push("/login");
      }
    },
    [idUser, userJwt, route, setRefetch]
  );

  console.log(
    "count",
    filtredArticle,
    Math.ceil(filtredArticle?.total / filtredArticle?.limit),
    Math.ceil(filtredArticle?.articles?.data?.length / filtredArticle?.limit),
    pageArticlesCount,
    Math.ceil(filtredArticle?.articles?.data?.length / 6),
    filtredArticle &&
      (filtredArticle?.total || filtredArticle?.type === "categorie")
      ? Math.ceil(filtredArticle?.total / filtredArticle?.limit)
      : filtredArticle && filtredArticle?.articles?.type === "search"
      ? Math.ceil(filtredArticle?.articles?.data?.length / 6)
      : pageArticlesCount
  );

  return (
    <Layout
      categories={categories}
      setFiltredArticles={setFiltredArticles}
      refetch={refetch}
      setRefetch={setRefetch}
    >
      {affiches?.length && (
        <CustomCarousel
          isMultiple={false}
          isAffiche={true}
          addBasket={addBasket}
          deviceType={isMobile ? "mobile" : "web"}
          items={affiches}
        />
      )}
      <Box
        style={{
          width: isMobile || isTablette ? "70%" : "90%",
          position: "relative",
        }}
      >
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {filtredArticle?.nameCategorie ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "98%",
                backgroundColor: theme.palette.secondary.main,
                height: "50px",
                color: "#f0f0f0",
                paddingLeft: "20px",
                margin: "50px 0px -60px 0px",
              }}
            >
              <Typography>{filtredArticle?.nameCategorie}</Typography>
            </Box>
          ) : (
            <></>
          )}
          {data.length ? (
            <>
              <Box
                style={{
                  display: "grid",
                  gridTemplateColumns: isTablette
                    ? "repeat(2,1fr)"
                    : isMobile
                    ? "repeat(1,1fr)"
                    : "repeat(3,1fr)",
                  rowGap: "10%",
                  marginBottom: isMobile ? "130px" : "50px",
                  marginTop: "100px",
                  width: isMobile || isTablette ? "85%" : "75%",
                }}
              >
                {(data || []).map((article, index) => {
                  const item = { ...article.attributes, id: article.id };
                  return (
                    <ProductCard
                      key={index}
                      addBasket={addBasket}
                      item={item}
                      type='rowCard'
                    />
                  );
                })}
              </Box>
              <Pagination
                count={
                  (Math.ceil(filtredArticle?.articles?.data?.length / 6),
                  filtredArticle &&
                  (filtredArticle?.total ||
                    filtredArticle?.type === "categorie")
                    ? Math.ceil(filtredArticle?.total / filtredArticle?.limit)
                    : filtredArticle &&
                      filtredArticle?.articles?.type === "search"
                    ? Math.ceil(filtredArticle?.articles?.data?.length / 6)
                    : pageArticlesCount)
                }
                color="primary"
                onChange={handlePagination}
              />
            </>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                margin: "100px 0px 50px 0px",
              }}
            >
              <Typography
                variant="h6"
                color="secondary"
              >
                Aucune article trouvée pour cette recherche
              </Typography>
            </Box>
          )}
        </Box>

        {suggestions && (
          <CustomCarousel
            isMultiple={true}
            title="Suggestions"
            addBasket={addBasket}
            deviceType={isMobile ? "mobile" : isTablette ? "tablette" : "web"}
            items={suggestions}
            type="suggestions"
          />
        )}

        <CustomCarousel
          isMultiple={true}
          title="Promotions en ce moment"
          addBasket={addBasket}
          deviceType={isMobile ? "mobile" : "web"}
          items={articles}
          type="promotions"
        />
      </Box>
    </Layout>
  );
};

export async function getServerSideProps() {
  const [data, result, result2, result3] = await Promise.all([
    await fetch("http://localhost:1337/api/categories?populate=icon", {
      headers: {
        "Content-Type": "application/json",
      },
    }),
    await fetch(
      "http://localhost:1337/api/articles?populate=images&filters[reduction][$null]&pagination[start]=0&pagination[limit]=6",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    ),
    await fetch(
      "http://localhost:1337/api/articles?populate=images&filters[reduction][$notNull]&pagination[start]=0&pagination[limit]=6",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    ),
    await fetch(
      "http://localhost:1337/api/affiches?populate[0]=affiche_image&populate[1]=article.images",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    ),
  ]);

  const dataArticles = await result2.json();
  const dataArticlesProm = await result.json();
  const categories = await data.json();
  const affiches = await result3.json();

  return {
    props: {
      categories: categories?.data,
      promotionsData: dataArticlesProm?.data,
      dataArticles: dataArticles?.data,
      affiches: (affiches?.data || []).map((affiche) => ({
        imageLarge:
          affiche?.attributes?.affiche_image?.data?.attributes?.formats?.large || null,
        imageMedium:
          affiche?.attributes?.affiche_image?.data?.attributes?.formats?.medium || null,
        imageSmall:
          affiche?.attributes?.affiche_image?.data?.attributes?.formats?.small || null,
        article: affiche?.attributes?.article?.data,
      })),
      pageArticlesCount: Math.ceil(
        dataArticles?.meta?.pagination?.total /
          dataArticles?.meta?.pagination?.limit
      ),
    },
  };
}

export default IndexPage;
