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
  content?: string;
  images?: string[];
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
        url: "posts",
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

    updatePost: builder.mutation<ApiResponse, UpdatePostRequest>({
      query: ({ postId, ...updateData }) => ({
        url: `posts/${postId}`,
        method: "PATCH",
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
  useDeletePostMutation,
} = postApi;
