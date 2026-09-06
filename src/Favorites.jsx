import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router";
import ClearIcon from "@mui/icons-material/Clear";
import { useAuth } from "./useAuth";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useState } from "react";
import { ThreeDot } from "react-loading-indicators";

const favoritesData = gql`
  query Fav {
    favorites {
      title
      images
      id
      location
      pricePerNight
      rating
    }
  }
`;

const RemoveFavorite = gql`
  mutation remove($listingId: ID!) {
    removeFavorite(listingId: $listingId) {
      id
    }
  }
`;

function Favorites() {
  const [progress, setProgress] = useState(10);
  const { data, loading, error, refetch } = useQuery(favoritesData);

  const [removeFavorite] = useMutation(RemoveFavorite, {
    onCompleted: () => refetch(),
  });

  const handleFavoriteInclude = (listingId) => {
    if (accessToken) {
      removeFavorite({ variables: { listingId } });
    }
  };

  const navigate = useNavigate();
  const { accessToken } = useAuth();

  if (loading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: { xs: 3, sm: 5 },
        }}
      >
          <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100vh",
        }}
      >
        <ThreeDot  color="#3282cd" size="medium" text="" textColor="" />
      </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: { xs: 3, sm: 5 }, px: { xs: 2, sm: 3 } }}>
        <Typography
          color="error"
          variant="h4"
          sx={{
            fontSize: { xs: "24px", sm: "34px" },
          }}
        >
          Error: {error.message}
        </Typography>
      </Container>
    );
  }

  const malumotBorYokiYoq = data?.favorites;

  return (
    <Container
      sx={{
        px: { xs: 2, sm: 3 },
        mt: { xs: 2, sm: 3 },
      }}
    >

      <Button
        onClick={() => navigate(-1)}
        startIcon={<ArrowBackIosIcon />}
        sx={{ mb: 2 }}
      >
        Back
      </Button>

      <Typography
        variant="h3"
        sx={{
          fontSize: { xs: "28px", sm: "40px" },
        }}
      >
        {malumotBorYokiYoq.length === 0 ? "no information" : null}
      </Typography>

      <Grid container spacing={2}>
        {data?.favorites?.map((e) => (
          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 4,
              lg: 3,
            }}
            key={e.id}
          >
            <Stack spacing={1}>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: {
                    xs: "220px",
                    sm: "200px",
                    md: "180px",
                  },
                }}
              >
                <Link
                  to={`/listings/${e.id}`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <img
                    src={e.images}
                    alt={e.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </Link>

                <IconButton
                  onClick={() => {
                    handleFavoriteInclude(e.id);
                  }}
                  sx={{
                    position: "absolute",
                    top: 8,
                    backgroundColor: "white",
                    right: 8,
                  }}
                >
                  <ClearIcon />
                </IconButton>
              </Box>

              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: "20px", sm: "24px" },
                }}
              >
                {e.title}
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
              >
                <Typography variant="subtitle2">
                  ${e.pricePerNight} / night •
                </Typography>

                <Typography variant="body2">
                  {e.location} •
                </Typography>

                <Typography variant="body2">
                  {e.rating}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Favorites;