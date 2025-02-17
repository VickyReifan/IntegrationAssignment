require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 8054;

app.get("/erp/accounts", (req, res) => {
  // Simulated ERP account data
  const accounts = [
    { id: 1, name: "ABN", industry: "Manufacturing" },
    { id: 2, name: "Globex Inc", industry: "Finance" },
    { id: "a", name: "Globex Inc", industry: "Finance" },
    { id: 3, name: "", industry: "Finance" },
  ];
  res.json(accounts);
});

app.listen(port, "localhost", () => {
  console.log(`Mock ERP service listening on port ${port}`);
});
