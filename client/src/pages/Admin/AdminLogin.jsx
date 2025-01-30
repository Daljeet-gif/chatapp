import { useInputValidation } from "6pp";
import { Button, Container, Paper, TextField, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { bgGradient } from "../../constants/color";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin, getAdmin } from "../../redux/thunks/admin";

const AdminLogin = () => {
  const { isAdmin } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const secretkey = useInputValidation("");

  const submithandler = (e) => {
    e.preventDefault();

    dispatch(adminLogin(secretkey.value));
  };
 
  

  useEffect(() => {
    dispatch(getAdmin());
  }, [dispatch]);

  if (isAdmin) return <Navigate to="/admin/dashboard"></Navigate>;
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
          <>
            <Typography variant="h5"> Admin LOGIN</Typography>

            <form
              style={{
                width: "100%",
                marginTop: "1rem",
              }}
              onSubmit={submithandler}
            >
              <TextField
                required
                fullWidth
                label="admin key"
                type="text"
                value={secretkey.value}
                onChange={secretkey.changeHandler}
                margin="normal"
                variant="outlined"
              ></TextField>
              {secretkey.error && (
                <Typography color="error" variant="caption">
                  {secretkey.error}
                </Typography>
              )}

              <Button
                sx={{ marginTop: "1rem" }}
                variant="contained"
                color="primary"
                fullWidth
                type="submit"
              >
                Login
              </Button>
            </form>
          </>
        </Paper>
      </Container>
    </div>
  );
};

export default AdminLogin;
