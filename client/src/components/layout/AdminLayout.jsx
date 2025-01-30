import {
  Box,
  Drawer,
  Grid,
  IconButton,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { grayColor, matBlack } from "../../constants/color";
import {
  Close,
  Dashboard,
  ExitToApp,
  Group,
  ManageAccounts,
  Menu,
  Message,
} from "@mui/icons-material";
import { Link as LinkComponent, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { adminlogout } from "../../redux/thunks/admin";

const Link = styled(LinkComponent)`
  text-decoration: none;
  border-radius: 2rem;
  padding: 1rem 2rem;
  color: black;
  &:hover {
    color: rgba(0, 0, 0, 0.54);
  }
`;

const adminTabs = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <Dashboard></Dashboard>,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: <ManageAccounts></ManageAccounts>,
  },
  {
    name: "Chats",
    path: "/admin/chats",
    icon: <Group></Group>,
  },
  {
    name: "Messages",
    path: "/admin/messages",
    icon: <Message></Message>,
  },
];

const SideBar = ({ w = "100%" }) => {
  const location = useLocation();
  const dispatch=useDispatch()
  const logoutHandler = () => {
  dispatch(adminlogout())
  };
  return (
    <Stack width={w} direction={"column"} p={"3rem"} spacing={"3rem"}>
      <Typography variant="h5" textTransform={"uppercase"}>
        Admin
      </Typography>

      <Stack spacing={"1rem"}>
        {adminTabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            sx={
              location.pathname === tab.path && {
                bgcolor: matBlack,
                color: "white",
                ":hover": { color: "white" },
              }
            }
          >
            <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
              {tab.icon}
              <Typography>{tab.name}</Typography>
            </Stack>
          </Link>
        ))}

        <Link onClick={logoutHandler}>
          <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
            <ExitToApp></ExitToApp>
            <Typography>Logout</Typography>
          </Stack>
        </Link>
      </Stack>
    </Stack>
  );
};

const AdminLayout = ({ children }) => {


  const { isAdmin } = useSelector((state) => state.auth);

  const [isMobile, setIsMobile] = useState(false);
  const handleClose = () => setIsMobile(false);
  const handleMobile = () => setIsMobile(!isMobile);
  if (!isAdmin) return <Navigate to="/admin"></Navigate>;
  return (
    <Grid container minHeight={"100vh"}>
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          position: "fixed",
          right: "1rem",
          top: "1rem",
        }}
      >
        <IconButton onClick={handleMobile}>
          {isMobile ? <Close></Close> : <Menu></Menu>}
        </IconButton>
      </Box>
      <Grid item md={4} lg={3} sx={{ display: { xs: "none", md: "block" } }}>
        <SideBar></SideBar>
      </Grid>
      <Grid
        item
        md={8}
        lg={9}
        xs={12}
        sx={{
          bgcolor: grayColor,
        }}
      >
        {children}
      </Grid>
      <Drawer open={isMobile} onClose={handleClose}>
        <SideBar w="45vw"></SideBar>
      </Drawer>
    </Grid>
  );
};

export default AdminLayout;
