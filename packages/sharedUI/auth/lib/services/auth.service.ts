import axios from "axios";

// 🟢 Wrap the service in a function that receives apiUrl
export const getAuthService = (apiUrl: string) => ({
          login: async (email: string, password: string, role: string) => {
                    try {
                              // 🟢 2. Payload mein { email, password, role } bhejein
                              const response = await axios.post(`${apiUrl}/login`, { email, password, role });
                              return response.data;
                    } catch (error: any) {
                              throw error.response?.data?.message || "Login failed. Please try again.";
                    }
          },

          register: async (userData: any) => {
                    try {
                              const response = await axios.post(`${apiUrl}/register`, userData);
                              return response.data;
                    } catch (error: any) {
                              throw error.response?.data?.message || "Registration failed.";
                    }
          },

          verify2FA: async (userId: string, code: string) => {
                    try {
                              const response = await axios.post(`${apiUrl}/verify-2fa`, { userId, code });
                              return response.data;
                    } catch (error: any) {
                              throw error.response?.data?.message || "Invalid 2FA code.";
                    }
          },

          setup2FA: async (userId: string) => {
                    try {
                              const response = await axios.post(`${apiUrl}/setup-2fa`, { userId });
                              return response.data;
                    } catch (error: any) {
                              throw error.response?.data?.message || "Failed to setup 2FA.";
                    }
          },

          forgotPassword: async (email: string) => {
                    try {
                              const response = await axios.post(`${apiUrl}/forgot-password`, { email });
                              return response.data;
                    } catch (error: any) {
                              throw error.response?.data?.message || "Failed to send reset token.";
                    }
          },

          resetPassword: async (token: string, newPassword: string) => {
                    try {
                              const response = await axios.post(`${apiUrl}/reset-password`, { token, newPassword });
                              return response.data;
                    } catch (error: any) {
                              throw error.response?.data?.message || "Failed to reset password.";
                    }
          },

          googleAuth: async (code: string, role: string) => {
                    try {
                              const response = await axios.post(`${apiUrl}/google`, { code, role });
                              return response.data;
                    } catch (error: any) {
                              throw error.response?.data?.message || "Google Sign-In failed.";
                    }
          },

          verifyEmail: async (email: string, token: string) => {
                    const response = await axios.post(`${apiUrl}/verify-email`, { email, token });
                    return response.data;
          },
});