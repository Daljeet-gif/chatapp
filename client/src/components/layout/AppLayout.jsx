import { Drawer, Grid, Skeleton } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useErrors, useSocketEvents } from "../../hooks/hook";
import { useMyChatsQuery } from "../../redux/api/api";
import {
  setIsDeleteMenu,
  setIsMobile,
  setSelectedDeleteChat,
} from "../../redux/reducers/misc";
import Title from "../shared/Title";
import ChatList from "../specific/ChatList";
import Profile from "../specific/Profile";
import Header from "./Header";
import { getSocket } from "../../socket";
import {
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
  ONLINE_USERS,
  REFETCH_CHATS,
} from "../../constants/events";
import {
  incrementNotification,
  setNewMessagesAlert,
} from "../../redux/reducers/chat";
import { getOrSaveFromStorage } from "../../lib/features";
import DeleteChatMenu from "../dialogs/DeleteChatMenu";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const params = useParams();
    const chatId = params.chatId;
    const dispatch = useDispatch();
    const deleteMenuAnchor = useRef(null);
    const socket = getSocket();
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { isMobile } = useSelector((state) => state.misc);
    const { user } = useSelector((state) => state.auth);
    const { newMessageAlert } = useSelector((state) => state.chat);
    const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");
    const navigate = useNavigate();
    // console.log("new messsage ALERT", newMessageAlert);

    useErrors([{ isError, error }]);

    useEffect(() => {
      getOrSaveFromStorage({
        key: NEW_MESSAGE_ALERT,
        value: newMessageAlert,
      });
    }, [newMessageAlert]);

    const handleDeleteChat = (e, chatId, groupChat) => {
      dispatch(setIsDeleteMenu(true));
      // dispatch(setSelectedDeleteChat({chatId,groupChat}));
      deleteMenuAnchor.current = e.currentTarget;
    };

    const newMessageAlertListener = useCallback(
      (data) => {
        if (data.chatId === chatId) return;
        dispatch(setNewMessagesAlert(data));
      },
      [chatId]
    );
    const newRequestListener = useCallback(() => {
      dispatch(incrementNotification());
    }, [dispatch]);

    const refecthListener = useCallback(() => {
      refetch();
      navigate("/");
    }, [refetch]);

    const onlineUsersListener=useCallback((data)=>{
      setOnlineUsers(data)
      console.log(data);
      
    })

    const eventHandlers = {
      [NEW_MESSAGE_ALERT]: newMessageAlertListener,
      [NEW_REQUEST]: newRequestListener,
      [REFETCH_CHATS]: refecthListener,
      [ONLINE_USERS]: onlineUsersListener,
    };

    useSocketEvents(socket, eventHandlers);
    const handleMobileClose = () => dispatch(setIsMobile(false));
    return (
      <>
        <Title />
        <Header />

        <DeleteChatMenu
          disptach={dispatch}
          deleteMenuAnchor={deleteMenuAnchor}
        
        ></DeleteChatMenu>

        {isLoading ? (
          <Skeleton></Skeleton>
        ) : (
          <Drawer open={isMobile} onClose={handleMobileClose}>
            <ChatList
              w="70vw"
              chats={data?.chats}
              chatId={chatId}
              newMessagesAlert={newMessageAlert}
              handleDeleteChat={handleDeleteChat}
              onlineUsers={onlineUsers}
            ></ChatList>
          </Drawer>
        )}
        <Grid container height={"calc(100vh - 4rem)"}>
          <Grid
            item
            sm={4}
            md={3}
            sx={{
              display: { xs: "none", sm: "block" },
            }}
            height={"100%"}
          >
            {isLoading ? (
              <Skeleton></Skeleton>
            ) : (
              <ChatList
                chats={data?.chats}
                chatId={chatId}
                newMessagesAlert={newMessageAlert}
                handleDeleteChat={handleDeleteChat}
                onlineUsers={onlineUsers}
                user={user}
              ></ChatList>
            )}
          </Grid>
          <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"}>
            <WrappedComponent {...props} chatId={chatId} user={user} />
          </Grid>

          <Grid
            item
            md={4}
            lg={3}
            height={"100%"}
            sx={{
              display: { xs: "none", md: "block" },
              padding: "2rem",
              bgcolor: "rgba(0,0,0,0.85)",
            }}
          >
            <Profile user={user} />
          </Grid>
        </Grid>
      </>
    );
  };
};

export default AppLayout;
