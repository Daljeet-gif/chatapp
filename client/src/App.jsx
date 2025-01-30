import React, { Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectRoute from "./components/auth/ProtectRoute";
import { LayoutLoader } from "./components/layout/Loaders";
import axios from "axios";
import { server } from "./constants/config";
import { useDispatch, useSelector } from "react-redux";
import { userExists, userNotExists } from "./redux/reducers/auth";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "./socket";
const Home = React.lazy(() => import("./pages/Home"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Group = React.lazy(() => import("./pages/Group"));
const Chat = React.lazy(() => import("./pages/Chat"));
const Login = React.lazy(() => import("./pages/Login"));
const AdminLogin = React.lazy(() => import("./pages/Admin/AdminLogin"));
const Dashboard = React.lazy(() => import("./pages/Admin/Dashboard"));
const MessageManagement = React.lazy(() =>
  import("./pages/Admin/MessageManagement")
);

const ChatManagement = React.lazy(() => import("./pages/Admin/ChatManagement"));
const UserManagement = React.lazy(() => import("./pages/Admin/UserManagement"));

function App() {
  const { user, loader } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    axios
      .get(`${server}/api/v1/user/me`, { withCredentials: true })
      .then(({ data }) => dispatch(userExists(data.user)))
      .catch((err) => dispatch(userNotExists()));
  }, []);
  return loader ? (
    <div>Loading</div>
  ) : (
    <BrowserRouter>
      <Suspense fallback={<LayoutLoader></LayoutLoader>}>
        <Routes>
          <Route
            element={
              <SocketProvider>
                <ProtectRoute user={user}></ProtectRoute>
              </SocketProvider>
            }
          >
            <Route path="/" element={<Home></Home>}></Route>
            <Route path="/Group" element={<Group></Group>}></Route>
            <Route path="/chat/:chatId" element={<Chat></Chat>}></Route>
          </Route>
          <Route
            path="/login"
            element={
              <ProtectRoute user={!user} redirect="/">
                <Login></Login>
              </ProtectRoute>
            }
          ></Route>

          <Route path="/admin" element={<AdminLogin></AdminLogin>}></Route>
          <Route
            path="/admin/dashboard"
            element={<Dashboard></Dashboard>}
          ></Route>
          <Route
            path="/admin/users"
            element={<UserManagement></UserManagement>}
          ></Route>
          <Route
            path="/admin/chats"
            element={<ChatManagement></ChatManagement>}
          ></Route>
          <Route
            path="/admin/messages"
            element={<MessageManagement></MessageManagement>}
          ></Route>

          <Route path="*" element={<NotFound></NotFound>}></Route>
        </Routes>
      </Suspense>
      <Toaster position="bottom-center"></Toaster>
    </BrowserRouter>
  );
}

export default App;
