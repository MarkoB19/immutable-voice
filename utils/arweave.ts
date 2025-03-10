import axios from "axios";

export async function fetchAllDocuments() {
  try {
    const query = {
      query: `
      query {
        transactions(
          tags: [{ name: "App-Name", values: ["ImmutableVoice"] }]
          first: 50
        ) {
          edges {
            node {
              id
              tags {
                name
                value
              }
            }
          }
        }
      }`
    };

    const response = await axios.post("https://arweave.net/graphql", query, {
      headers: { "Content-Type": "application/json" }
    });

    return response.data.data.transactions.edges.map((tx: any) => {
      const tags = Object.fromEntries(tx.node.tags.map((t: any) => [t.name, t.value]));
      return {
        id: tx.node.id,
        title: tags.Title || "Untitled",
        description: tags.Description || "No description",
        keywords: tags.Keywords ? tags.Keywords.split(",") : [],
        url: `https://arweave.net/${tx.node.id}`,
        contentType: tags["Content-Type"] || "",
      };
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return [];
  }
}

export async function fetchDocumentContent(url: string) {
  try {
    const response = await fetch(url);
    return await response.text();
  } catch (error) {
    console.error("Error fetching document content:", error);
    return "";
  }
}
