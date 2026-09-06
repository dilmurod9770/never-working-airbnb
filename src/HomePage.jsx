import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/Star";
import { useAuth } from "./useAuth";
import { useFavoret } from "./favorites";
import { useState } from "react";
import { ThreeDot } from "react-loading-indicators";


const DATA_HOME = gql`
  query Homee($limit: Int) {
    featuredListings(limit: $limit) {
      title
      rating
      pricePerNight
      images
      id
      address
    }
  }
`;

const ADD_fAV = gql`
  mutation AddFavorite($listingId: ID!) {
    addFavorite(listingId: $listingId) {
      address
    }
  }
`;
function Filter({ minPrice, maxPrice, setMinPrice, setMaxPrice, onFilter }) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      sx={{ my: 3 }}
    >
      <TextField
        size="small"
        type="number"
        label="Min price"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
      />

      <TextField
        size="small"
        type="number"
        label="Max price"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
      />
      <Button variant="contained" onClick={onFilter}>
        Filter
      </Button>

      <Button
        variant="outlined"
        onClick={() => {
          setMinPrice("");
          setMaxPrice("");
          onFilter();
        }}
      >
        Clear
      </Button>
    </Stack>
  );
}

function HomePage() {
  const navigate = useNavigate();

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [filterMin, setFilterMin] = useState("");
  const [filterMax, setFilterMax] = useState("");

  const { data, loading, error, refetch } = useQuery(DATA_HOME, {
    variables: {
      limit: 15,
    },
  });

  const [addFavorite] = useMutation(ADD_fAV, {
    onCompleted: () => refetch(),
  });

  const { accessToken, user, logout } = useAuth();
  const favorites = useFavoret((state) => state.favorites) || [];
  if (loading) {
    return <h3>Loading...</h3>;
  }

  if (error) {
    return <h3>{error.message}</h3>;
  }
  const listings = data?.featuredListings || [];
  const filteredListings = listings.filter((e) => {
    const price = Number(e.pricePerNight);
    const min =
      filterMin === "" ? 0 : Number(filterMin);

    const max =
      filterMax === "" ? Infinity : Number(filterMax);

    return price >= min && price <= max;
  });

  return (
    <Container
      sx={{
        mt: { xs: 2, sm: 3 },
        px: { xs: 2, sm: 3 },
      }}
    >
      <Stack
        className="header"
        direction={{ xs: "column", lg: "row" }}
        spacing={{ xs: 2, lg: 0 }}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "stretch", lg: "center" },
          mb: 4,
        }}
      >
        <Link
          to="/"
          style={{
            textDecoration: "none",
            alignSelf: "center",
          }}
        >
          <img
            style={{
              width: "110px",
              height: "45px",
              objectFit: "contain",
              borderRadius: "10px",
              display: "block",
            }}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8OrlP3IdXiC90WzVUJZrn8GB9FID8hTVViUkv_7ZKNg&s=10"
            alt=""
          />
        </Link>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{
            alignItems: "stretch",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link to="/bookings" style={{ textDecoration: "none" }}>
            <Button variant="contained" fullWidth>
              Bookings
            </Button>
          </Link>

          <Link to="/listings" style={{ textDecoration: "none" }}>
            <Button variant="contained" fullWidth>
              Listings
            </Button>
          </Link>

          {accessToken && (
            <Link to="/favorites" style={{ textDecoration: "none" }}>
              <Button variant="contained" fullWidth>
                ❤️ Favorites
              </Button>
            </Link>
          )}

          {!accessToken ? (
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
            >
              <Link
                to="/SignUp"
                style={{ textDecoration: "none" }}
              >
                <Button variant="contained" fullWidth>
                  Sign Up
                </Button>
              </Link>

              <Link
                to="/login"
                style={{ textDecoration: "none" }}
              >
                <Button variant="contained" fullWidth>
                  Sign In
                </Button>
              </Link>
            </Stack>
          ) : (
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                color="error"
                onClick={() =>
                  confirm("Profildan chiqmoqchimisiz?") &&
                  logout()
                }
                fullWidth
              >
                Log-out
              </Button>

              <Box
                sx={{
                  backgroundColor: "orange",
                  width: 45,
                  height: 45,
                  minWidth: 45,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "bold",
                  alignSelf: "center",
                }}
              >
                {user?.name?.charAt(0)}
              </Box>
            </Stack>
          )}
        </Stack>
      </Stack>

      <Filter
        minPrice={minPrice}
        maxPrice={maxPrice}
        setMinPrice={setMinPrice}
        setMaxPrice={setMaxPrice}
        onFilter={() => {
          setFilterMin(minPrice);
          setFilterMax(maxPrice);
        }}
      />

      <Grid container spacing={3}>
        {filteredListings.map((e) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={e.id}
          >
            <Box>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: {
                    xs: 220,
                    sm: 220,
                    md: 220,
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
                    src={e.images?.[0]}
                    alt={e.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "10px",
                      display: "block",
                    }}
                  />
                </Link>

                <IconButton
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    if (!accessToken) {
                      navigate("/SignUp");
                      return;
                    }

                    addFavorite({
                      variables: {
                        listingId: e.id,
                      },
                    });
                  }}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    padding: 0,
                    background: "transparent",
                  }}
                >
                  {favorites.find(
                    (item) =>
                      item?.id === e.id 
                  ) ? (
                    <FavoriteIcon color="error" />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </IconButton>
              </Box>

              <Link
                to={`/listings/${e.id}`}
                style={{
                  textDecoration: "none",
                  color: "black",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mt: 1,
                    fontSize: {
                      xs: "15px",
                      sm: "16px",
                    },
                    fontWeight: 600,
                  }}
                >
                  {e.title}
                </Typography>
              </Link>

              <Typography
                sx={{
                  mt: 1,
                  fontSize: "14px",
                  color: "gray",
                }}
              >
                {e.address}
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                sx={{
                  mt: 1,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Typography fontSize="15px">
                  {e.pricePerNight} $ USD / Night
                </Typography>

                <Typography>•</Typography>

                <Typography fontSize="15px">
                  {e.rating}
                </Typography>

                <StarIcon
                  color="warning"
                  sx={{ fontSize: 18 }}
                />
              </Stack>
            </Box>
          </Grid>
        ))}
      </Grid>

      {filteredListings.length === 0 && (
        <Typography
          sx={{
            textAlign: "center",
            mt: 5,
            color: "gray",
          }}
        >
          Bu narxda topilmadi
        </Typography>
      )}
    </Container>
  );
}

export default HomePage;