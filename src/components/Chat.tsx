import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { chat } from "../services/chat";
import "../styles/main.scss";
import "./Chat.scss";

interface Message {
    _id: string;
    userId: string;
    characterId: string;
    role: "user" | "ai";
    text: string;
    timestamp: string;
}

interface ChatProps {
    characterId: string;
    characterName: string;
}

interface StreamData {
    type: "userMessage" | "chunk" | "aiMessage";
    message?: Message;
    content?: string;
}

const Chat: React.FC<ChatProps> = ({ characterId, characterName }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [streamingMessage, setStreamingMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { userId, logout } = useAuth();

    useEffect(() => {
        if (characterId) {
            loadChatHistory();
        }
    }, [characterId]);

    const loadChatHistory = async () => {
        try {
            const history = await chat.getChatHistory(characterId);
            setMessages(history);
        } catch (error) {
            console.error("Failed to load chat history:", error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, streamingMessage]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setIsLoading(true);
        setStreamingMessage("");

        const userMessage: Message = {
            _id: Date.now().toString(),
            userId: userId!,
            characterId,
            role: "user",
            text: newMessage,
            timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, userMessage]);
        setNewMessage("");

        let currentStreamMessage = "";

        try {
            await chat.sendMessage(characterId, newMessage, (data: StreamData) => {
                console.log("Stream data:", data);

                if (data.type === "chunk" && data.content) {
                    currentStreamMessage += data.content;
                    setStreamingMessage(currentStreamMessage);
                }
            });

            if (currentStreamMessage) {
                const aiMessage: Message = {
                    _id: Date.now().toString(),
                    userId: userId!,
                    characterId,
                    role: "ai",
                    text: currentStreamMessage.trim(),
                    timestamp: new Date().toISOString()
                };
                setMessages(prev => [...prev, aiMessage]);
                setStreamingMessage("");
            }
        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chat">
            <div className="chat__header">
                <h2>{characterName}</h2>
                <button onClick={logout} className="chat__logout-button">Logout</button>
            </div>
            
            <div className="chat__messages">
                {messages.map((message) => (
                    <div
                        key={message._id}
                        className={`chat__message chat__message--${message.role}`}
                    >
                        <div className="chat__message-content">
                            <p>{message.text}</p>
                            <small>
                                {new Date(message.timestamp).toLocaleTimeString()}
                            </small>
                        </div>
                    </div>
                ))}
                {streamingMessage && (
                    <div className="chat__message chat__message--ai">
                        <div className="chat__message-content">
                            <p>{streamingMessage}</p>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="chat__form">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="chat__input"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="chat__button"
                >
                    {isLoading ? "Sending..." : "Send"}
                </button>
            </form>
        </div>
    );
};

export default Chat; 