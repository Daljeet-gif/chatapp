import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { sampleUsers } from "../../constants/sampleData";
import UserItems from "../shared/UserItems";
import { useDispatch, useSelector } from "react-redux";
import { setIsAddMember } from "../../redux/reducers/misc";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import {
  useAddGroupMemberMutation,
  useAvailableFriendsQuery,
} from "../../redux/api/api";

const AddMemberDialog = ({ chatId }) => {
  const dispatch = useDispatch();
  const { isAddMember } = useSelector((state) => state.misc);
  const { isLoading, data, isError, error } = useAvailableFriendsQuery(chatId);

  const [addMembers, isLoadingAddMembers] = useAsyncMutation(
    useAddGroupMemberMutation
  );

  const [selectedMembers, setSelectedMembers] = useState([]);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((current) => current !== id)
        : [...prev, id]
    );
  };
  const closeHandler = () => {
    dispatch(setIsAddMember(false));
  };

  const addMemberSubmitHandler = () => {
    addMembers("Adding Members...", {
      members: selectedMembers,
      chatId,
    });

    console.log(selectedMembers, chatId);

    closeHandler();
  };

  useErrors([{ isError, error }]);

  return (
    <Dialog open={isAddMember} onClose={closeHandler}>
      <Stack p={"2rem"} width={"20rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"}>Add Member</DialogTitle>
        <Stack spacing={"1rem"}>
          {isLoading ? (
            <Skeleton></Skeleton>
          ) : data?.friends?.length > 0 ? (
            data?.friends?.map((i) => (
              <UserItems
                key={i._id}
                user={i}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(i._id)}
              ></UserItems>
            ))
          ) : (
            <Typography textAlign={"center"}>No Friends</Typography>
          )}
        </Stack>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-evenly"}
        >
          <Button color="error" onClick={closeHandler}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={addMemberSubmitHandler}
            disabled={isLoadingAddMembers}
          >
            Submit Changes
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default AddMemberDialog;
