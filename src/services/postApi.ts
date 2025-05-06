import apiSlice from "./apiSlice";

interface ApiResponse {
  success: boolean;
  status: string;
  message: string;
  data?: any;
}

interface PostRequest {
  text: string;
  imageUrls?: string[];
}

interface UpdatePostRequest {
  postId: string;
  text?: string;
  imageUrls?: string[];
}

export const postApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPost: builder.mutation<ApiResponse, PostRequest>({
      query: (postData) => ({
        url: "posts",
        method: "POST",
        body: postData,
      }),
      invalidatesTags: ["Posts"],
    }),

    getPosts: builder.query<ApiResponse, void>({
      query: () => ({
        url: "posts/feed",
        method: "GET",
      }),
      providesTags: ["Posts"],
    }),

    getPostById: builder.query<ApiResponse, string>({
      query: (postId) => ({
        url: `posts/${postId}`,
        method: "GET",
      }),
    }),

    getMyPosts: builder.query<ApiResponse, void>({
      query: () => ({
        url: "posts/my-feeds", // your backend should handle this route to return posts for the logged-in user
        method: "GET",
      }),
      providesTags: ["Posts"],
    }),
    hidePost: builder.mutation<ApiResponse, string>({
      query: (postId) => ({
        url: `posts/hide/${postId}`,
        method: "PUT"
      }),
      invalidatesTags: ["Posts"],
    }),

    updatePost: builder.mutation<ApiResponse, UpdatePostRequest>({
      query: ({ postId, ...updateData }) => ({
        url: `posts/${postId}`,
        method: "PUT",
        body: updateData,
      }),
      invalidatesTags: ["Posts"],
    }),

    deletePost: builder.mutation<ApiResponse, string>({
      query: (postId) => ({
        url: `posts/${postId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Posts"],
    }),
  }),
});

export const {
  useCreatePostMutation,
  useGetPostsQuery,
  useGetPostByIdQuery,
  useUpdatePostMutation,
  useGetMyPostsQuery,
  useDeletePostMutation,
  useHidePostMutation
} = postApi;
