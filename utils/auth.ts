export async function authenticateWithArConnect() {
  if (typeof window === "undefined" || !window.arweaveWallet) {
    alert("Please install ArConnect extension to authenticate.");
    return null;
  }

  try {
    await window.arweaveWallet.connect(["ACCESS_ADDRESS"]);
    const address = await window.arweaveWallet.getActiveAddress();

    // Spremamo autentifikaciju u LocalStorage
    localStorage.setItem("userAddress", address);

    console.log("Authenticated ArConnect Address:", address);
    return address;
  } catch (error) {
    console.error("ArConnect authentication failed:", error);
    return null;
  }
}
