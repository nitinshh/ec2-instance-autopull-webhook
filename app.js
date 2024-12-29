const express = require("express");
const { exec } = require("child_process");

const app = express();
const PORT = 3002;

// Middleware to parse JSON payloads from GitHub webhook
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Webhook endpoint
app.post("/gitWebhook", (req, res) => {
  try {
    const repoPath = "https://github.com/nitinshh/ec2-instance-autopull-webhook"; // Update this to your repository path

    // Log payload for debugging
    console.log("Received webhook payload:", req.body);

    // Ensure it's a push event
    if (req.body.ref && req.body.ref === "refs/heads/main") {
      console.log("Push event detected. Pulling latest changes...");

      // Execute the git pull command
      exec(`cd ${repoPath} && git pull`, (error, stdout, stderr) => {
        if (error) {
          console.error('Error during git pull:' `${error.message}`);
          return res.status(500).send("Error during git pull");
        }

        console.log('Git pull stdout:' `${stdout}`);
        console.error('Git pull stderr:' `${stderr}`);
        res.status(200).send("Git pull executed successfully");
      });
    } else {
      console.log("Non-main branch push or invalid event. Ignoring...");
      res.status(200).send("No action taken");
    }
  } catch (error) {
    console.error("Error handling webhook:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/",(req,res)=>{
  console.log("This is test")
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});