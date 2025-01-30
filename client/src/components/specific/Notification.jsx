import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  ListItem,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import React, { memo } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useErrors } from "../../hooks/hook";
import {
  useAcceptFriendRequestMutation,
  useGetNotificationsQuery,
} from "../../redux/api/api";
import { setIsNotification } from "../../redux/reducers/misc";
const Notification = () => {
  const dispatch = useDispatch();

  const { isLoading, data, error, isError } = useGetNotificationsQuery();

  const [acceptRequest] = useAcceptFriendRequestMutation();
  const { isNotification } = useSelector((state) => state.misc);
  const friendrequestHandler = async ({ _id, accept }) => {

    dispatch(setIsNotification(false))
    try {
      const res = await acceptRequest({ requestId: _id, accept });

      if (res.data?.success) {
        console.log("Use socket here");
        toast.success(res.data.message);
      } else {
        toast.error(res.data.error || "something went wrong");
      }
    } catch (error) {
      toast.error(error.message || "something went wrong");
      console.log(error);
    }
  };

  const closeHandler = () => dispatch(setIsNotification(false));
  useErrors([{ error, isError }]);

  return (
    <Dialog open={isNotification} onClose={closeHandler}>
      <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"}>
        <DialogTitle>Notification</DialogTitle>
        {isLoading ? (
          <Skeleton></Skeleton>
        ) : (
          <>
            {data?.allRequests.length > 0 ? (
              data?.allRequests.map((i) => (
                <NotificationItem
                  sender={i.sender}
                  _id={i._id}
                  handler={friendrequestHandler}
                  key={i._id}
                ></NotificationItem>
              ))
            ) : (
              <Typography textAlign={"center"}>No Notification</Typography>
            )}
          </>
        )}
      </Stack>
    </Dialog>
  );
};

const NotificationItem = memo(({ sender, _id, handler }) => {
  const { name, avatar } = sender;
  return (
    <ListItem>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
      >
        <Avatar src={avatar}></Avatar>
        <Typography
          variant="body1"
          sx={{
            flexGlow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
          }}
        >
          {`${name}`}
        </Typography>

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
        >
          <Button onClick={() => handler({ _id, accept: true })}>Accept</Button>
          <Button color="error" onClick={() => handler({ _id, accept: false })}>
            Reject
          </Button>
        </Stack>
      </Stack>
    </ListItem>
  );
});

export default Notification;
