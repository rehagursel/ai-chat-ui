import React, { useState } from "react";
import { useAuth } from "./contexts/AuthContext";
import Chat from "./components/Chat";
import "./styles/main.scss";
import "./App.scss";

const App: React.FC = () => {
    const { isAuthenticated, login } = useAuth();
    const [username, setUsername] = useState("");

    const handleLogin = async () => {
        try {
            await login(username);
        } catch (err) {
            console.error(err);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="app app--login">
                <div className="app__login-container">
                    <h2>Login</h2>
                    <input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="app__login-input"
                    />
                    <button
                        onClick={handleLogin}
                        className="app__login-button"
                    >
                        Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="app">
            <Chat characterName="AI Assistant" />
        </div>
    );
};

export default App;
