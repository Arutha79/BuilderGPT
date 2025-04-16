app.post("/analyse", (req, res) => {
  const { intention } = req.body;
  // Analyse logique ici (à coder ou simulé pour l'instant)
  res.json({ plan: `Analyse de l'intention : ${intention}` });
});

app.post("/genere-bundle", async (req, res) => {
  const { nom_agent, intention } = req.body;
  // Appelle interne à génération (à intégrer selon ton système)
  const lien_zip = `https://tonserveur.com/gpts/${nom_agent}.zip`;
  res.json({ zip_link: lien_zip });
});

app.post("/log-memoire", (req, res) => {
  const fs = require("fs");
  const memPath = "./data/builder_memory.json";
  const newLog = req.body;
  const memData = JSON.parse(fs.readFileSync(memPath));
  memData.historique.push(newLog);
  fs.writeFileSync(memPath, JSON.stringify(memData, null, 2));
  res.json({ message: "Mémoire mise à jour avec succès." });
});
