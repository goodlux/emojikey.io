// Supabase configuration
const SUPABASE_URL = "https://dasvvxptyafaiwkmmmqz.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhc3Z2eHB0eWFmYWl3a21tbXF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2MTM1NjEsImV4cCI6MjA0OTE4OTU2MX0.y9L2TahBajkUPQGJJ15kEckMK3sZDzuNL-2Mrmg_KoU";

// Environment detection
const isLocal =
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname === "localhost";
const redirectUrl = isLocal ? "https://127.0.0.1:3000" : "https://emojikey.io";

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
  },
});

async function checkAuth() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  console.log("Current auth state:", {
    hasSession: !!session,
    userId: session?.user?.id,
    error,
    accessToken: session?.access_token?.slice(0, 20) + "...", // just show start of token
  });
  return session;
}

// Handle API key display and generation
async function showApiKey(userId) {
  console.log("Showing API key for user:", userId);
  const loginButton = document.getElementById("loginButton");
  const apiTokenDiv = document.getElementById("apiToken");

  try {
    // First try to get existing API key
    let { data, error } = await supabase
      .from("api_keys")
      .select("api_key")
      .eq("user_id", userId);

    console.log("Initial key check:", { data, error });

    // Only create a new key if we truly have no keys
    if (!data || data.length === 0) {
      console.log("No existing keys found - creating new one");
      const { data: newKey, error: insertError } = await supabase
        .from("api_keys")
        .insert([{ user_id: userId }])
        .select()
        .single();

      if (insertError) throw insertError;

      apiTokenDiv.textContent = newKey.api_key;
    } else {
      // Use the most recent key
      apiTokenDiv.textContent = data[0].api_key;
    }

    apiTokenDiv.style.display = "block";
    loginButton.textContent = "Logged in with GitHub";
    loginButton.disabled = true;

    document.querySelector("#login-section").scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  } catch (error) {
    console.error("Error managing API key:", error);
    apiTokenDiv.textContent = "Error managing API key. Please try again.";
    apiTokenDiv.style.display = "block";
  }
}

// Handle logout
async function handleLogout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error logging out:", error);
  } else {
    const loginButton = document.getElementById("loginButton");
    const apiTokenDiv = document.getElementById("apiToken");

    loginButton.textContent = "Login with GitHub";
    loginButton.disabled = false;
    apiTokenDiv.textContent = "";
    apiTokenDiv.style.display = "none";
  }
}

// Login button handler
document.getElementById("loginButton").addEventListener("click", async () => {
  try {
    const session = await checkAuth();
    console.log("Pre-login check:", { hasSession: !!session });

    if (session) {
      await showApiKey(session.user.id);
      return;
    }

    console.log("No session, starting GitHub OAuth...");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: redirectUrl,
      },
    });
    if (error) throw error;
  } catch (error) {
    console.error("Login error:", error);
  }
});

// Initial auth check
window.addEventListener("load", async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  console.log("Initial load session check:", { hasSession: !!session });
  if (session?.user) {
    // Only try to show API key if we have a user
    await showApiKey(session.user.id);
  }
});

// Auth state listener
supabase.auth.onAuthStateChange((event, session) => {
  console.log("Auth state changed:", { event, hasSession: !!session });
  if (session?.user) {
    // Only try to show API key if we have a user
    showApiKey(session.user.id);
  }
});

// Export Logout handler for use in HTML
window.handleLogout = handleLogout;
