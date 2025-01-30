import { useFileHandler, useInputValidation } from "6pp";
import { CameraAlt } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { VisuallyHiddenInput } from "../components/styles/StyledComponents";
import { bgGradient } from "../constants/color";
import { server } from "../constants/config";
import { userExists } from "../redux/reducers/auth";
import { usernameValidator } from "../utils/Validators";
const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const loginToggle = () => setIsLogin((prev)=>!prev);
  const name = useInputValidation("");
  const username = useInputValidation("",);
  const password = useInputValidation("");
  const bio = useInputValidation("");

  const avatar = useFileHandler("single");
  const dispatch = useDispatch();
  const handleLogin = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Logging In...");
    setIsLoading(true);
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const { data } = await axios.post(
        `http://localhost:3000/api/v1/user/login`,
        {
          username: username.value,
          password: password.value,
        },
        config
      );
      dispatch(userExists(data.user));
      toast.success(data.message, {
        id: toastId,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleRegister = async (e) => {
    
    e.preventDefault();
    const toastId = toast.loading("Signing Up...");
    setIsLoading(true);
    const formData = new FormData();
    formData.append("avatar", avatar.file);
    formData.append("name", name.value);
    formData.append("bio", bio.value);
    formData.append("username", username.value);
    formData.append("password", password.value);

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/new`,
        formData,
        config
      );
      dispatch(userExists(data.user));
      toast.success(data.message, {
        id: toastId,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message, {
        id: toastId,
      }) || "somthing went wrong";
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: bgGradient,
      }}
    >
      <Container
        component={"main"}
        maxWidth="xs"
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {isLogin ? (
            <>
              <Typography variant="h5">LOGIN</Typography>

              <form
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                onSubmit={handleLogin}
              >
                <TextField
                  required
                  fullWidth
                  label="username"
                  type="text"
                  value={username.value}
                  onChange={username.changeHandler}
                  margin="normal"
                  variant="outlined"
                ></TextField>
                {username.error && (
                  <Typography color="error" variant="caption">
                    {username.error}
                  </Typography>
                )}

                <TextField
                  required
                  fullWidth
                  label="password"
                  margin="normal"
                  value={password.value}
                  onChange={password.changeHandler}
                  type="password"
                  variant="outlined"
                ></TextField>
                {password.error && (
                  <Typography color="error" variant="caption">
                    {password.error}
                  </Typography>
                )}
                <Button
                  sx={{ marginTop: "1rem" }}
                  variant="contained"
                  color="primary"
                  fullWidth
                  type="submit"
                  disabled={isLoading}
                >
                  Login
                </Button>
                <Typography textAlign={"center"} m={"1rem"}>
                  OR
                </Typography>

                <Button
                  sx={{
                    marginTop: "1rem",
                  }}
                  fullWidth
                  variant="text"
                  onClick={loginToggle}
                  disabled={isLoading}
                >
                  sign Up
                </Button>
              </form>
            </>
          ) : (
            <>
              <Typography variant="h5">Register</Typography>

              <form
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                onSubmit={handleRegister}
              >
                <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                  <Avatar
                    sx={{
                      width: "10rem",
                      height: "10rem",
                      objectFit: "contain",
                    }}
                    src={avatar.preview}
                  ></Avatar>

                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: "0",
                      right: "0",
                      color: "white",
                      bgcolor: "rgba(0,0,0,0.5)",
                      ":hover": {
                        bgcolor: "rgba(0,0,0,0.7)",
                      },
                    }}
                    component="label"
                  >
                    <>
                      <CameraAlt />
                      <VisuallyHiddenInput
                        type="file"
                        onChange={avatar.changeHandler}
                      />
                    </>
                  </IconButton>
                </Stack>
                {avatar.error && (
                  <Typography color="error" variant="caption">
                    {avatar.error}
                  </Typography>
                )}
                <TextField
                  required
                  fullWidth
                  label="Name"
                  type="text"
                  margin="normal"
                  value={name.value}
                  onChange={name.changeHandler}
                  variant="outlined"
                ></TextField>
                <TextField
                  required
                  fullWidth
                  label="Username"
                  type="text"
                  value={username.value}
                  onChange={username.changeHandler}
                  margin="normal"
                  variant="outlined"
                ></TextField>
                <TextField
                  required
                  fullWidth
                  label="Bio"
                  type="text"
                  value={bio.value}
                  onChange={bio.changeHandler}
                  margin="normal"
                  variant="outlined"
                ></TextField>

                <TextField
                  required
                  fullWidth
                  label="password"
                  margin="normal"
                  value={password.value}
                  onChange={password.changeHandler}
                  type="password"
                  variant="outlined"
                ></TextField>
                <Button
                  sx={{ marginTop: "1rem" }}
                  variant="contained"
                  color="primary"
                  fullWidth
                  type="submit"
                  disabled={isLoading}
                >
                  Sign Up
                </Button>
                <Typography textAlign={"center"} m={"1rem"}>
                  OR
                </Typography>

                <Button
                   disabled={isLoading}
                  sx={{
                    marginTop: "1rem",
                  }}
                  fullWidth
                  variant="text"
                  onClick={loginToggle}
                >
                  sign In
                </Button>
              </form>
            </>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
