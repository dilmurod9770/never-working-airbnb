import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useState } from "react";
import { useAuth } from "./useAuth";
import { Link, Navigate, useNavigate } from "react-router";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StarIcon from "@mui/icons-material/Star";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useFavoret } from "./favorites";
import {
  Button,
  TextField,
  Grid,
  Box,
  Stack,
  Typography,
  Container,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { ThreeDot } from "react-loading-indicators";
import ReplyIcon from '@mui/icons-material/Reply';

const Listingsss = gql`
  query Listings($limit: Int, $page: Int, $search: String) {
    listings(limit: $limit, page: $page, search: $search) {
      items {
        id
        title
        pricePerNight
        rating
        images
      }

      pagination {
        totalPages
      }
    }
  }
`;

function ListingsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const { accessToken, user, logout } = useAuth();

  const { data, loading, error } = useQuery(Listingsss, {
    variables: {
      limit: 10,
      page: page,
      search: search,
    },
  });

  const totolPages = data?.listings?.pagination?.totalPages;

  const favorites = useFavoret((state) => state.favorites) || [];
  const toggleFavorite = useFavoret(
    (state) => state.toggleFavorite
  );

  return (
    <Container
      sx={{
        mt: 3,
        px: { xs: 2, sm: 3 },
      }}
    >
      <Stack
        direction={{ xs: "column", lg: "row" }}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "stretch", lg: "center" },
          mb: 4,
          gap: 2,
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{
            alignItems: { xs: "stretch", sm: "center" },
            width: { xs: "100%", lg: "auto" },
          }}
        >
          <TextField
            size="small"
            type="text"
            label="Search"
            value={searchInput}
            sx={{
              width: { xs: "100%", sm: "300px" },
            }}
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
          />

          <Button
            variant="contained"
            disabled={loading}
            onClick={() => {
              setSearch(searchInput);
              setPage(1);
            }}
            sx={{
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <SearchIcon />
            {loading ? "Loading..." : "Search"}
          </Button>
        </Stack>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{
            alignItems: { xs: "stretch", sm: "center" },
            width: { xs: "100%", lg: "auto" },
          }}
        >
          <Link to="/" style={{ textDecoration: "none" }}>
            <Button variant="contained" startIcon={<ReplyIcon  accentHeight={Button}/>}>
              Homepage
            </Button>
          </Link>

          {accessToken && (
            <Link
              to="/favorites"
              style={{ textDecoration: "none" }}
            >
              <Button
                variant="contained"
                fullWidth
              >
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
                <Button
                  variant="contained"
                  fullWidth
                >
                  Sign Up
                </Button>
              </Link>

              <Link
                to="/login"
                style={{ textDecoration: "none" }}
              >
                <Button
                  variant="contained"
                  fullWidth
                >
                  Sign In
                </Button>
              </Link>
            </Stack>
          ) : (
            <Stack
              direction="row"
              spacing={2}
              sx={{
                alignItems: "center",
                justifyContent: {
                  xs: "space-between",
                  sm: "flex-start",
                },
              }}
            >
              <Button
                variant="contained"
                color="error"
                onClick={() =>
                  confirm("Profildan chiqmoqchimisiz?") && logout()
                }
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
                }}
              >
                {user?.name?.charAt(0)}
              </Box>
            </Stack>
          )}
        </Stack>
      </Stack>

      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100vh",
          }}
        >
          <ThreeDot color="#3282cd" size="medium" text="" textColor="" />
        </div>
      )}
      {error && <h3>{error.message}</h3>}

      <Grid container spacing={3}>
        {data?.listings?.items?.map((e) => (
          <Grid
            key={e.id}
            size={{
              xs: 12,
              sm: 6,
              md: 4,
              lg: 3,
            }}
          >
            <Box>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: {
                    xs: 250,
                    sm: 220,
                    md: 220,
                  },
                }}
              >
                <Link
                  to={`/listings/${e.id}`}
                  style={{
                    textDecoration: "none",
                    color: "black",
                  }}
                >
                  <img
                    src={e.images?.[0]}
                    width="100%"
                    height="220"
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "10px",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </Link>

                <button
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    if (!accessToken) {
                      navigate("/SignUp");
                      return;
                    }

                    toggleFavorite(e);
                  }}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    border: "none",
                    background: "transparent",
                    padding: 0,
                    cursor: "pointer",
                  }}
                >
                  {favorites.find(
                    (item) => item?.id === e.id
                  ) ? (
                    <FavoriteIcon color="error" />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </button>
              </Box>

              <Link
                to={`/listings/${e.id}`}
                style={{
                  textDecoration: "none",
                  color: "black",
                }}
              >
                <Typography
                  sx={{
                    mt: 1,
                    fontSize: "16px",
                    fontWeight: 600,
                  }}
                >
                  {e.title}
                </Typography>
              </Link>

              <Stack
                direction="row"
                spacing={1}
                sx={{
                  mt: 1,
                  alignItems: "center",
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

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          marginTop: "30px",
          flexWrap: "wrap",
        }}
      >
        {totolPages > 0 &&
          new Array(totolPages).fill("").map((_, index) => (
            <button
              key={index}
              disabled={loading}
              onClick={() => setPage(index + 1)}
              style={{
                padding: "8px 14px",
                cursor: "pointer",
              }}
            >
              {index + 1}
            </button>
          ))}
      </div>
    </Container>
  );
}

export default ListingsPage;
