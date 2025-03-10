import Arweave from "arweave";
import axios from "axios";

// 🔹 1️⃣ Inicijalizacija Arweave klijenta
const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
});

// 🔹 2️⃣ Funkcija za upload dokumenta na Arweave

export async function uploadToArweave(file: File, userAddress: string, title: string, description: string, keywords: string) {
  try {
    const buffer = await file.arrayBuffer();
    const transaction = await arweave.createTransaction({ data: buffer });

    transaction.addTag("Content-Type", file.type);
    transaction.addTag("Uploader", userAddress || "Anonymous");
    transaction.addTag("App-Name", "ImmutableVoice");
    transaction.addTag("Title", title || "No title");
    transaction.addTag("Description", description || "No description");
    transaction.addTag("Keywords", keywords || "No keywords");

    await arweave.transactions.sign(transaction);
    await arweave.transactions.post(transaction);

    return `https://arweave.net/${transaction.id}`;
  } catch (error) {
    console.error("Failed to upload to Arweave:", error);
    return null;
  }
}



// 🔹 3️⃣ Funkcija za dohvaćanje korisnikovih dokumenata s Arweave mreže

export async function fetchAllDocuments() {
  try {
    const query = {
      query: `
        query {
          transactions(
            tags: [{ name: "App-Name", values: ["ImmutableVoice"] }]
            first: 10
          ) {
            edges {
              node {
                id
                block {
                  timestamp
                }
                tags {
                  name
                  value
                }
              }
            }
          }
        }
      `,
    };

    const response = await axios.post("https://arweave.net/graphql", query, {
      headers: { "Content-Type": "application/json" },
    });

    const transactions = response.data.data.transactions.edges || [];

    return transactions.map((tx: any) => {
      const titleTag = tx.node.tags.find((t: any) => t.name === "Title");
      const descriptionTag = tx.node.tags.find((t: any) => t.name === "Description");

      return {
        id: tx.node.id,
        url: `https://arweave.net/${tx.node.id}`,
        title: titleTag ? titleTag.value : "No title", // 📌 Postavi default ako nema title
        description: descriptionTag ? descriptionTag.value : "No description", // 📌 Postavi default ako nema description
        timestamp: tx.node.block ? new Date(tx.node.block.timestamp * 1000).toLocaleString() : "Pending",
      };
    });
  } catch (error) {
    console.error("Failed to fetch documents:", error);
    return [];
  }
}
