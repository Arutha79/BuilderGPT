const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.json());

// --- ROUTE de test simple ---
app.get("/", (req, res) => {
  res.send("✅ BuilderGPT est en ligne !");
});

// --- ROUTE /analyse ---
app.post("/analyse", (req, res) => {
  const { intention } = req.body;
  const plan = `Analyse automatique de l'intention : "${intention}" → génération du nom, CARE prompt, fichiers.`;
  res.json({ plan });
});

// --- ROUTE /genere-bundle (exemple simulé) ---
app.post("/genere-bundle", (req, res) => {
  const { nom_agent, intention } = req.body;
  const lien = `https://tonserveur.com/gpts/${nom_agent.replace(/\s/g, "-").toLowerCase()}.zip`;
  res.json({ zip_link: lien });
});

// --- ROUTE /log-memoire ---
app.post("/log-memoire", (req, res) => {
  const memPath = path.join(__dirname, "data", "builder_memory.json");
  const log = req.body;

  try {
    const data = JSON.parse(fs.readFileSync(memPath));
    data.historique.push(log);
    fs.writeFileSync(memPath, JSON.stringify(data, null, 2));
    res.json({ message: "🧠 Mémoire mise à jour avec succès." });
  } catch (err) {
    res.status(500).json({ error: "Erreur mémoire", details: err.message });
  }
});

// --- ROUTE /memoire-chat (archive une session entière) ---
app.post("/memoire-chat", (req, res) => {
  const memPath = path.join(__dirname, "data", "builder_memory.json");
  const

