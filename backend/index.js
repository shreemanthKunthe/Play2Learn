const express = require("express");
const cors = require("cors");
const admin = require("./firebaseAdmin");

const app = express();

// Enhanced CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',  // Vite dev server
    'http://127.0.0.1:5173',  // Alternative localhost
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json()); // to parse JSON body

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ✅ Verify Firebase ID Token endpoint
app.post("/verifyToken", async (req, res) => {
  const { token } = req.body;

  if (!token) return res.status(400).json({ error: "Token missing" });

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    // decodedToken has uid, email, etc.
    res
      .status(200)
      .json({
        success: true,
        uid: decodedToken.uid,
        email: decodedToken.email,
      });
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(401).json({ error: "Invalid token" });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
