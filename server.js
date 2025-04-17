const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.json());

const memPath = path.join(__dirname, "data", "builder_memory.json");

// --- ROUTE de test ---
app.get("/", (req, res) => {
  res.send("✅ BuilderGPT est en ligne !");
});

// --- ROUTE /analyse ---
app.post("/analyse", (req, res) => {
  const { intention } = req.body;
  const plan = `Analyse automatique de l'intention : "${intention}" → génération du nom, CARE prompt, fichiers.`;
  res.json({ plan });
});

// --- ROUTE /genere-bundle ---
app.post("/genere-bundle", (req, res) => {
  const { nom_agent, intention } = req.body;
  const lien = `https://tonserveur.com/gpts/${nom_agent.replace(/\s/g, "-").toLowerCase()}.zip`;
  res.json({ zip_link: lien });
});

// --- ROUTE /log-memoire ---
app.post("/log-memoire", (req, res) => {
  const log = {
    ...req.body,
    type: "log",
    date: new Date().toISOString()
  };

  try {
    const data = JSON.parse(fs.readFileSync(memPath));
    data.historique = data.historique || [];
    data.historique.push(log);
    fs.writeFileSync(memPath, JSON.stringify(data, null, 2));
    res.json({ status: "log enregistré" });
  } catch (err) {
    console.error("Erreur mémoire :", err);
    res.status(500).json({ error: "Erreur écriture mémoire" });
  }
});

// --- ROUTE /memoire-chat (fiabilisée) ---
app.post("/memoire-chat", (req, res) => {
  const contenu = req.body.contenu;

  if (!contenu || typeof contenu !== "string") {
    return res.status(400).json({ error: "Contenu invalide ou manquant" });
  }

  const chat = {
    type: "chat",
    contenu,
    date: new Date().toISOString()
  };

  try {
    const data = JSON.parse(fs.readFileSync(memPath));
    data.historique = data.historique || [];
    data.historique.push(chat);
    fs.writeFileSync(memPath, JSON.stringify(data, null, 2));
    res.json({ status: "chat enregistré" });
  } catch (err) {
    console.error("Erreur mémoire :", err);
    res.status(500).json({ error: "Erreur écriture mémoire" });
  }
});

// --- ROUTE /consulte-memoire ---
app.get("/consulte-memoire", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(memPath));
    const max = parseInt(req.query.limit) || 10;
    const extrait = data.historique.slice(-max).reverse();
    res.json({ extrait });
  } catch (err) {
    console.error("Erreur lecture mémoire :", err);
    res.status(500).json({ error: "Impossible de lire la mémoire" });
  }
});

// --- ROUTE /reset-memoire ---
app.delete("/reset-memoire", (req, res) => {
  try {
    const current = JSON.parse(fs.readFileSync(memPath));
    const reset = {
      ...current,
      historique: []
    };
    fs.writeFileSync(memPath, JSON.stringify(reset, null, 2));
    res.json({ status: "mémoire effacée" });
  } catch (err) {
    console.error("Erreur reset mémoire :", err);
    res.status(500).json({ error: "Impossible de réinitialiser la mémoire" });
  }
});

// --- Lancement du serveur ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 BuilderGPT écoute sur le port ${PORT}`);
});
