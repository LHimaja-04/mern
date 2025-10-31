import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// ✅ Correct absolute path to your frontend folder
const frontendPath = path.join(__dirname, "../../frontend");

// ✅ Serve all static files (JS, CSS, images, etc.)
app.use(express.static(frontendPath));

// ✅ Handle all routes by sending the React index.html file
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

