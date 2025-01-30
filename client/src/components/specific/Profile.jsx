import { Avatar, Stack, Typography } from "@mui/material";
import React from "react";
import moment from "moment";
import {
  Face as FaceIcon,
  AlternateEmail as UsernameIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
import { transformImage } from "../../lib/features";
const Profile = ({ user }) => {
  return (
    <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
      <Avatar
        src={transformImage(user?.avatar?.url)}
        sx={{
          width: 200,
          height: 200,
          objectFit: "contain",
          marginBottom: "1rem",
          border: "5px solid white",
        }}
      ></Avatar>
      <ProfileCard heading={"Bio"} text={user?.bio}></ProfileCard>
      <ProfileCard
        heading={"Username"}
        text={user?.username}
        icon={<UsernameIcon></UsernameIcon>}
      ></ProfileCard>
      <ProfileCard
        heading={"Name"}
        text={user?.name}
        icon={<FaceIcon></FaceIcon>}
      ></ProfileCard>
      <ProfileCard
        heading={"Joined"}
        text={moment(user?.createdAt).fromNow()}
        icon={<CalendarIcon></CalendarIcon>}
      ></ProfileCard>
    </Stack>
  );
};

const ProfileCard = ({ text, icon, heading }) => (
  <Stack
    direction={"row"}
    alignItems={"center"}
    spacing={"1rem"}
    color={"white"}
    textAlign={"center"}
  >
    {icon && icon}
    <Stack>
      <Typography variant="body1"> {text}</Typography>
      <Typography variant="caption" color={"grey"}>
        {heading}
      </Typography>
    </Stack>
  </Stack>
);

export default Profile;
