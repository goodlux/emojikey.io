const supabaseUrl = "https://dasvvxptyafaiwkmmmqz.supabase.co";
const supabaseAnonKey =
  "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhc3Z2eHB0eWFmYWl3a21tbXF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2MTM1NjEsImV4cCI6MjA0OTE4OTU2MX0.y9L2TahBajkUPQGJJ15kEckMK3sZDzuNL-2Mrmg_KoU";
const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

document.getElementById("loginButton").addEventListener("click", async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
    });
    if (error) throw error;
    console.log("Logged in:", data);
  } catch (error) {
    console.error("Error:", error.message);
  }
});

document.getElementById("logoutButton").addEventListener("click", async () => {
  await supabase.auth.signOut();
  window.location.href = "https://github.com/logout";
});
