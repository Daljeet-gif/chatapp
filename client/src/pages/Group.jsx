import {
  Add,
  Delete,
  Done,
  Edit,
  Flag,
  KeyboardBackspace,
  Menu,
  StackedBarChart,
} from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Button,
  Drawer,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { lazy, memo, Suspense, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { bgGradient, matBlack } from "../constants/color";
import AvatarCard from "../components/shared/AvatarCard";
import { samepleChats, sampleUsers } from "../constants/sampleData";
import UserItems from "../components/shared/UserItems";
import {
  useAddGroupMemberMutation,
  useChatDetailsQuery,
  useDeleteChatMutation,
  useMyGroupsQuery,
  useRemoveGroupMemberMutation,
  useRenameGroupMutation,
} from "../redux/api/api";
import { useAsyncMutation, useErrors } from "../hooks/hook";
import { LayoutLoader } from "../components/layout/Loaders";
import { useDispatch, useSelector } from "react-redux";
import { setIsAddMember } from "../redux/reducers/misc";

const ConfirmDeleteDialog = lazy(() =>
  import("../components/dialogs/ConfirmDeleteDialog")
);
const AddMemberDialog = lazy(() =>
  import("../components/dialogs/AddMemberDialog")
);

const Group = () => {
  const navigate = useNavigate();

  const { isAddMember } = useSelector((state) => state.misc);
  const chatId = useSearchParams()[0].get("group");

  const dispatch = useDispatch();
  const myGroups = useMyGroupsQuery("");

  const groupDetails = useChatDetailsQuery(
    { chatId, populate: true },
    { skip: !chatId }
  );
  console.log(groupDetails.data);

  const navigateBack = () => {
    navigate("/");
  };

  const [updateGroup, isLoadingGroupName] = useAsyncMutation(
    useRenameGroupMutation
  );

  const [removeMember, isLoadingRemoveMember] = useAsyncMutation(
    useRemoveGroupMemberMutation
  );

  const [deleteGroup, isLoadingdeleteGroup] = useAsyncMutation(
    useDeleteChatMutation
  );

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupNameUpdatedValue, setgroupNameUpdatedValue] = useState("");
  const [confirmDeleteDialog, setconfirmDeleteDialog] = useState(false);

  const errors = [
    { isError: myGroups.isError, error: myGroups.error },
    { isError: groupDetails.isError, error: groupDetails.error },
  ];
  useErrors(errors);

  console.log("info", groupDetails);
  const [members, setMembers] = useState([]);
  useEffect(() => {
    if (groupDetails.data) {
      setGroupName(groupDetails?.data?.chat?.name);
      setgroupNameUpdatedValue(groupDetails?.data?.chat?.name);
      setMembers(groupDetails?.data?.chat?.members);
    }

    return () => {
      setGroupName(""), setgroupNameUpdatedValue(""), setMembers([]);
      setIsEdit(false);
    };
  }, [groupDetails.data]);
  const handlerMobile = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const updateGroupName = () => {
    setIsEdit(false);
    updateGroup("Updating Group Name..", {
      chatId,
      name: groupNameUpdatedValue,
    });
  };
  const openconfirmDeleteHandler = () => {
    setconfirmDeleteDialog(true);
    console.log("delete member");
  };

  const closeconfirmDeleteHandler = () => {
    setconfirmDeleteDialog(false);
  };
  const openAddmemberHandler = () => {
    dispatch(setIsAddMember(true));
  };

  const deleteHandler = () => {
    deleteGroup("Delete Group.." ,chatId)
    closeconfirmDeleteHandler();
    navigate("/")
  };

  const removeMemberHandler = (userId) => {
    removeMember("Removing Member....", { chatId, userId });
  };
  const [isEdit, setIsEdit] = useState(false);
  const handleMobileClose = () => setIsMobileMenuOpen(false);
  const IconBtns = (
    <>
      <Box>
        <IconButton
          onClick={handlerMobile}
          sx={{
            display: {
              xs: "block",
              sm: "none",
              position: "fixed",
              right: "1rem",
              top: "2rem",
            },
          }}
        >
          <Menu></Menu>
        </IconButton>
      </Box>
      <Tooltip title="back">
        <IconButton
          sx={{
            position: "absolute",
            top: "2rem",
            left: "2rem",
            bgcolor: matBlack,
            color: "white",
            ":hover": {
              bgcolor: "rgba(0,0,0,0.7)",
            },
          }}
          onClick={navigateBack}
        >
          <KeyboardBackspace></KeyboardBackspace>
        </IconButton>
      </Tooltip>
    </>
  );

  const GroupName = (
    <Stack
      direction={"row"}
      alignItems={"center"}
      justifyContent={"center"}
      spacing={"1rem"}
      padding={"3rem"}
    >
      {isEdit ? (
        <>
          <TextField
            value={groupNameUpdatedValue}
            onChange={(e) => setgroupNameUpdatedValue(e.target.value)}
          ></TextField>
          <IconButton onClick={updateGroupName} disabled={isLoadingGroupName}>
            <Done></Done>
          </IconButton>
        </>
      ) : (
        <>
          <Typography variant="h4">{groupName}</Typography>
          <IconButton onClick={() => setIsEdit(true)}>
            <Edit></Edit>
          </IconButton>
        </>
      )}
    </Stack>
  );

  const buttonGroup = (
    <Stack
      direction={{
        xs: "column-reverse",
        sm: "row",
      }}
      spacing={"1rem"}
      p={{
        xs: "0",
        sm: "1rem",
        md: "1rem 4rem",
      }}
    >
      <Button
        size="large"
        color="error"
        startIcon={<Delete></Delete>}
        onClick={openconfirmDeleteHandler}
      >
        Delete Group
      </Button>
      <Button
        size="large"
        variant="contained"
        startIcon={<Add></Add>}
        onClick={openAddmemberHandler}
      >
        Add member
      </Button>
    </Stack>
  );

  useEffect(() => {
    if (chatId) {
      setGroupName(`Group Name ${chatId}`);
      setgroupNameUpdatedValue(`Group Name ${chatId}`);
    }

    return () => {
      setGroupName("");
      setgroupNameUpdatedValue("");
      setIsEdit(false);
    };
  }, [chatId]);
  return myGroups.isLoading ? (
    <LayoutLoader></LayoutLoader>
  ) : (
    <Grid container height={"100vh"}>
      <Grid
        item
        sx={{
          display: {
            xs: "none",
            sm: "block",
          },
          backgroundImage: bgGradient,
        }}
        sm={4}
      >
        <GroupList
          myGroups={myGroups?.data?.groups}
          chatId={chatId}
        ></GroupList>
      </Grid>
      <Grid
        item
        xs={12}
        sm={8}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          padding: "1rem 3rem",
        }}
      >
        {IconBtns}
        {GroupName && (
          <>
            {GroupName}

            <Typography margin={"2rem"} alignSelf={"center"} variant="body1">
              Members
            </Typography>
            <Stack
              maxWidth={"45rem"}
              width={"100%"}
              boxSizing={"border-box"}
              padding={{
                sm: "1rem",
                xs: "0",
                md: "1rem 4rem",
              }}
              spacing={"2rem"}
              height={"50vh"}
              overflow={"auto"}
            >
              {isLoadingRemoveMember ? (
                <Skeleton></Skeleton>
              ) : (
                members.map((i) => (
                  <UserItems
                    user={i}
                    isAdded
                    styling={{
                      boxShadow: "0 0 0.5rem  rgba(0,0,0,0.2)",
                      padding: "1rem 2rem",
                      borderRadius: "1rem",
                    }}
                    handler={removeMemberHandler}
                  />
                ))
              )}
            </Stack>
            {buttonGroup}
          </>
        )}
      </Grid>

      {isAddMember && (
        <>
          <Suspense fallback={<Backdrop open></Backdrop>}>
            <AddMemberDialog chatId={chatId}></AddMemberDialog>
          </Suspense>
        </>
      )}
      {confirmDeleteDialog && (
        <>
          <Suspense fallback={<Backdrop open></Backdrop>}>
            <ConfirmDeleteDialog
              open={confirmDeleteDialog}
              handleClose={closeconfirmDeleteHandler}
              deleteHandler={deleteHandler}
            ></ConfirmDeleteDialog>
          </Suspense>
        </>
      )}

      <Drawer
        sx={{
          display: {
            xs: "block",
            sm: "none",
          },
        }}
        open={isMobileMenuOpen}
        onClose={handleMobileClose}
      >
        <GroupList
          w={"50vw"}
          myGroups={myGroups?.data?.groups}
          chatId={chatId}
        ></GroupList>
      </Drawer>
    </Grid>
  );
};

const GroupList = ({ w = "100%", myGroups = [], chatId }) => (
  <Stack
    width={w}
    sx={{
      backgroundImage: bgGradient,
      height: "100vh",
      overflow: "auto",
    }}
  >
    {myGroups.length > 0 ? (
      myGroups.map((group) => (
        <GroupListItem
          group={group}
          chatId={chatId}
          key={group._id}
        ></GroupListItem>
      ))
    ) : (
      <Typography textAlign={"center"} padding="1rem">
        No Groups
      </Typography>
    )}
  </Stack>
);
const GroupListItem = memo(({ group, chatId }) => {
  const { name, avatar, _id } = group;

  return (
    <Link
      to={`?group=${_id}`}
      onClick={(e) => {
        if (chatId === _id) e.preventDefault();
      }}
    >
      <Stack
        direction={"row"}
        padding={"1rem"}
        spacing={"1rem"}
        alignItems={"center"}
      >
        <AvatarCard avatar={avatar} />
        <Typography>{name}</Typography>
      </Stack>
    </Link>
  );
});

export default Group;
