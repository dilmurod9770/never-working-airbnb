import { gql, useMutation } from "@apollo/client";

import {
  Button,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAuth } from "./useAuth";
import { Link, useNavigate } from "react-router";
import ReplyIcon from '@mui/icons-material/Reply';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      user {
        id
        email
        name
      }
    }
  }
`;

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { setAccessToken, setUser } = useAuth();
  const navigate = useNavigate();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [login, { loading }] = useMutation(LOGIN_MUTATION);

  const handleLoginCompleted = (data) => {
    setAccessToken(data?.login?.accessToken);
    setUser(data?.login?.user);
    navigate("/");
  };

  const handleLogin = (value) => {
    login({
      variables: value,
      onCompleted: handleLoginCompleted,
      onError: (error) => toast.error(error.message),
    });
  };

  return (
    <>
      <Link
        to="/"
        style={{
          marginLeft: "15px",
        }}
      >
        <Button variant="contained" startIcon={<ReplyIcon />}>
          Homepage
        </Button>
      </Link>

      <br />
      <br />
      <Container
        sx={{
          px: { xs: 2, sm: 3 },
        }}
      >
        <Paper
          sx={{
            padding: { xs: 3, sm: 5, md: 10 },
            width: "100%",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          <Stack spacing={2}>
            <Controller
              name="email"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Email is required!",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Email"
                  error={!!error}
                  helperText={error && error.message}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Password is required!",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  error={!!error}
                  helperText={error && error.message}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() =>
                              setShowPassword((prev) => !prev)
                            }
                          >
                            {showPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}
            />

            <Button
              loading={loading}
              variant="contained"
              color="success"
              fullWidth
              onClick={handleSubmit(handleLogin)}
            >
              Sign In
            </Button>

            <Link
              to="/SignUp"
              style={{
                textDecoration: "none",
              }}
            >
              <Button
                variant="text"
                fullWidth
              >
                Sign Up
              </Button>
            </Link>
          </Stack>
        </Paper>
      </Container>
    </>
  );
}

export default Login;