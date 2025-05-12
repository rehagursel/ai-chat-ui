import api from "./api";

interface ApiResponse<T> {
    success: boolean;
    data: T;
}

interface LoginResponse {
    token: string;
    userId: string;
}

export const auth = {
    login: async (username: string) => {
        const response = await api.post<ApiResponse<LoginResponse>>("/auth/login", { username });
        return response.data.data;
    }
}; 