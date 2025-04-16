import React, { useEffect, useState } from "react";
import { CardElement, Elements, useElements } from "@stripe/react-stripe-js";
import getStripe from "../../utils/getStripes";
import {
  Alert,
  Box,
  Button,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { getLocalStorage, theme } from "../../utils/utils";
import { CheckCircle, Download } from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/router";
import generatePDF, { Margin, Resolution } from "react-to-pdf";
import CustomTable from "../CustomTable";
import moment from "moment";

const CARD_OPTIONS = {
  iconStyle: "solid" as const,
  hidePostalCode: true,
  style: {
    base: {
      iconColor: theme.palette.primary.main,
      color: theme.palette.primary.main,
      fontWeight: 500,
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": {
        color: "#5470e1",
      },
      "::placeholder": {
        color: theme.palette.primary.main,
      },
    },
    invalid: {
      iconColor: "#ffc7ee",
      color: "#ffc7ee",
    },
  },
};

interface addressObject {
  city: string;
  postal_code: string;
  email: string;
}

const CheckoutForm = ({ montant, idArticle, nombre }) => {
  const [clientSecret, setClientSecret] = useState(null);
  const elements = useElements();
  const [email, setEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [userJwt, setUserJwt] = useState<string>("");
  const [values, setValues] = useState<addressObject>(null);
  const [status, setStatus] = useState<string>("hide");
  const [commandes, setCommandes] = useState<any[]>();
  const router = useRouter();

  useEffect(() => {
    setEmail(getLocalStorage("userEmail"));
    setUserName(getLocalStorage("username"));
    setUserId(getLocalStorage("userId"));
    setUserJwt(getLocalStorage("userJwt"));

    window
      .fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: montant * 100, // avec 2 chiffres apres la virgule
        }),
      })
      .then((res) => {
        if (res.status !== 200) {
          setStatus("error");
        } else {
          setStatus("error");
          return res.json().then((data) => {
            setClientSecret(data.clientSecret);
          });
        }
      });
  }, []);

  const options = {
    filename: "export PDF",
    method: "save",
    resolution: Resolution.HIGH,
    page: {
      margin: Margin.SMALL,
      format: "A4",
      orientation: "portrait",
    },
    canvas: {
      mimeType: "image/png",
      qualityRatio: 1,
    },
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("proccess");

    const stripe = await getStripe();

    if (!stripe || !elements) {
      alert("Entrer un numero de carte valide");
      return;
    }

    if (clientSecret) {
      const payload = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            email: values?.email ? values?.email : email,
            name: userName,
            address: {
              city: values?.city,
              postal_code: values?.postal_code,
            },
          },
        },
      });

      if (payload.error) {
        setStatus("error");
      } else {
        setStatus("success");
        fetch("http://localhost:1337/api/commandes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userJwt}`,
          },
          body: JSON.stringify({
            data: {
              article: idArticle,
              users_permissions_user: userId,
              dateCommande: new Date(),
              status: "Payée",
              montant: montant,
              nombre: nombre,
            },
          }),
        })
          .then((res) => res.json())
          .then((res) => {
            console.log("res", res);
            setCommandes([
              {
                id: res.data.id,
                articleName: idArticle,
                dateCommande: moment(
                  res?.data?.attributes?.dateCommande
                ).format("DD/MM/YYYY"),
                heureCommande: moment(
                  res?.data?.attributes?.dateCommande
                ).format("HH:mm"),
                status: "Payée",
                nombre: res?.data?.attributes?.nombre,
                montant: res?.data?.attributes?.montant,
              },
            ]);
          });
      }
    }
  };

  const handleChange = (event) => {
    event.preventDefault();

    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const getTargetElement = () => document.getElementById("content-id");

  return status === "success" ? (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        width: "fit-content",
      }}
    >
      <Alert sx={{ placeSelf: "center", mt: "10px",mb:'30px' }} severity="success">
        Votre payement a été éffectué.
      </Alert>

      <Box id="content-id">
      <Typography variant='body1' color='secondary'>Facture du {moment().format('DD/MM/YYYY')}</Typography>
        <CustomTable commandes={commandes} type="facturation" />
      </Box>
      <Button
        sx={{ width: "fit-content", placeSelf: "center",mt:'30px' }}
        onClick={() => {
          generatePDF(getTargetElement, options as any);
        }}
        startIcon={<Download />}
        size="small"
        variant="text"
        color="primary"
      >
        Exporter la facture
      </Button>
      <Button sx={{mt:'20px'}} variant="text" onClick={() => router.push("/commandes")}>
        Historiques de vos commandes
      </Button>
    </Box>
  ) : (
    <Box>
      <Typography variant="h4" color="secondary">
        Payement
      </Typography>
      <Typography sx={{ mb: "20px" }} variant="body2" color="text.secondary">
        {userName}, vous confirmer votre payement de {montant}?
      </Typography>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <TextField
          sx={{ marginTop: "20px" }}
          onChange={handleChange}
          name="email"
          value={values?.email ? values?.email : email}
          label="Email"
        />
        <TextField
          sx={{ marginTop: "20px" }}
          name="city"
          onChange={handleChange}
          label="Ville"
        />
        <TextField
          sx={{ marginTop: "20px" }}
          name="postal_code"
          onChange={handleChange}
          label="Code postal"
        />
        <Divider />
        <Typography
          sx={{ mt: "30px", mb: "20px" }}
          variant="h6"
          color="secondary"
        >
          Information bancaire
        </Typography>
        <CardElement options={CARD_OPTIONS} />
        <Button
          startIcon={<CheckCircle />}
          color="primary"
          variant="contained"
          type="submit"
          sx={{ marginTop: "40px" }}
          disabled={
            status === "success" ||
            status === "proccess" ||
            !!!values?.city ||
            !!!values?.postal_code ||
            !email ||
            !userName ||
            !montant
          }
        >
          Confirmer
        </Button>
      </form>
    </Box>
  );
};

export default CheckoutForm;
