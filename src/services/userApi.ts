import apiSlice from "./apiSlice";

interface ApiResponse {
  success: boolean;
  status: string;
  message: string;
  data?: any;
}

interface RegisterRequest {
  username: string;
  password: string;
  confirmPassword: string;
  bio: string;
  profilePicture: string;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation<ApiResponse, RegisterRequest>({
      query: (userData) => ({
        url: "users",
        method: "POST",
        body: userData,
      }),
    }),
    me: builder.query<ApiResponse, void>({
      query: () => ({
        url: "users/me",
        method: "GET",
      }),
    }),
    checkRegistrationStatus: builder.query<any, void>({
      query: () => ({
        url: `/auth/registration-status`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useMeQuery,
  useCheckRegistrationStatusQuery,
} = authApi;
