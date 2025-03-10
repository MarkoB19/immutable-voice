export async function authenticateWithArConnect() {
  try {
    if (window.arweaveWallet) {
      await window.arweaveWallet.connect(["ACCESS_ADDRESS"]);
      const address = await window.arweaveWallet.getActiveAddress();
      
      localStorage.setItem("userAddress", address); // 📌 Spremi u localStorage

      return address;
    } else {
      alert("Please install ArConnect wallet.");
      return null;
    }
  } catch (error) {
    console.error("Authentication failed:", error);
    return null;
  }
}

