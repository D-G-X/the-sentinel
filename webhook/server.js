import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

app.post("/", async (req, res) => {
    console.log("📩 Webhook received!");

    const event = req.headers["x-github-event"];

    if (event === "pull_request") {
        const action = req.body.action;

        if (action === "opened" || action === "synchronize") {
            const pr = req.body.pull_request;

            console.log("📢 PR Title:", pr.title);
            console.log("🔗 PR URL:", pr.html_url);

            const filesUrl = pr.url + "/files";

            try {
                const response = await axios.get(filesUrl, {
                    headers: {
                        Authorization:                  `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`
                    }
                });

                const files = response.data;

                files.forEach(file => {
                    console.log("\n📄 File:", file.filename);
                    console.log("🧩 Changes:\n", file.patch);
                });

            } catch (err) {
                console.error("❌ Error fetching files:", err.message);
            }
        }
    }

    res.sendStatus(200);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});