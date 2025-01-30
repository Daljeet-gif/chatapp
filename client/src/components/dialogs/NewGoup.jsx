import { useInputValidation } from "6pp";
import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { sampleUsers } from "../../constants/sampleData";
import UserItems from "../shared/UserItems";
import { useDispatch, useSelector } from "react-redux";
import {
  useAvailableFriendsQuery,
  useNewGroupMutation,
} from "../../redux/api/api";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import { LayoutLoader } from "../layout/Loaders";
import { setIsNewGroup } from "../../redux/reducers/misc";
import toast from "react-hot-toast";
const NewGoup = () => {
  const { isNewGroup } = useSelector((state) => state.misc);
  const dispatch = useDispatch();

  const [selectedMembers, setselectedMembers] = useState([]);

  const { isError, error, isLoading, data } = useAvailableFriendsQuery();
  const [newGroup, isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation);

  const submithandler = () => {
    if (!groupName.value) return toast.error("Group name is required");

    if (selectedMembers.length < 2)
      return toast.error("Please select atleast 3 members");

    newGroup("creating New Group",{ name: groupName.value, members: selectedMembers });
  };
  const groupName = useInputValidation("");
  const SelectMemberHandler = (id) => {
    setselectedMembers((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
  const closeHandler = () => {
    dispatch(setIsNewGroup(false));
  };
  console.log(selectedMembers);
  const errors = [
    {
      isError,
      error,
    },
  ];
  useErrors(errors);
  return (
    <Dialog open={isNewGroup} onClose={closeHandler}>
      <Stack
        p={{ xs: "1rem", sm: "2rem" }}
        borderRadius={"11px"}
        maxWidth={"25rem"}
      >
        <DialogTitle>New Group</DialogTitle>
        <TextField
          label="Group Name"
          value={groupName.value}
          onChange={groupName.changeHandler}
        ></TextField>
        <Typography variant="body1">Members</Typography>
        <Stack>
          {isLoading ? (
            <Skeleton></Skeleton>
          ) : (
            data?.friends.map((i) => (
              <UserItems
                user={i}
                key={i._id}
                handler={SelectMemberHandler}
                isAdded={selectedMembers.includes(i._id)}
              ></UserItems>
            ))
          )}
        </Stack>
        <Stack direction={"row"} justifyContent={"space-evenly"}>
          <Button
            variant="text"
            color="error"
            size="large"
            onClick={closeHandler}
          >
            Cancel
          </Button>
          <Button variant="contained" size="large" disabled={isLoadingNewGroup} onClick={submithandler}>
            Create
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default NewGoup;
