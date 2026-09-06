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
import { ThreeDot } from "react-loading-indicators";

const BOOKINGS_API = gql`
  query Query {
    bookings {
      checkIn
      checkOut
      createdAt
      guests
      id
      pricePerNight
      status
      totalNights
      totalPrice
      listing {
        id
        images
        location
        pricePerNight
        title
      }
    }
  }
`;

const CancelBookings = gql`
  mutation Mutation($bookingId: ID!) {
    cancelBooking(bookingId: $bookingId) {
      id
    }
  }
`;

function Bookings() {
  const { data, loading, error, refetch } = useQuery(BOOKINGS_API);
  const { accessToken } = useAuth();
  const [cancelBookingss] = useMutation(CancelBookings, {
    onCompleted: () => refetch(),
  });
  const navigete = useNavigate();

  if (loading) {
    return   <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100vh",
        }}
      >
        <ThreeDot color="#3282cd" size="medium" text="" textColor="" />
      </div>;
  }

  if (error) {
    return (
      <Typography variant="h3" color="error">
        {error.message}
      </Typography>
    );
  }

  const handleRemove = (bookingId) => {
    if (accessToken) {
      cancelBookingss({ variables: { bookingId } });
    }
  };

  const activeBookings = data?.bookings?.filter(
    (e) => e.status
  );

  const malumot = activeBookings.length;
  return (
    <Container
      sx={{
        px: { xs: 2, sm: 3 },
        mt: { xs: 2, sm: 3 },
      }}
    >
      <IconButton onClick={() => navigete(-1)}>
        <ArrowBackIosIcon /> Back
      </IconButton>

      <Typography
        color="textDisabled"
        variant="h3"
        sx={{
          fontSize: { xs: "28px", sm: "40px" },
        }}
      >
        {malumot === 0 ? "no bookings" : null}
      </Typography>

      <Grid container spacing={2}>
        {activeBookings.map((e) => (
          <Grid
            key={e.id}
            size={{
              xs: 12,
              sm: 6,
              md: 4,
              lg: 3,
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: { xs: "220px", sm: "200px", md: "170px" },
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <Link
                to={`/listings/${e.listing.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <img
                  src={e.listing.images[0]}
                  alt={e.listing.title}
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
                  if (
                    confirm(
                      "Bron qilingan malumotni o'chirmoqchimisiz?"
                    )
                  ) {
                    handleRemove(e.id);
                  }
                }}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  backgroundColor: "white",
                }}
              >
                <ClearIcon color="action" />
              </IconButton>
            </Box>

            <Link
              to={`/listings/${e.id}`}
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mt: 1,
                  fontSize: { xs: "18px", sm: "20px" },
                }}
              >
                {e.listing.title}
              </Typography>
            </Link>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              sx={{
                mt: 1,
              }}
            >
              <Typography>
                {e.listing.location} •
              </Typography>

              <Typography>
                ${e.pricePerNight} / {e.totalNights} night
              </Typography>

              <Typography>
                Total: ${e.totalPrice}
              </Typography>
            </Stack>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Bookings;