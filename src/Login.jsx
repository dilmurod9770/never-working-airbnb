import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import {
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router";
import { useAuth } from "./useAuth";
import { useState } from "react";

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      user {
        id
        name
        email
      }
    }
  }
`;

function Login() {
  const navigate = useNavigate();
  const { setAccessToken, setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginUser, { loading }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      setAccessToken(data.login.accessToken);
      setUser(data.login.user);
      navigate("/");
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    loginUser({
      variables: {
        email,
        password,
      },
    });
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: { xs: 4, sm: 8 },
        px: { xs: 2, sm: 3 },
      }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontSize: { xs: "28px", sm: "34px" },
        }}
      >
        Login
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Gmail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />

          <TextField
            label="Password"
            type="number"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            fullWidth
          >
            {loading ? "Loading..." : "Sign In"}
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
      </form>
    </Container>
  );
}

export default Login;