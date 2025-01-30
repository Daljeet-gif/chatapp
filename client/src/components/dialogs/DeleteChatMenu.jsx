import { Delete, ExitToApp } from "@mui/icons-material";
import { Menu, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setIsDeleteMenu } from "../../redux/reducers/misc";
import { useDeleteChatMutation, useLeaveGroupMutation } from "../../redux/api/api";
import { useAsyncMutation } from "../../hooks/hook";

const DeleteChatMenu = ({ disptach, deleteMenuAnchor }) => {
  const navigate = useNavigate();
  const { isDeleteMenu, selectedDeleteChat } = useSelector(
    (state) => state.misc
  );
  const [deleteChat, _, deleteChatData] = useAsyncMutation(
    useDeleteChatMutation
  );

  const [leaveGroup, __, leaveGroupData] = useAsyncMutation(
    useLeaveGroupMutation
  );

  console.log(selectedDeleteChat.groupChat);

  const closeHandler = () => {
    disptach(setIsDeleteMenu(false));
    deleteMenuAnchor.current = null;
  };

  const isGroup=selectedDeleteChat.groupChat

  const leaveGroupHandler = () => {    closeHandler();
    leaveGroup("Leaving Group...", selectedDeleteChat.chatId);};

  const deleteChatHandler = () => { closeHandler();
    deleteChat("Deleting Chat...", selectedDeleteChat.chatId);};

  useEffect(() => {
    if (deleteChatData || leaveGroupData) navigate("/");
  }, [deleteChatData, leaveGroupData]);

  return (
    <Menu
    open={isDeleteMenu}
    onClose={closeHandler}
    anchorEl={deleteMenuAnchor.current}

      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "center",
        horizontal: "center",
      }}
   
    >
      <Stack
        sx={{
          width: "10rem",
          padding: "0.5rem",
          cursor: "pointer",
        }}
        direction={"row"}
        alignItems={"center"}
        spacing={"0.5rem"}
        onClick={isGroup ? leaveGroupHandler : deleteChatHandler}
      >
        {isGroup ? (
          <>
            <ExitToApp></ExitToApp>
            <Typography>Leave Group</Typography>
          </>
        ) : (
          <>
            <Delete></Delete>
            <Typography>Delete Chat</Typography>
          </>
        )}
      </Stack>
    </Menu>
  );
};

export default DeleteChatMenu;
