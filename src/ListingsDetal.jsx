import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import Rating from "@mui/material/Rating";
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogTitle,
  Divider,
  IconButton,
  ImageList,
  ImageListItem,
  InputLabel,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAuth } from "./useAuth";
import { useState } from "react";
import { ThreeDot } from "react-loading-indicators";

const DETAILS = gql`
  query Query($listingId: ID!) {
    listing(id: $listingId) {
      title
      reviewsCount
      rating
      pricePerNight
      location
      isFeatured
      images
      isFavorite
      id
      guests
      description
      createdAt
      category
      beds
      bedrooms
      bathrooms
      amenities
      address
    }
  }
`;

const CreateBookings = gql`
  mutation Mutation(
    $checkIn: String!
    $checkOut: String!
    $guests: Int!
    $listingId: ID!
  ) {
    createBooking(
      checkIn: $checkIn
      checkOut: $checkOut
      guests: $guests
      listingId: $listingId
    ) {
      checkIn
      checkOut
      guests
      pricePerNight
      status
      totalNights
      totalPrice
      id
    }
  }
`;

function ListingsDetail() {
  const { control, handleSubmit } = useForm();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { accessToken } = useAuth();

  const { id } = useParams();

  const { data, loading, error, refetch } = useQuery(DETAILS, {
    variables: { listingId: id },
  });

  const [createBooking, { loading: bookingLoading }] = useMutation(
    CreateBookings,
    {
      onCompleted: (data) => {
        toast.success("successfully bookings");
        refetch();
      },
      onError: (err) => {
        toast.error(err.message);
      },
    },
  );

  const handleS = (formData) => {
    if (!accessToken) {
      setDialogOpen(true);
      return;
    }

    createBooking({
      variables: {
        listingId: id,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guests: parseInt(formData.guests, 10),
      },
    });
  };

  console.log(data);

  const listing = data?.listing;
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="lg"
      sx={{
        px: { xs: 2, sm: 3 },
      }}
    >
      <Typography variant="h5">
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIosIcon />
          Back
        </IconButton>
      </Typography>

      <br />
      <br />

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

      {error && (
        <Typography
          variant="h1"
          color="error"
          sx={{
            fontSize: { xs: "30px", sm: "50px" },
          }}
        >
          {error.message}
        </Typography>
      )}

      {listing && (
        <Container
          key={listing.id}
          sx={{
            px: { xs: 0, sm: 2 },
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{
              flexWrap: "wrap",
            }}
          >
            {Array.isArray(listing.images) &&
              listing.images.map((imgUrl, index) => (
                <img
                  key={index}
                  src={imgUrl}
                  alt={`${listing.title} - ${index + 1}`}
                  style={{
                    width: "100%",
                    maxWidth: "350px",
                    height: "300px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              ))}
          </Stack>

          <Stack
            direction={{ xs: "column", md: "row" }}
            sx={{
              alignItems: { xs: "flex-start", md: "center" },
              justifyContent: "space-between",
              gap: { xs: 2, md: 4 },
              mt: 3,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: "28px", sm: "34px" },
              }}
            >
              {listing.title}
            </Typography>

            <Paper
              sx={{
                padding: 1,
                width: { xs: "100%", md: "auto" },
              }}
              elevation={3}
            >
              <Stack
                direction="row"
                sx={{ alignItems: "center" }}
                spacing={1}
              >
                <LocalOfferIcon color="action" fontSize="small" />

                <Typography
                  variant="body1"
                  sx={{ fontWeight: 500 }}
                >
                  The price includes all fees
                </Typography>
              </Stack>
            </Paper>
          </Stack>

          <Stack
            direction="row"
            sx={{
              gap: 1,
              flexWrap: "wrap",
              mt: 2,
            }}
          >
            <Typography variant="h6">
              {listing.guests} Guests •
            </Typography>

            <Typography variant="h6">
              {listing.bedrooms} Bathroom •
            </Typography>

            <Typography variant="h6">
              {listing.beds} Beds •
            </Typography>

            <Typography variant="h6">
              {listing.bathrooms} Bathrooms •
            </Typography>

            <Typography variant="h6">
              {listing.category} •
            </Typography>

            <Typography color="success" variant="h6">
              {listing.rating} Rating
            </Typography>
          </Stack>

          <br />
          <Divider />
          <br />

          <Stack>
            <Stack
              direction={{ xs: "column", md: "row" }}
              sx={{
                justifyContent: "space-between",
                gap: { xs: 3, md: 6 },
              }}
            >
              <Stack
                sx={{
                  width: { xs: "100%", md: "50%" },
                }}
              >
                <Typography variant="h4">Address: </Typography>

                <br />

                <Typography variant="h6">
                  {listing.address}
                </Typography>

                <br />

                <Typography variant="h4">Location: </Typography>

                <Typography variant="h6">
                  {listing.location}
                </Typography>
              </Stack>

              <Paper
                elevation={4}
                sx={{
                  width: { xs: "100%", md: "auto" },
                }}
              >
                <Stack sx={{ padding: 2 }}>
                  <Stack
                    direction="row"
                    spacing={0.6}
                    sx={{
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography
                      color="textDisabled"
                      variant="h5"
                    >
                      <del>$512</del>
                    </Typography>

                    <Typography variant="h5">
                      ${listing.pricePerNight}
                    </Typography>

                    <Typography
                      variant="h6"
                      color="textDisabled"
                    >
                      for 1 nights
                    </Typography>

                    <br />
                    <br />
                  </Stack>

                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                  >
                    <Stack sx={{ width: "100%" }}>
                      <InputLabel>CheckIn: </InputLabel>

                      <Controller
                        name="checkIn"
                        control={control}
                        rules={{
                          required: "don't be empty",
                        }}
                        render={({
                          field,
                          fieldState: { error },
                        }) => (
                          <TextField
                            {...field}
                            error={error}
                            type="date"
                            size="small"
                            helperText={error && error.message}
                            fullWidth
                          />
                        )}
                      />
                    </Stack>

                    <Stack sx={{ width: "100%" }}>
                      <InputLabel>CheckOut: </InputLabel>

                      <Controller
                        name="checkOut"
                        control={control}
                        rules={{
                          required: "don't be empty",
                        }}
                        render={({
                          field,
                          fieldState: { error },
                        }) => (
                          <TextField
                            {...field}
                            error={error}
                            type="date"
                            size="small"
                            helperText={error && error.message}
                            fullWidth
                          />
                        )}
                      />
                    </Stack>
                  </Stack>

                  <Stack>
                    <br />

                    <Controller
                      name="guests"
                      control={control}
                      rules={{
                        required: "don't be empty",
                      }}
                      render={({
                        field,
                        fieldState: { error },
                      }) => (
                        <TextField
                          {...field}
                          error={error}
                          label="Guests"
                          type="number"
                          size="small"
                          helperText={error && error.message}
                          fullWidth
                        />
                      )}
                    />

                    <br />

                    <Button
                      onClick={handleSubmit(handleS)}
                      variant="contained"
                      color="error"
                      loading={bookingLoading}
                      fullWidth
                    >
                      Reserve
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            </Stack>

            <br />

            <Divider />
            <br />

            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: "18px", sm: "24px" },
              }}
            >
              {listing.isFavorite === true
                ? "This list has been added to favorites"
                : "This listing has not been added to favorites."}
            </Typography>

            <br />

            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: "26px", sm: "32px" },
              }}
            >
              Amenities:
            </Typography>

            <br />

            {listing.amenities.map((e) => (
              <Typography
                key={e}
                variant="h5"
                sx={{
                  fontSize: { xs: "18px", sm: "24px" },
                }}
              >
                • {e}
              </Typography>
            ))}
          </Stack>

          <br />
          <Divider />
          <br />

          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: "26px", sm: "32px" },
            }}
          >
            Description:
          </Typography>

          <br />

          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: "16px", sm: "20px" },
              lineHeight: 1.6,
            }}
          >
            {listing.description}
          </Typography>

          <br />
          <Divider />
          <br />

          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: "26px", sm: "32px" },
            }}
          >
            Comments: {listing.reviewsCount}
          </Typography>

          <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
          >
            <DialogTitle>
              You are not registered.
            </DialogTitle>

            <DialogActions>
              <Link to="/sign">
                <Button variant="outlined">
                  Sing Up
                </Button>
              </Link>

              <Link to="/login">
                <Button variant="contained">
                  Log In
                </Button>
              </Link>
            </DialogActions>
          </Dialog>
        </Container>
      )}
    </Container>
  );
}

export default ListingsDetail;