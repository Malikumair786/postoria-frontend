import apiSlice from "./apiSlice";

interface ApiResponse {
  success: boolean;
  status: string;
  message: string;
  data: any;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse, { username: string; password: string }>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ['User', "Posts"],
    }),
  }),
});

export const {
  useLoginMutation
} = authApi;