import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

 const server = "http://localhost:3000"
const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: `${server}/api/v1/` }),
  tagTypes: ["Chat", "User", "Message"],

  endpoints: (builder) => ({
    myChats: builder.query({
      query: () => ({
        url: "chat/my",
        credentials: "include",
      }),
      providesTags: ["Chat"],
    }),
    searchUser: builder.query({
      query: (name) => ({
        url: `user/search?name=${name}`,
        credentials: "include",
      }),
      providesTags: ["User"],
    }),
    sendFriendRequest: builder.mutation({
      query: (data) => ({
        url: "user/sendrequest",
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    acceptFriendRequest: builder.mutation({
      query: (data) => ({
        url: "user/acceptrequest",
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),
    getNotifications: builder.query({
      query: () => ({
        url: "user/notifications",
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
    }),
    chatDetails: builder.query({
      query: ({ chatId, populate = false }) => {
        let url = `chat/${chatId}`;
        if (populate) url += "?populate=true";

        return {
          url,
          credentials: "include",
        };
      },
      providesTags: ["Chat"],
    }),
    getMessages: builder.query({
      query: ({ chatId, page }) => ({
        url: `chat/message/${chatId}?page=${page}}`,
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
    }),

    renameGroup: builder.mutation({
      query: ({ chatId, name }) => ({
        url: `chat/${chatId}`,
        method: "PUT",
        credentials: "include",
        body: { name },
      }),
      invalidatesTags: ["Chat"],
    }),


    
    deleteChat: builder.mutation({
      query: (chatId ) => ({
        url: `chat/${chatId}`,
        method: "DELETE",
        credentials: "include",
       
      }),
      invalidatesTags: ["Chat"],
    }),


    removeGroupMember: builder.mutation({
      query: ({ chatId,userId }) => ({
        url: `chat/removedmembers`,
        method: "PUT",
        credentials: "include",
        body: { chatId,userId },
      }),
      invalidatesTags: ["Chat"],
    }),

    addGroupMember: builder.mutation({
      query: ({ members,chatId }) => ({
        url: `chat/addmembers`,
        method: "PUT",
        credentials: "include",
        body: {members, chatId },
      }),
      invalidatesTags: ["Chat"],
    }),

    sendAttachments: builder.mutation({
      query: (data) => ({
        url: "chat/message",
        method: "POST",
        credentials: "include",
        body: data,
      }),
    }),

    newGroup: builder.mutation({
      query: ({ name, members }) => ({
        url: "chat/new",
        method: "POST",
        credentials: "include",
        body: { name, members },
      }),
      invalidatesTags: ["Chat"],
    }),

    leaveGroup: builder.mutation({
      query: (chatId) => ({
        url: `chat/leave/${chatId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Chat"],
    }),

    availableFriends: builder.query({
      query: (chatId) => {
        let url = `user/friends`;
        if (chatId) url += `?chatId=${chatId}`;

        return {
          url,
          credentials: "include",
        };
      },
      providesTags: ["Chat"],
    }),
    myGroups: builder.query({
      query: () => ({
        url: "chat/my/groups",
        credentials: "include",
      }),
      providesTags: ["Chat"],
    }),
  }),
});
export default api;
export const {
  useGetNotificationsQuery,
  useSendAttachmentsMutation,
  useChatDetailsQuery,
  useAvailableFriendsQuery,
  useLeaveGroupMutation,
  useMyChatsQuery,
  useSendFriendRequestMutation,
  useAcceptFriendRequestMutation,
  useLazySearchUserQuery,
  useDeleteChatMutation,
  useRenameGroupMutation,
  useGetMessagesQuery,
  useRemoveGroupMemberMutation,
  useMyGroupsQuery,
  useNewGroupMutation,
  useAddGroupMemberMutation
} = api;
