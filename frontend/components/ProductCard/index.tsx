import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { AddShoppingCartRounded, Padding } from "@mui/icons-material";
import { useRouter } from "next/router";
import { theme } from "../../utils/utils";

const columnCard = {
  placeSelf: "center",
  width: "95%",
  maxWidth: "250px",
  minWidth: "200px",
  minHeight: "150px",
  position: "relative",
};

const rowCard = {
  display:'flex',
  justifyContent:'center',
  width: "90%",
  height:'250px',
  minWidth: "200px",
  minHeight: "150px",
  position: "relative",
  Padding:'5px'
};

export default function ProductCard({ item, addBasket, type='columnCard' }) {
  const router = useRouter();

  return (
    <>
      <Card sx={columnCard}>
        <CardMedia
          sx={{height: 150 }}
          image={
            item?.images?.data
              ? `http://localhost:1337${item?.images?.data[0]?.attributes?.formats?.thumbnail?.url}`
              : ""
          }
          title={item?.name}
        />
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "80px",
          }}
        >
          <Typography
            style={{ fontWeight: "bold" }}
            gutterBottom
            variant="h5"
            component="div"
          >
            {item.name}
          </Typography>
          {!item.reduction && (
            <Typography variant="body2" color="text.secondary">
              Prix: {item?.price || 0}
            </Typography>
          )}
          {item.reduction && (
            <>
              <Typography variant="body2" color="primary">
                Prix:{" "}
                {(item?.price - (item?.price * item?.reduction) / 100).toFixed(
                  2
                )}
              </Typography>
              <Typography
                sx={{ m: "5px 0px" }}
                variant="body2"
                color="text.secondary"
              >
                Au lieu de : {item?.price || 0}
              </Typography>
            </>
          )}
          {item.reduction ? (
            <Box
              sx={{
                position: "absolute",
                left: "5px",
                top: "5px",
                backgroundColor: theme.palette.primary.main,
                color: "#f0f0f0",
                padding: "5px 20px",
                borderRadius: "5px",
              }}
            >
              <Typography>Promotion {item.reduction}%</Typography>
            </Box>
          ) : (
            <></>
          )}
        </CardContent>
        <Box style={{ position: "absolute", bottom: "15px", width: "100%" }}>
          <CardActions
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignContent: "center",
              height: "70px",
            }}
          >
            <Button
              color="secondary"
              variant="text"
              size="small"
              onClick={() => router.push(`/article/${item.id}`)}
            >
              Voir détail
            </Button>
            <Button
              startIcon={<AddShoppingCartRounded />}
              variant="contained"
              color="primary"
              size="small"
              onClick={(event) => addBasket(event, item)}
            >
              Ajouter au pannier
            </Button>
          </CardActions>
        </Box>
      </Card>
    </>
  );
}
