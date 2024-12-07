import React, { useState } from "react"; // Add useState
import { useAuth0 } from "@auth0/auth0-react"; // Make sure we have this
import "./App.css";

function LoginButton() {
  const { loginWithRedirect } = useAuth0();
  return <button onClick={() => loginWithRedirect()}>Log In</button>;
}

function LogoutButton() {
  const { logout } = useAuth0();
  return (
    <button onClick={() => logout({ returnTo: window.location.origin })}>
      Log Out
    </button>
  );
}

function ApiKeyManager() {
  const { getAccessTokenSilently } = useAuth0();
  const [apiKey, setApiKey] = React.useState(null);
  const [error, setError] = React.useState(null);

  const fetchApiKey = async () => {
    try {
      console.log("Fetching access token...");
      const token = await getAccessTokenSilently();
      console.log("Got token:", token.slice(0, 10) + "...");

      console.log("Fetching API key...");
      const response = await fetch(
        "https://3xkgfu1c7h.execute-api.us-east-2.amazonaws.com/api-key",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("API response:", data);
      setApiKey(data.apiKey);
    } catch (error) {
      console.error("Full error:", error);
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>API Key Management</h2>
      {error && (
        <div style={{ color: "red", margin: "10px 0" }}>Error: {error}</div>
      )}
      {apiKey ? (
        <div>
          <p>Your API Key:</p>
          <code
            style={{ background: "#f0f0f0", padding: "10px", display: "block" }}
          >
            {apiKey}
          </code>
          <p>Use this configuration in your MCP setup:</p>
          <pre style={{ background: "#f0f0f0", padding: "10px" }}>
            {`{
  "provider": "emojikey",
  "apiKey": "${apiKey}",
  "endpoint": "https://api.emojikey.io"
}`}
          </pre>
        </div>
      ) : (
        <button onClick={fetchApiKey}>Generate API Key</button>
      )}
    </div>
  );
}

function App() {
  const { isAuthenticated, isLoading, user, error } = useAuth0();

  console.log("Auth state:", {
    isAuthenticated,
    isLoading,
    user,
    error: error
      ? {
          message: error.message,
          stack: error.stack,
          name: error.name,
        }
      : null,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <h2>Authentication Error:</h2>
        <pre
          style={{
            background: "#f0f0f0",
            padding: "20px",
            margin: "20px",
            whiteSpace: "pre-wrap",
          }}
        >
          {JSON.stringify(
            {
              message: error.message,
              name: error.name,
              stack: error.stack,
            },
            null,
            2,
          )}
        </pre>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        {isAuthenticated ? (
          <>
            <p>Welcome, {user?.email}</p>
            <ApiKeyManager />
            <EmojiPatternManager />
            <LogoutButton />
          </>
        ) : (
          <>
            <p>Please log in to continue</p>
            <LoginButton />
          </>
        )}
      </header>
    </div>
  );
}

function EmojiPatternManager() {
  const { getAccessTokenSilently } = useAuth0(); // Get the auth function
  const [pattern, setPattern] = useState("");
  const [modelId, setModelId] = useState("");

  const storePattern = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(
        "https://3xkgfu1c7h.execute-api.us-east-2.amazonaws.com/emojikey/pattern",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            modelId,
            pattern,
          }),
        },
      );
      const data = await response.json();
      console.log("Stored pattern:", data);
    } catch (error) {
      console.error("Error storing pattern:", error);
    }
  };

  return (
    <div>
      <h2>Emoji Pattern Manager</h2>
      <div>
        <input
          value={modelId}
          onChange={(e) => setModelId(e.target.value)}
          placeholder="Model ID"
        />
        <input
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          placeholder="48-character emoji pattern"
        />
        <button onClick={storePattern}>Store Pattern</button>
      </div>
    </div>
  );
}

export default App;
