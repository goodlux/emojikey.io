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

// Handle API key display and generation
async function showApiKey(userId) {
  const loginButton = document.getElementById("loginButton");
  const apiTokenDiv = document.getElementById("apiToken");

  try {
    let { data, error } = await supabase
      .from("api_keys")
      .select("api_key")
      .eq("user_id", userId)
      .single();

    if (error) throw error;

    if (!data) {
      // Create new row, Postgres will generate the api_key
      const { data: newKey, error: insertError } = await supabase
        .from("api_keys")
        .insert([{ user_id: userId }])
        .select()
        .single();

      if (insertError) throw insertError;
      apiTokenDiv.textContent = newKey.api_key;
    } else {
      apiTokenDiv.textContent = data.api_key;
    }

    apiTokenDiv.style.display = "block";
    loginButton.textContent = "Logged in with GitHub";
    loginButton.disabled = true;

    // Smooth scroll to the section
    document.querySelector("#login-section").scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  } catch (error) {
    console.error("Error managing API key:", error);
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
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (session) {
      // If already logged in, just show API key without page reload
      await showApiKey(session.user.id);
      return;
    }

    // Only do OAuth redirect if no session exists
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
  if (session) {
    await showApiKey(session.user.id);
  }
});

// Auth state listener
supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    showApiKey(session.user.id);
  }
});

// Export Logout handler for use in HTML
window.handleLogout = handleLogout;
