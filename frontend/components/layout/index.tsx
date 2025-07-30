import { useEffect, useState } from "react";
import { UserContext, getLocalStorage, theme } from "../../utils/utils";
import MenuBar from "../MenuBar";
import { User } from "../../interfaces";
import { Box, ThemeProvider } from "@mui/material";
import { Elements } from "@stripe/react-stripe-js";
import getStripe from "../../utils/getStripes";

interface propsObject {
  children: any;
  showMenuBar?:boolean;
  categories?: any;
  setFiltredArticles?: any;
  refetch?: boolean;
  setRefetch?: any;
}

const Layout = ({
  children,
  categories,
  setFiltredArticles,
  refetch,
  setRefetch,
  showMenuBar=true
}: propsObject) => {
  const [userData, setUserData] = useState<User>();

  useEffect(() => {
    setUserData({
      userId: getLocalStorage("userId"),
      jwt: getLocalStorage("userJwt"),
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Elements stripe={getStripe()}>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: "1600px",
          placeSelf:"center",
          margin:"auto"
        }}
      >
        {showMenuBar && (
          <MenuBar
            userData={userData}
            setFiltredArticles={setFiltredArticles}
            categories={categories}
            refetch={refetch}
            setRefetch={setRefetch}
          />
        )}
        {children && isNaN(children) && children}
      </Box>

      </Elements>
    </ThemeProvider>
  );
};

export default Layout;
