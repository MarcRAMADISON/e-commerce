import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Badge,
  Drawer,
  Typography,
  Divider,
  TextField,
  useMediaQuery,
} from "@mui/material";
import {
  ShoppingCartOutlined,
  Remove,
  PaymentRounded,
  ArrowForward,
} from "@mui/icons-material";
import {
  blockContainerStyle,
  closeButton,
  itemContainer
} from "./panierStyle";
import Image from "next/image";
import CustomModal from "../modal/modal";
import { theme } from "../../utils/utils";

interface articleData {
  available: boolean;
  createdAt: string;
  description: string;
  name: string;
  nombre: number;
  publishedAt: string;
  updatedAt: string;
  idPanier: number;
  price: number;
  images: any;
  idArticle: number;
}

interface valuesObject {
  prixUnitaire: number;
  nombre: number;
  idArticle: number;
}

const defaultValues = [
  {
    prixUnitaire: 0,
    nombre: 0,
    idArticle: 0,
  },
];

const formatDataPanier = (datas: any) => {
  const articles = (datas.data || []).map((data: any) => ({
    idPanier: data.id,
    idArticle: data?.attributes?.article?.data?.id,
    ...data?.attributes?.article?.data?.attributes,
  }));
  return articles;
};

const Panier = ({ refetch, setRefetch }) => {
  const [panier, setPanier] = useState<articleData[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [values, setValues] = useState<valuesObject[]>([]);
  const [currentValue, setCurrentValue] = useState<valuesObject>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const isMobile = useMediaQuery("(max-width:500px)");

  useEffect(() => {
    fetch(
      `http://localhost:1337/api/paniers?populate[0]=article&populate[1]=article.images&filters[users_permissions_user][$eq]=${localStorage.getItem(
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
        setPanier(formatDataPanier(datas));
      });
  }, [refetch]);

  const removePanier = (event: any, panierId: number) => {
    event.preventDefault();
    fetch(`http://localhost:1337/api/paniers/${panierId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("userJwt")}`,
      },
    });
    setRefetch((prev: boolean) => !prev);
  };

  const toggleDrawer = (state) => {
    setOpen((prev)=>!prev);
  };

  const handleChange = (event: any, idArticle: number, price: number) => {
    event.preventDefault();
    event.stopPropagation();

    setValues((prev) => {
      let objectFound = (prev || []).find((p) => p.idArticle === idArticle);

      if (objectFound) {
        return [
          ...prev.filter((p) => p.idArticle !== idArticle),
          { idArticle, nombre: event.target.value, prixUnitaire: price },
        ];
      }

      return [
        ...prev,
        { idArticle, nombre: event.target.value, prixUnitaire: price },
      ];
    });
  };

  const handlePayer = (event, article, nombre) => {
    event.preventDefault();
    setCurrentValue({
      idArticle: article.idArticle,
      nombre: nombre,
      prixUnitaire: article.price,
    });
    setOpenModal(true);
  };

  return (
    <Box sx={{ placeSelf: "center"}}>
      <Badge badgeContent={panier.length} color="error">
        <Button
          variant="text"
          startIcon={<ShoppingCartOutlined />}
          onClick={() => toggleDrawer(true)}
          color="secondary"
          size="medium"
        >
          {!isMobile && "Pannier"}
        </Button>
      </Badge>

      <Drawer anchor='right' sx={{'& .MuiDrawer-root':{position:'absolute',top:'55px'},'& .MuiDrawer-paper':{position:'absolute',top:'55px'}}} open={open} onClose={() => toggleDrawer(false)}>
        <Box sx={isMobile? {...blockContainerStyle,width:'100%',m:'0px'} : blockContainerStyle}>
          <Button
            sx={closeButton}
            startIcon={<ArrowForward color="error" />}
            onClick={() => toggleDrawer(false)}
            size='large'
          ></Button>
          {(panier || []).map((article, index) => {
            const nombre = values?.find(
              (value) => value.idArticle === article.idArticle
            )?.nombre;

            return (
              <Box key={index}>
                <Box sx={{...itemContainer,borderBottom:`solid ${theme.palette.primary.main} 2px`,pb:'30px'}}>
                  <Image
                    width={200}
                    height={200}
                    src={`http://localhost:1337${
                      article?.images?.data
                        ? article?.images?.data[0]?.attributes?.formats
                            ?.thumbnail?.url
                        : ""
                    }`}
                    alt="article.name"
                  />
                  <Box sx={{ marginLeft: "30px" }}>
                    <Box sx={{ display: "flex", marginBottom: "5px" }}>
                      <Typography>Nom: </Typography>
                      <Typography sx={{ marginLeft: "10px" }} color="secondary">
                        {article.name}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", marginBottom: "5px" }}>
                      <Typography>Prix unitaire: </Typography>
                      <Typography sx={{ marginLeft: "10px" }} color="secondary">
                        {article?.price}
                      </Typography>
                    </Box>

                    <TextField
                      sx={{ mb: "20px" }}
                      type="number"
                      id="filled-basic"
                      value={nombre}
                      label="Nombre"
                      variant="filled"
                      onChange={(event) =>
                        handleChange(event, article?.idArticle, article?.price)
                      }
                    />
                    <Box sx={{ display: "flex", marginBottom: "5px" }}>
                      <Typography>Total: </Typography>
                      <Typography sx={{ marginLeft: "10px" }} color="primary">
                        {isNaN(nombre) ? 0 : nombre * article?.price}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-around",
                        flexWrap: "wrap",
                      }}
                    >
                      <Button
                        disabled={isNaN(nombre) || nombre <= 0}
                        variant="contained"
                        startIcon={<PaymentRounded />}
                        color="primary"
                        onClick={(event) => handlePayer(event, article, nombre)}
                        sx={{width:'100%',mt:'20px'}}
                      >
                        Payer
                      </Button>

                      <Button
                        variant="contained"
                        startIcon={<Remove />}
                        color="error"
                        onClick={(event) =>
                          removePanier(event, article.idPanier)
                        }
                        sx={{mt:'10px',width:'100%'}}
                      >
                        Supprimer
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
        <CustomModal
          montant={currentValue?.nombre * currentValue?.prixUnitaire}
          open={openModal}
          setOpen={setOpenModal}
          idArticle={currentValue?.idArticle}
          nombre={currentValue?.nombre}
        />
      </Drawer>
    </Box>
  );
};

export default Panier;
