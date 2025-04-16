import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useRouter } from "next/router";
import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import ProductCard from "../ProductCard";
import Image from "next/image";
import { theme } from "../../utils/utils";
import { ArrowRightAltRounded } from "@mui/icons-material";

interface propsObject {
  isMultiple: boolean;
  deviceType?: string;
  addBasket?: any;
  title?: string;
  images?: any;
  items?: any;
  isAffiche?: boolean;
  type?: string;
}

const CustomCarousel = ({
  deviceType,
  addBasket,
  title,
  isMultiple,
  images,
  items,
  isAffiche,
  type,
}: propsObject) => {
  const isTablette = useMediaQuery("(max-width:1024px) and (min-width:481px)");
  const isMobile = useMediaQuery("(max-width:620px)");
  const router = useRouter();
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: isMultiple ? 4 : 1,
      slidesToSlide: 1, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 780 },
      items: isMultiple ? 2 : 1,
      slidesToSlide: 1, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 780, min: 0 },
      items: isMultiple ? 1 : 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  };

  return (
    <Box
      sx={{
        placeSelf: "center",
        marginTop: isAffiche ? "35px" : isMultiple ? "100px" : "0px",
        maxWidth: isMultiple
          ? "auto"
          : isAffiche && (isTablette || isMobile)
          ? "100%"
          : isAffiche
          ? "1200px"
          : isTablette || isMobile
          ? "370px"
          : "450px",
        overflow: "visible",
        "& .react-multiple-carousel__arrow--left": { left: "1%" },
        "& .react-multiple-carousel__arrow--right": { right: "1%" },
        "& .react-multi-carousel-dot-list": { bottom: "0" },
        "& .react-multi-carousel-track": {
          backgroundColor: isAffiche ? "#f0f0f0" : "#fff",
          alignItems: "center",
          margin:
            images && (isTablette || isMobile)
              ? "10px 0px 20px 0px"
              : isAffiche && (isTablette || isMobile)
              ? "0px 0px 20px 0px"
              : isAffiche
              ? "15px 1px"
              : "20px 1px",
          textAlign: "center",
        },
        "& .react-multiple-carousel__arrow": {
          background: "rgba(255,199,76,0.8)",
          zIndex: "999",
        },
        "& .react-multi-carousel-dot button": { borderColor: "#ffc74c" },
        "& .react-multi-carousel-dot--active button": { background: "#c74cff" },
      }}
    >
      {title ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "98%",
            backgroundColor: theme.palette.secondary.main,
            height: "50px",
            color: "#f0f0f0",
            paddingLeft: "20px",
            marginTop: "20px",
          }}
        >
          <Typography>{title}</Typography>
          <Button
            sx={{ ml: "30px" }}
            size="small"
            variant="outlined"
            onClick={() =>
              type === "suggestions"
                ? router.push("/voirPlus/suggestions")
                : router.push("/voirPlus/promotions")
            }
          >
            Voir plus
          </Button>
        </Box>
      ) : (
        <></>
      )}

      <Carousel
        swipeable={true}
        draggable={false}
        showDots={true}
        responsive={responsive}
        ssr={true} // means to render carousel on server-side.
        infinite={true}
        autoPlay={!isMobile ? true : false}
        autoPlaySpeed={4000}
        keyBoardControl={true}
        customTransition="all .5"
        transitionDuration={500}
        containerClass="carousel-container"
        removeArrowOnDeviceType={isAffiche && ["tablette", "web"]}
        deviceType={deviceType}
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item-padding-40-px"
      >
        {images
          ? (images || []).map((image: any, index: number) => {
              const url =
                isMobile || isTablette
                  ? `http://localhost:1337${image?.attributes?.formats?.thumbnail?.url || ''}`
                  : `http://localhost:1337${image?.attributes?.formats?.small?.url || image?.attributes?.formats?.thumbnail?.url}`;
              const width =
                isMobile || isTablette
                  ? image.attributes.formats.thumbnail.width
                  : 400;
              const height =
                isMobile || isTablette
                  ? image.attributes.formats.thumbnail.height
                  : 370;

              return (
                <Image
                  key={index}
                  width={width}
                  height={height}
                  loading="eager"
                  src={url}
                  alt="article détail"
                />
              );
            })
          : isAffiche && items
          ? (items || []).map((image, index: number) => {
              const url = isMobile
                ? `http://localhost:1337${image?.imageSmall?.url || ''}`
                : isTablette
                ? `http://localhost:1337${image?.imageMedium?.url ||  image?.imageSmall?.url}`
                : `http://localhost:1337${image?.imageLarge?.url || image?.imageMedium?.url || image?.imageSmall?.url }`;

              const width = isMobile
                ? image?.imageSmall?.width
                : isTablette
                ? image?.imageMedium?.width
                : image?.imageLarge?.width;

              const height = isMobile
                ? image?.imageSmall?.height
                : isTablette
                ? image?.imageMedium?.height
                : image?.imageLarge?.height;

              return (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-end",
                    width: isMobile || isTablette ? width : "100%",
                    maxWidth: "1400px",
                    height: isMobile || isTablette ? height : "400px",
                    maxHeight: "400px",
                  }}
                >
                  <Image
                    objectFit="contain"
                    layout="fill"
                    loading="eager"
                    src={url}
                    alt="affiche publicitaire"
                  />
                  {image?.article && (
                    <Button
                      endIcon={<ArrowRightAltRounded />}
                      sx={{ mb: "20px" }}
                      variant="contained"
                      color="secondary"
                      size={
                        isMobile ? "small" : isTablette ? "medium" : "large"
                      }
                      onClick={(event) => {
                        event.preventDefault();
                        router.push(`/article/${image?.article?.id}`);
                      }}
                    >
                      Voir détail
                    </Button>
                  )}
                </Box>
              );
            })
          : (items || []).map((item: any, key: number) => {
              return (
                <Box
                  key={key}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <ProductCard addBasket={addBasket} item={item} />
                </Box>
              );
            })}
      </Carousel>
    </Box>
  );
};

export default CustomCarousel;
