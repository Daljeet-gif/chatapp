import {
  AppBar,
  Backdrop,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { lazy, Suspense, useState } from "react";
import { orange } from "../../constants/color";
import {
  Add as AddIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userNotExists } from "../../redux/reducers/auth";
import axios from "axios";
import toast from "react-hot-toast";
import { server } from "../../constants/config";
import { setIsMobile, setIsNewGroup, setIsNotification, setIsSearch } from "../../redux/reducers/misc";
import { resetNotification } from "../../redux/reducers/chat";

const SearchDialog = lazy(() => import("../specific/Search"));
const NotificationDialog = lazy(() => import("../specific/Notification"));
const NewGroupDialog = lazy(() => import("../dialogs/NewGoup"));
const Header = () => {
  const navigate = useNavigate();

  const { isSearch,isNotification,isNewGroup } = useSelector((state) => state.misc);
  const { notificationCount } = useSelector((state) => state.chat);


 
  const dispatch = useDispatch();


  const handleMobile = () => dispatch(setIsMobile(true));
  
  const openSearchDialog = () => dispatch(setIsSearch(true))

  
  const LogoutHandler = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, {
        withCredentials: true,
      });
      dispatch(userNotExists());
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Somthing went wrong");
    }
  };
  const openNewGroup = () => {
   dispatch(setIsNewGroup(true))
  };
  const NavigateToGroup = () => navigate("/Group");

  
  const openNotification = () => {
   dispatch(setIsNotification(true))
   dispatch(resetNotification())
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }} height={"4rem"}>
        <AppBar
          position="static"
          sx={{
            bgcolor: orange,
          }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              Chattu
            </Typography>
            <Box sx={{ display: { xs: "block", sm: "none" } }}>
              <IconButton color="inherit" onClick={handleMobile}>
                <MenuIcon></MenuIcon>
              </IconButton>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
              }}
            ></Box>
            <Box>
              <IconBtn
                title={"Search"}
                icon={<SearchIcon></SearchIcon>}
                onClick={openSearchDialog}
              ></IconBtn>
              <IconBtn
                title={"New Group"}
                icon={<AddIcon></AddIcon>}
                onClick={openNewGroup}
              ></IconBtn>
              <IconBtn
                title={"Manage Groups"}
                icon={<GroupIcon></GroupIcon>}
                onClick={NavigateToGroup}
              ></IconBtn>
              <IconBtn
                title={"Notification"}
                icon={<NotificationsIcon></NotificationsIcon>}
                onClick={openNotification}
                value={notificationCount}
              ></IconBtn>
              <IconBtn
                title={"Logout"}
                icon={<LogoutIcon></LogoutIcon>}
                onClick={LogoutHandler}
              ></IconBtn>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>

      {isSearch && (
        <Suspense fallback={<Backdrop open />}>
          <SearchDialog></SearchDialog>
        </Suspense>
      )}
      {isNotification && (
        <Suspense fallback={<Backdrop open />}>
          <NotificationDialog></NotificationDialog>
        </Suspense>
      )}
      {isNewGroup && (
        <Suspense fallback={<Backdrop open />}>
          <NewGroupDialog></NewGroupDialog>
        </Suspense>
      )}
    </>
  );
};

const IconBtn = ({ title, icon, onClick, value }) => {
  return (
    <Tooltip title={title}>
      <IconButton color="inherit" size="large" onClick={onClick}>
        {value ? (
          <Badge badgeContent={value} color="error">
            {icon}
          </Badge>
        ) : (
          icon
        )}
      </IconButton>
    </Tooltip>
  );
};

export default Header;
