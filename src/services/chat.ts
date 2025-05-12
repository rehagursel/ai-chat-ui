import api from "./api";

interface ApiResponse<T> {
    success: boolean;
    data: T;
}

interface Message {
    _id: string;
    userId: string;
    characterId: string;
    role: "user" | "ai";
    text: string;
    timestamp: string;
}

interface StreamData {
    type: "userMessage" | "chunk" | "aiMessage";
    message?: Message;
    content?: string;
}

export const chat = {
    getChatHistory: async (characterId: string) => {
        const response = await api.get<ApiResponse<Message[]>>(`/chat/history/${characterId}`);
        return response.data.data;
    },

    sendMessage: async (
        characterId: string,
        message: string,
        onStreamData: (data: StreamData) => void
    ) => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/chat/stream`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ message, characterId }),
        });

        if (!response.ok) {
            throw new Error("Failed to send message");
        }

        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error("No reader available");
        }

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
                if (line.trim() === "") continue;
                if (line.startsWith("data: ")) {
                    const data = line.slice(6);
                    if (data === "[END]") {
                        break;
                    }
                    try {
                        onStreamData({
                            type: "chunk",
                            content: data + " "
                        });
                    } catch (error) {
                        console.error("Failed to parse stream data:", error);
                    }
                }
            }
        }
    }
}; 