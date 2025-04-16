import { useEffect, useState } from "react";
import Layout from "../../components/layout";
import { ArrowBack } from "@mui/icons-material";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";
import CustomTable from "../../components/CustomTable";
import moment from "moment";
import { Box, Typography } from "@mui/material";
import { theme } from "../../utils/utils";

interface commandeObject {
  id: string;
  articleName: string;
  dateCommande: string;
  heureCommande: string;
  status: string;
  nombre: string;
  montant: string;
}

const IndexPage = () => {
  const [filtredArticle, setFiltredArticles] = useState<any>();
  const [refetch, setRefetch] = useState<boolean>(false);
  const router = useRouter();
  const [commandes, setCommandes] = useState<commandeObject[]>();

  useEffect(() => {
    fetch(
      `http://localhost:1337/api/commandes?populate=article&filters[users_permissions_user][$eq]=${localStorage.getItem(
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
      .then((datas) => {
        setCommandes(
          (datas.data || []).map((d) => ({
            id: d.id,
            articleName: d.attributes.article.data.attributes.name,
            dateCommande: moment(d.attributes.dateCommande).format(
              "DD/MM/YYYY"
            ),
            heureCommande: moment(d.attributes.dateCommande).format("HH:mm"),
            status: d.attributes.status,
            nombre: d.attributes.nombre,
            montant: d.attributes.montant,
          }))
        );
      });
  }, []);

  console.log("commandes", commandes);

  return (
    <Layout
      setFiltredArticles={setFiltredArticles}
      refetch={refetch}
      setRefetch={setRefetch}
    >
      <Button
        variant="text"
        sx={{ position: "absolute", top: "90px", left: "10px" }}
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
          <Typography>Historique des commandes</Typography>
        </Box>
      <CustomTable commandes={commandes} type='historique'/>
    </Layout>
  );
};

export default IndexPage;
