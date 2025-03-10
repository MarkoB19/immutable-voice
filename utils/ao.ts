export async function authenticateUser() {
  try {
    const response = await fetch("https://ao-network.example.com/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error("Failed to authenticate");

    const data = await response.json();
    console.log("Authenticated as:", data.did);
    return data.did;
  } catch (error) {
    console.error("AO authentication failed:", error);
    return null;
  }
}
