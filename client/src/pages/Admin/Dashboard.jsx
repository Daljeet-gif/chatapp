import React from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import {
  Box,
  Container,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import {
  AdminPanelSettings,
  Group,
  Message,
  NotificationAdd,
  Person,
} from "@mui/icons-material";
import moment from "moment";
import {
  CurveButton,
  SearchField,
} from "../../components/styles/StyledComponents";
import { matBlack } from "../../constants/color";
import { DoughnutChart, LineChart } from "../../components/specific/Charts";
import { useFetchData } from "6pp";
import { server } from "../../constants/config";
import { useErrors } from "../../hooks/hook";
const Dashboard = () => {
  const { loading, data, error } = useFetchData(
    `${server}/api/v1/admin/stats`,
    "dashboard-stats"
  );

  const { stats } = data || {};

  useErrors([{ isError: error, error: error }]);

  const Appbar = (
    <Paper
      elevation={3}
      sx={{ padding: "2rem", margin: "2rem 0", borderRadius: "1rem" }}
    >
      <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
        <AdminPanelSettings sx={{ fontSize: "3rem" }}></AdminPanelSettings>

        <SearchField></SearchField>
        <CurveButton>Search</CurveButton>
        <Box flexGrow={1}></Box>
        <Typography
          display={{
            xs: "none",
            lg: "block",
          }}
          color={"rgba(0,0,0,0.7)"}
          textAlign={"center"}
        >
          {moment().format("MMMM DO YYYY")}
        </Typography>
        <NotificationAdd></NotificationAdd>
      </Stack>
    </Paper>
  );

  const Widgets = (
    <Stack
      direction={{
        xs: "column",
        sm: "row",
      }}
      justifyContent="space-between"
      alignItems={"center"}
      margin={"2rem 0"}
    >
      <Widget
        title={"users"}
        value={stats?.usersCount}
        Icon={<Person></Person>}
      ></Widget>
      <Widget
        title={"Chats"}
        value={stats?.totalChatsCount}
        Icon={<Group></Group>}
      ></Widget>
      <Widget
        title={"Message"}
        value={stats?.messagesCount}
        Icon={<Message></Message>}
      ></Widget>
    </Stack>
  );
  return (
    <AdminLayout>
      {loading ? (
        <Skeleton></Skeleton>
      ) : (
        <Container component={"main"}>
          {Appbar}

          <Stack
            direction={{
              xs: "column",
              lg: "row",
            }}
            flexWrap={"wrap"}
            justifyContent={"center"}
            alignItems={{
              xs: "center",
              lg: "stretch",
            }}
            sx={{ gap: "2rem" }}
          >
            <Paper
              elevation={3}
              sx={{
                padding: "2rem 3.5rem",
                borderRadius: "1rem",
                width: "100%",
                maxWidth: "45rem",
              }}
            >
              <Typography margin={"2rem 0"} variant="h4">
                Last Message
              </Typography>
              <LineChart value={stats?.messagesChart}> </LineChart>
            </Paper>

            <Paper
              elevation={3}
              sx={{
                padding: "1rem",
                borderRadius: "1rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: { xs: "100%", sm: "50%" },
                position: "relative",
                maxWidth: "25rem",
              }}
            >
              <DoughnutChart
                labels={["single Chats", "Group chats"]}
                value={[
                  stats?.totalChatsCount - stats?.groupsCount || 0,
                  stats?.groupsCount || 0,
                ]}
              ></DoughnutChart>
              <Stack
                position={"absolute"}
                direction={"row"}
                justifyContent={"center"}
                alignItems={"center"}
                spacing={"0.5rem"}
                width={"100%"}
                height={"100%"}
              >
                <Group></Group>
                <Typography>Vs</Typography>
                <Person></Person>
              </Stack>
            </Paper>
          </Stack>

          {Widgets}
        </Container>
      )}
    </AdminLayout>
  );
};

const Widget = ({ title, value, Icon }) => (
  <Paper
    sx={{
      padding: "2rem",
      margin: "2rem 0",
      borderRadius: "1rem",
      width: "20rem",
    }}
  >
    <Stack alignItems={"center"} spacing={"1rem"}>
      <Typography
        sx={{
          color: "rgba(0,0,0,0.7)",
          borderRadius: "50%",
          border: `5px solid ${matBlack}`,
          width: "5rem",
          height: "5rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {value}
      </Typography>
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        {Icon}
        <Typography>{title}</Typography>
      </Stack>
    </Stack>
  </Paper>
);

export default Dashboard;
