import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { getLocalStorage, theme } from "../../utils/utils";
import CustomCarousel from "../../components/CustomCarousel";
import {
  Alert,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Rating,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Layout from "../../components/layout";
import {
  AddShoppingCartRounded,
  ArrowBackRounded,
  PaymentRounded,
} from "@mui/icons-material";
import { articleObject } from "../../interfaces";
import CustomModal from "../../components/modal/modal";
import ShareSocialMedia from "../../components/ShareSocialMedia";

interface valueObject {
  comment: string;
  note: number;
}

const defaultValues = {
  comment: "",
  note: 0,
};

interface modifStatus {
  panier: boolean;
  rate: boolean;
}

const IndexPage = () => {
  const router = useRouter();
  const [article, setArticle] = useState<any>({});
  const [values, setValues] = useState<valueObject>(defaultValues);
  const [comments, setComments] = useState<any>([]);
  const [note, setNote] = useState<number>(0);
  const [refetch, setRefetch] = useState<boolean>(false);
  const [alreadyNoted, setAlreadyNoted] = useState<boolean>(false);
  const [idUser, setIdUser] = useState<string>();
  const [userJwt, setUserJwt] = useState<string>();
  const [alert, setAlert] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [nombre, setNombre] = useState<number>();
  const [avis, setAvis] = useState<number>();
  const [checkModif, setCheckModif] = useState<modifStatus>({
    panier: false,
    rate: false,
  });
  const isTablette = useMediaQuery("(max-width:1024px) and (min-width:481px)");
  const isMobile = useMediaQuery("(max-width:500px)");
  const route = useRouter();

  useEffect(() => {
    setIdUser(getLocalStorage("userId"));
    setUserJwt(getLocalStorage("userJwt"));
  }, []);

  useEffect(() => {
    (async () => {
      if (router.query.id) {
        await Promise.all([
          fetch(
            `http://localhost:1337/api/articles/${router.query.id}?populate=images`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
            .then((data) => data.json())
            .then((data) => {
              if (data.data) {
                setArticle(data.data);
              }
            }),
          fetch(
            `http://localhost:3000/api/getNote?idArticle=${router.query.id}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
            .then((data) => data.json())
            .then((data) => {
              setNote(data?.note?.toFixed(1));
              setAvis(data?.nombre);
            }),
          fetch(
            `http://localhost:3000/api/checkNote?idArticle=${
              router.query.id
            }&idUser=${getLocalStorage("userId")}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
            .then((data) => data.json())
            .then((data) => {
              setAlreadyNoted(data?.status);
            }),
          fetch(
            `http://localhost:1337/api/comments?populate=users_permissions_user&filters[article][$eq]=${route.query.id}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
            .then((res) => res.json())
            .then((res) => setComments(res.data)),
        ]);
      }
    })();
  }, [refetch, router.query.id]);

  const handleComment = useCallback(() => {
    fetch("http://localhost:1337/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("userJwt")}`,
      },
      body: JSON.stringify({
        data: {
          commentaire: values.comment,
          article: router.query.id,
          users_permissions_user: localStorage.getItem("userId"),
        },
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setValues(defaultValues);
        setRefetch((prev) => !prev);
      });
  }, [values, router?.query?.id]);

  const handleChange = useCallback((event: any) => {
    event.preventDefault();
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }, []);

  const handleNote = useCallback(
    (event: any) => {
      event.preventDefault();
      if (!alreadyNoted) {
        fetch("http://localhost:1337/api/notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("userJwt")}`,
          },
          body: JSON.stringify({
            data: {
              note: event.target.value,
              article: router.query.id,
              users_permissions_user: getLocalStorage("userId"),
            },
          }),
        }).then(() => {
          setAlreadyNoted(true);
          setValues((prev) => ({ ...prev, note: event?.target?.value }));
        });
      }
    },
    [router?.query?.id,alreadyNoted]
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
          setAlert(true);
          setCheckModif((prev) => ({ ...prev, panier: true }));
        });
      }
    },
    [idUser, userJwt]
  );

  return (
    <Layout showMenuBar={false}>
      <Paper
        sx={{
          margin: "30px 50px",
          width: isTablette || isMobile ? "100%" : "85%",
          padding: "50px 10px",
          display: "grid",
          gridTemplateColumns:
            isTablette || isMobile ? "repeat(1,1fr)" : "repeat(2,1fr)",
        }}
      >
        <Button
          sx={{ position: "absolute", top: "50px" }}
          startIcon={<ArrowBackRounded />}
          size="large"
          onClick={() => router.push("/")}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CustomCarousel
            isMultiple={false}
            images={article?.attributes?.images?.data}
          />
          <Box
            sx={{ display: "flex", alignItems: "center", marginTop: "30px" }}
          >
            <Rating
              name="simple-controlled"
              size="large"
              value={
                values.note
                  ? parseFloat(`${values.note}`)
                  : parseFloat(`${note}`)
              }
              onChange={handleNote}
            />
            <Typography sx={{ marginLeft: "15px" }} color="text.secondary">
              {values.note || note} /5
            </Typography>
            <Typography
              sx={{ marginLeft: "15px" }}
              variant="body2"
              color="text.secondary"
            >
              ({avis || 0} avis)
            </Typography>
          </Box>
          <ShareSocialMedia url={`http://localhost:3000${route.asPath}`} />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: isMobile || isTablette ? "center" : "flex-start",
            justifyContent: "center",
            width: "100%",
            ml: isMobile || isTablette ? "0px" : "5%",
          }}
        >
          <Typography variant="h2" color="secondary">
            {article?.attributes?.name}
          </Typography>
          <Box
            sx={{
              display: "flex",
              margin: "10px 0px 30px 0px",
              width: "50%",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            {article?.attributes?.available ? (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    backgroundColor: "green",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                  }}
                ></Box>
                <Typography
                  sx={{ marginLeft: "10px" }}
                  variant="body1"
                  color="text.secondary"
                >
                  Disponible
                </Typography>
              </Box>
            ) : (
              <Box display="flex" alignItems="center">
                <Box
                  sx={{
                    backgroundColor: "red",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                  }}
                ></Box>
                <Typography
                  sx={{ marginLeft: "10px" }}
                  variant="body1"
                  color="text.secondary"
                >
                  Disponible
                </Typography>
              </Box>
            )}

            <Typography
              sx={{ ml: "20px" }}
              variant="body1"
              color="text.secondary"
            >
              Nombre en stock: {article?.attributes?.nombre}
            </Typography>
          </Box>
          <Typography
            sx={{ mb: "30px" }}
            variant="body1"
            color="text.secondary"
          >
            {article?.attributes?.description}
          </Typography>
          <Typography
            sx={{ mb: article?.attributes?.reduction? '10px' : "30px",color:theme.palette.secondary.main }}
            variant="body1"
            color="text.secondary"
          >
            Prix unitaire: {article?.attributes?.reduction? (article?.attributes?.price - (article?.attributes?.price * article?.attributes?.reduction) / 100).toFixed(2) : article?.attributes?.price}
          </Typography>
          {article?.attributes?.reduction && <Typography sx={{mb:'20px',color:theme.palette.secondary.main}} variant="body2" color="text.secondary">
                Au lieu de : {article?.attributes?.price || 0}
          </Typography>}

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: isMobile || isTablette ? "center" : "flex-start",
            }}
          >
            {alert && (
              <Alert sx={{ mb: "10px" }}>Article ajoutée au pannier</Alert>
            )}
            <Button
              sx={{
                placeSelf: "left",
                mb: "30px",
              }}
              startIcon={<AddShoppingCartRounded />}
              variant="contained"
              color="primary"
              size="medium"
              onClick={(event) => addBasket(event, article)}
              disabled={checkModif?.panier}
            >
              Ajouter au pannier
            </Button>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent:
                  isMobile || isTablette ? "center" : "flex-start",
                width: "100%",
              }}
            >
              <TextField
                type="number"
                id="filled-basic"
                value={nombre}
                label="Nombre"
                variant="filled"
                size="small"
                onChange={(event) => setNombre(parseInt(event.target.value))}
              />
              <Typography sx={{ ml: "30px" }} variant="body1" color="primary">
                {isNaN(nombre) ? 0 : nombre * article?.attributes?.price}
              </Typography>
            </Box>
            <Button
              disabled={isNaN(nombre) || nombre <= 0}
              sx={{
                placeSelf: isTablette || isMobile ? "center" : "right",
                mb: "30px",
                mt: "10px",
              }}
              startIcon={<PaymentRounded />}
              variant="contained"
              color="primary"
              size="medium"
              onClick={(event) => setOpenModal(true)}
            >
              Payer
            </Button>
            <Typography
              sx={{ placeSelf: "left", width: "100%" }}
              variant="h6"
              color="secondary"
            >
              Commentaires:
            </Typography>
            <List sx={{ textAlign: "right", width: "90%" }}>
              {(comments || []).map((comment: any, key: number) => {
                return (
                  <Box key={key}>
                    <ListItem
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                      }}
                      key={key}
                    >
                      <ListItemText>
                        {
                          comment.attributes.users_permissions_user.data
                            .attributes.username
                        }
                      </ListItemText>
                      <Typography variant="body1" color="text.secondary">
                        {comment.attributes.commentaire}
                      </Typography>
                    </ListItem>
                    <Divider />
                  </Box>
                );
              })}
            </List>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "90%",
                minWidth: "300px",
              }}
            >
              <TextField
                multiline
                rows={3}
                style={{ width: "100%" }}
                name="comment"
                value={values.comment}
                onChange={handleChange}
              />
              <Button
                sx={{ mt: "10px" }}
                variant="contained"
                onClick={handleComment}
              >
                Commenter
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
      <CustomModal
        montant={nombre * article?.attributes?.price}
        open={openModal}
        setOpen={setOpenModal}
        idArticle={article?.id}
        nombre={nombre}
      />
    </Layout>
  );
};

export default IndexPage;
